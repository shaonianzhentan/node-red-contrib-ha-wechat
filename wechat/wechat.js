const CryptoUtil = require('../lib/CryptoUtil')
const HomeAssistant = require('../lib/HomeAssistant')

module.exports = function (RED) {
    RED.nodes.registerType('ha-wechat', function (config) {
        RED.nodes.createNode(this, config);
        const node = this
        const { hassUrl, hassToken, topic, uid } = config
        const server = RED.nodes.getNode(config.server);
        if (server && hassUrl && hassToken && topic && uid) {
            server.register(this)
            const ha = new HomeAssistant({ hassUrl, hassToken })
            // 消息临时存储
            const list = []
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

                    node.send({ payload: content })

                    // 文本识别
                    const res = await ha.postApi('conversation/process', { text: content })
                    const { speech, extra_data } = res.speech.plain
                    console.log(speech)
                    // 返回结果
                    let result = speech
                    // 额外信息
                    if (extra_data) {
                        if (extra_data.type == 'entity') {
                            if (Array.isArray(extra_data.data)) {
                                const entity_id = extra_data.data[0]
                                const domain = entity_id.split('.')[0]
                                // 如果是摄像头，则获取图片
                                if (domain == 'camera') {
                                    const entity = await ha.getApi(`states/${entity_id}`)
                                    const attributes = entity.attributes
                                    let entity_picture = attributes.entity_picture
                                    if (entity_picture) {
                                        const picurl = ha.getURL(entity_picture)
                                        // 返回结果
                                        result = [
                                            {
                                                title: attributes.friendly_name,
                                                description: speech,
                                                picurl: picurl,
                                                url: picurl
                                            }
                                        ]
                                    }
                                }
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
                    console.log(ex)
                    node.status({ fill: "red", shape: "ring", text: JSON.stringify(ex) });
                }
            })
        } else {
            this.status({ fill: "red", shape: "ring", text: "未配置相关信息" });
        }
    })
}