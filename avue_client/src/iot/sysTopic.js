export default class sysTopic {
	// 前缀
	static prefix = "/blade" + "/sys";

	// 构造基于产品密钥和设备名称的 topic 前缀
	static getTopicPrefix (productKey, deviceName) {
		return `${this.prefix}/${productKey}/${deviceName}/`;
	}

	// 设备属性上报
	static getPropertyPost (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/event/property/post";
	}

	// 云端响应设备属性上报
	static getPropertyPostReply (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/event/property/post_reply";
	}

	// 云端下发设备属性
	static getServicePropertySet (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/service/property/set";
	}

	// 设备响应云端下发设备属性
	static getServicePropertySetReply (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/service/property/set_reply";
	}

	// 云端获取设备属性
	static getServicePropertyGet (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/service/property/get";
	}

	// 设备响应云端获取设备属性
	static getServicePropertyGetReply (productKey, deviceName) {
		return this.getTopicPrefix(productKey, deviceName) + "thing/service/property/get_reply";
	}

	// 设备事件上报
	static getEventPost (productKey, deviceName, identifier) {
		return this.getTopicPrefix(productKey, deviceName) + `thing/event/${identifier}/post`;
	}

	// 云端响应设备事件上报
	static getEventPostReply (productKey, deviceName, identifier) {
		return this.getTopicPrefix(productKey, deviceName) + `thing/event/${identifier}/post_reply`;
	}

	// 云端下发设备命令
	static getServiceCommand (productKey, deviceName, identifier) {
		return this.getTopicPrefix(productKey, deviceName) + `thing/service/${identifier}`;
	}

	// 设备响应云端下发设备命令
	static getServiceCommandReply (productKey, deviceName, identifier) {
		return this.getTopicPrefix(productKey, deviceName) + `thing/service/${identifier}_reply`;
	}
}
