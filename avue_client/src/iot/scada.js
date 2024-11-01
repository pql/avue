let list = [{
	label: '按钮',
	len: 6
}, {
	label: '泵',
	len: 68
}, {
	label: '储水',
	len: 72
}, {
	label: '发动机',
	len: 52
}, {
	label: '阀门',
	len: 40
}, {
	label: '工业机器',
	len: 72
}, {
	label: '鼓风机',
	len: 40
}, {
	label: '锅炉',
	len: 40
}, {
	label: '建筑',
	len: 64
}, {
	label: '交通运输',
	len: 52
}, {
	label: '水处理',
	len: 104
}, {
	label: '天气',
	len: 22
}, {
	label: '物料设备',
	len: 48
}, {
	label: '植物',
	len: 48
}, {
	label: '安全',
	len: 48
}]

export default () => {
	let result = [];
	list.forEach(ele => {
		ele.list = []
		for (let i = 0; i < ele.len; i++) {
			let index = i + 1;
			ele.list.push({
				label: ele.label + index,
				value: `/img/scada/${ele.label}/${index}.png`
			})
		}
		result.push(ele);
	})
	return result;
}