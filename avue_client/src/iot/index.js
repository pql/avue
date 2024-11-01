import mqtt from 'mqtt';
import func from '@avue/avue-data/iot/func'
import sysTopic from '@avue/avue-data/iot/sysTopic';
import MqttConfig from '@avue/avue-data/iot/MqttConfig';
import { getGlobValue } from '@avue/avue-data/utils/utils'
class Iot {
	constructor({ productKey, deviceName, deviceSecret, connect, message, params = [], type, user, passwd, time }) {
		this.params = params;
		this.localProperty = {}
		this.client = null;
		this.time = time || 500;
		this.check = null;
		this.connectFn = connect;
		this.messageFn = message
		this.mqttUrl = window.$website.mqttUrl;
		this.productKey = productKey
		this.deviceName = deviceName
		this.deviceSecret = deviceSecret
		let clientId = func.generateUUID();
		let username = getGlobValue(user)
		let password = getGlobValue(passwd)
		if (type == 0) {
			const config = new MqttConfig(this.productKey, this.deviceName, this.deviceSecret, `${this.deviceName}-debugger`);
			if (config) {
				clientId = config.mqttClientId();
				username = config.username();
				password = config.password();
			}
		}

		// 创建客户端
		this.client = mqtt.connect(this.mqttUrl, {
			clientId,
			username,
			password,
			connectTimeout: 5000
		});
		this.messageFn()
		this.client.on('connect', () => {
			this.init()
			this.messageFn()
		})
		this.client.on('error', () => {
			this.messageFn()
		})
		return this;
	}
	init () {
		// 订阅主题
		this.onSubscribe();
		// 监听消息
		this.onMessage();
		//循环监听
		this.onListen();
	}
	onListen () {
		this.check = setInterval(() => {
			if (this.client.connected == true) {
				this.sendProperty(this.params, 'get')
			} else {
				clearInterval(this.check)
			}
		}, this.time)
	}
	sendProperty (data, action) {
		let topic = '';
		if (action === 'get') {
			topic = sysTopic.getServicePropertyGet(this.productKey, this.deviceName);
		} else if (action === 'set') {
			topic = sysTopic.getServicePropertySet(this.productKey, this.deviceName);
		}
		const req = {
			id: func.generateUUID(),
			version: '1.0',
			params: data
		};
		const message = JSON.stringify(req);
		this.publish(topic, message);
	}
	publish (topic, message) {
		this.client.publish(topic, message, (err) => {
			if (err) {
				console.log(err)
			}
		});
	}
	onSubscribe () {

		// 设备响应云端获取设备属性
		this.client.subscribe(sysTopic.getServicePropertyGetReply(this.productKey, this.deviceName), function (err) {
			if (!err) {
				console.log('ServicePropertyGetReply 订阅成功');
			} else {
				console.log('ServicePropertyGetReply 订阅失败', err);
			}
		});

		// 设备响应云端设置设备属性
		this.client.subscribe(sysTopic.getServicePropertySetReply(this.productKey, this.deviceName), function (err) {
			if (!err) {
				console.log('ServicePropertySetReply 订阅成功');
			} else {
				console.log('ServicePropertySetReply 订阅失败', err);
			}
		});

	}
	onMessage () {
		// 接收订阅消息
		this.client.on('message', (topic, message) => {
			// 	console.log('mqtt message received', topic, message.toString());
			if (topic === sysTopic.getServicePropertyGetReply(this.productKey, this.deviceName)) {
				// 设备响应云端获取设备属性
				const data = JSON.parse(message.toString());
				this.messageFn(data.params)
				return;
			}

			if (topic === sysTopic.getServicePropertySetReply(this.productKey, this.deviceName)) {
				// 设备响应云端设置设备属性
			}
		});
	}
}

export default Iot;