
import mqtt from 'mqtt';
import { mqttUrl } from '@avue/avue-data/config'
import { uuid } from '@avue/avue-data/utils/utils'
export default (id) => {
	const client = mqtt.connect(mqttUrl, {
		clientId: uuid() + '_' + id
	})
	client.on("connect", () => {
		const control_keys = 'control_' + id;
		client.subscribe(control_keys, () => {
			console.log(`Subscribe to topic '${control_keys}'`)
		})
		client.on('message', (topic, message) => {
			let data = JSON.parse(message)
			if (data.type == 'group') {
				window.$glob.group = data.id;
			}
		})
	})
}