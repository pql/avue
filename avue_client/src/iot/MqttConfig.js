import CryptoJS from 'crypto-js';
import {
	validatenull
} from '@avue/avue-data/echart/util'

class MqttConfig {
	constructor(productKey, deviceName, deviceSecret, clientId) {
		const timestamp = new Date().getTime();
		this.clientId = validatenull(clientId) ? deviceName : clientId + "-" + timestamp
		this.deviceName = deviceName;
		this.productKey = productKey;
		this.deviceSecret = deviceSecret;
		this.timestamp = timestamp;
	}

	mqttClientId () {
		// clienttype=2 表示pc和web连接，timestamp为时间戳必须
		return `${this.clientId}|clienttype=2,timestamp=${this.timestamp}|`;
	}

	username () {
		return `${this.deviceName}&${this.productKey}`;
	}

	password () {
		const value = `clientId${this.clientId}deviceName${this.deviceName}productKey${this.productKey}timestamp${this.timestamp}`;
		return this.hmacMd5Hex(value, this.deviceSecret);
	}

	hmacMd5Hex (value, key) {
		const hash = CryptoJS.HmacMD5(value, key);
		return hash.toString(CryptoJS.enc.Hex);
	}
}

export default MqttConfig;