# 已停止更新维护，请使用HomeAssistant插件版本
https://github.com/shaonianzhentan/ha_wechat

# node-red-contrib-ha-wechat
使用微信公众号控制Home Assistant里的智能设备

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://flows.nodered.org/node/node-red-contrib-ha-wechat)
[![home-assistant](https://img.shields.io/badge/Home-Assistant-%23049cdb)](https://www.home-assistant.io/)
[![NPM version](https://img.shields.io/npm/v/node-red-contrib-ha-wechat.svg?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-ha-wechat)

![visit](https://visitor-badge.glitch.me/badge?page_id=shaonianzhentan.node-red-contrib-ha-wechat&left_text=visit)
![forks](https://img.shields.io/github/forks/shaonianzhentan/node-red-contrib-ha-wechat)
![stars](https://img.shields.io/github/stars/shaonianzhentan/node-red-contrib-ha-wechat)
![license](https://img.shields.io/github/license/shaonianzhentan/node-red-contrib-ha-wechat)

## 使用说明

注意：本服务使用公共MQTT开放服务，消息采用加密传输，如遇异常信息，请联系我

- 首先需要先关注公众号
- 然后发送 `打开控制模式` 获取订阅主题和用户ID
- 发送命令后，进入控制模式
- 在NodeRED中配置相关信息
- 配置完成后部署应用
- 最后微信就可以发送控制命令啦
- 如果不想使用了，发送 `关闭控制模式`

公共MQTT服务：https://www.emqx.com/zh/mqtt/public-mqtt5-broker
```yaml
MQTT服务：broker-cn.emqx.io
MQTT端口：1883
```

## 功能截图

![img](https://cdn.jsdelivr.net/gh/shaonianzhentan/image@main/node-red-contrib-ha-wechat/1.png)
![img](https://cdn.jsdelivr.net/gh/shaonianzhentan/image@main/node-red-contrib-ha-wechat/2.png)
![img](https://cdn.jsdelivr.net/gh/shaonianzhentan/image@main/node-red-contrib-ha-wechat/3.png)

## 更新日志

### 1.0.1
- 修复主题订阅失败问题
- camera支持图文消息返回

### 1.0.0
- 支持微信消息桥接

## 如果这个项目对你有帮助，请我喝杯<del style="font-size: 14px;">咖啡</del>奶茶吧😘
|  |支付宝|微信|
|---|---|---|
奶茶= | <img src="https://cdn.jsdelivr.net/gh/shaonianzhentan/ha-docs@master/docs/img/alipay.png" align="left" height="160" width="160" alt="支付宝" title="支付宝">  |  <img src="https://cdn.jsdelivr.net/gh/shaonianzhentan/ha-docs@master/docs/img/wechat.png" align="left" height="160" width="160" alt="微信支付" title="微信">

#### 关注我的微信订阅号，了解更多HomeAssistant相关知识
<img src="https://cdn.jsdelivr.net/gh/shaonianzhentan/ha-docs@master/docs/img/wechat-channel.png" align="left" height="160" alt="HomeAssistant家庭助理" title="HomeAssistant家庭助理"> 
