const CryptoUtil = require('../lib/CryptoUtil')
const axios = require('axios')

module.exports = function (RED) {
    RED.nodes.registerType('ha-wechat', function (config) {
        RED.nodes.createNode(this, config);
        const node = this
        const { hassUrl, hassToken, topic, uid } = config
        const server = RED.nodes.getNode(config.server);
        if (server && hassUrl && hassToken && topic && uid) {
            // 消息临时存储
            const list = []
            // 验证URL
            const url = new URL(hassUrl)
            const api = url.origin + '/api/conversation/process'
            node.status({ fill: "green", shape: "ring", text: "配置成功" });
            console.log('订阅主题', topic)
            server.subscribe(topic, { qos: 0 }, async function (mtopic, mpayload, mpacket) {
                const payload = mpayload.toString()
                console.log(payload)
                try {
                    const message = CryptoUtil.decrypt(payload, uid)
                    const { message_id, time, content } = JSON.parse(message)
                    // 判断是否过期
                    const second = Math.round((Date.now() - time) / 1000)
                    if (second > 5) {
                        return node.status({ fill: "red", shape: "ring", text: "消息过期，拒绝执行" });
                    }
                    // 判断是否重复
                    if (list.findIndex(ele => ele.message_id === message_id) >= 0) {
                        return node.status({ fill: "red", shape: "ring", text: "消息重复，拒绝执行" });
                    } else {
                        // 10秒后删除临时标识
                        list.filter(ele => Math.round((Date.now() - ele.time) / 1000) > 10).forEach(ele => {
                            const index = list.findIndex(item => item.message_id === ele.message_id)
                            list.splice(index, 1)
                        })
                    }
                    console.log('消息队列', list.length)
                    // 加入消息队列
                    list.push({ message_id, time })

                    const res = await axios.post(api, { text: content }, {
                        headers: {
                            'content-type': 'application/json',
                            authorization: `Bearer ${hassToken}`
                        }
                    })

                    const { speech, extra_data } = res.data.speech.plain
                    // 返回结果
                    let result = speech
                    // 额外信息
                    if (extra_data) {
                        if (extra_data.type == 'entity') {
                            if (Array.isArray(extra_data.data)) {
                                const entity_id = extra_data.data[0]
                                console.log(entity_id)
                            }
                        }
                    }
                    // 发送消息
                    server.client.publish(`shaonianzhentan/homeassistant/${message_id}`, CryptoUtil.encrypt(JSON.stringify({
                        message_id,
                        content: result
                    }), uid))
                    node.status({ fill: "green", shape: "ring", text: "消息回复成功" });
                } catch (ex) {
                    node.status({ fill: "red", shape: "ring", text: JSON.stringify(ex) });
                }
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: "未配置相关信息" });
        }
    })
}