import { getFunction, convertValue } from '@avue/avue-data/utils/utils'
export default function (list, refList, params, safeIndex) {
	const arrayTree = (list, fn) => {
		list.forEach(ele => {
			if (ele.children) arrayTree(ele.children)
			else fn(ele)
		})
	}
	list.forEach(ele => {
		if (ele.index.length == 0) ele.index = [safeIndex]
		if (ele.type == 'params' || ele.type == 'data') {
			let p = {};
			ele.child.forEach(item => {
				p[item.name] = params[item.value]
			})
			ele.index.forEach(index => {
				let { item } = this.contain.findnav(index)
				if (!item) return
				if (item.children) {
					arrayTree(item.children, (child) => {
						refList[child.index].updateData(p);
					})
				} else {
					refList[index].updateData(p);
				}

			})
		} else if (ele.type == 'group') {
			window.$glob.group = ele.group
		} else if (ele.type == 'href') {
			if (ele.target) {
				window.open(ele.src)
			} else {
				location.href = ele.src
			}
		} else if (ele.type == 'dialog') {
			const oldGroup = window.$glob.group;
			let dialogList = document.getElementsByClassName('dialog')
			let dialog = document.createElement('div');
			const zIndex = 10000 + dialogList.length;
			dialog.className = 'dialog'
			dialog.style.zIndex = zIndex
			dialog.innerHTML = `<div class="dialog__title">${ele.title}</div>`
			document.getElementById('container').append(dialog)
			dialog.addEventListener('click', () => {
				const callback = (index) => {
					let dom = this.container.getListRef(index)
					if (dom) dom.$el.style.display = 'none'
				}
				ele.index.forEach(index => {
					let { item } = this.contain.findnav(index)
					if (item.children) {
						arrayTree(item.children, (child) => {
							callback(child.index)
						})
					} else {
						callback(index)
					}
				})
				window.$glob.group = oldGroup
				dialog.remove()
			})
			const callback = (list) => {
				list.forEach(index => {
					let { item } = this.contain.findnav(index)
					if (!item) return
					const callback = (index) => {
						let styleObj = this.container.getListRef(index)
						if (styleObj) {
							styleObj = styleObj.$el.style
							styleObj.display = 'block'
							styleObj.zIndex = zIndex + 1;
						}
					}
					if (item.children) {
						arrayTree(item.children, (child) => {
							callback(child.index)
						})
					} else {
						callback(index)
					}
				})
			}
			callback(ele.index)
			if (ele.group) {
				window.$glob.group = ele.group
				setTimeout(() => {
					let list = this.contain.allList.filter(item => item.group == ele.group).map(item => item.index);
					callback(list)
				})
			}
		} else if (ele.type == 'display') {
			ele.index.forEach(index => {
				let { item } = this.contain.findnav(index)
				if (!item) return
				const callback = () => {
					let styleObj = this.container.getListRef(index)
					if (styleObj) {
						styleObj = styleObj.$el.style
						if (ele.displayType == '') {
							if (styleObj.display == 'block' || styleObj.display == '') {
								styleObj.display = 'none'
							} else {
								styleObj.display = 'block'
							}
						} else {
							styleObj.display = ele.displayType
						}
					}
				}
				if (item.children) {
					arrayTree(item.children, child => {
						callback(child.index)
					})
				} else {
					callback(index)
				}
			})
		} else if (ele.type == 'fun') {
			let fun = getFunction(ele.fun, true);
			fun(params, refList)
		} else if (ele.type == 'attribute') {
			ele.index.forEach(index => {
				let { item } = this.contain.findnav(index)
				ele.paramsList.forEach(attr => {
					let value = attr.value;
					const ref = refList[index] || {}
					let childOption = ref.dataBind || []
					let obj = childOption.find(param => param.value == attr.label);
					const isIot = item.dataType == '8'
					value = convertValue(value, obj.type);
					if (obj.option) {
						item.option[attr.label] = value;
					} else if (obj && obj.system) {
						if (obj.iot) {
							let data = {};
							data[attr.label] = attr.value
							ref.iotObject.obj.sendProperty(data, 'set')
						} else if (obj.parent == 'component') {
							item.component[attr.label] = value;
						} else if (obj.parent == 'dataChart') {
							this.$set((isIot ? ref.iotObject.data : item.data), attr.label, value)
						} else {
							item[attr.label] = value;
						}
					} else {
						this.$set((isIot ? ref.iotObject.data : item.data), attr.label, value)
					}
				})
			})

		}
	})
}