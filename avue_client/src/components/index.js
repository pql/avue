/** 
 * 自定义组件参考文档
 * https://cn.vuejs.org/v2/guide/components-registration.html
 */
import {
  website
} from '@avue/avue-data/config.js'
import $Echart from '@avue/avue-data/echart/common';
import {
  KEY_COMPONENT_NAME
} from '@avue/avue-data/echart/variable';


export default (() => {
  let components = {}
  const mixins = [$Echart]

  const requireComponent = require.context('.', true, /\w+.(vue|js)$/)
  requireComponent.keys().forEach(fileName => {
    if (fileName.includes('index.vue')) {
      const cmp = requireComponent(fileName).default
      cmp.mixins = mixins
      cmp.name = `${KEY_COMPONENT_NAME}${cmp.name}`
      components[cmp.name] = cmp
    }
  })

  website.componentsList.map(ele => ele.component).forEach(cmp => {
    try {
      cmp = eval(cmp)
      cmp.mixins = mixins
      cmp.name = `${KEY_COMPONENT_NAME}${cmp.name}`
      components[cmp.name] = cmp
    } catch (err) {
      console.log(err)
    }
  })
  return components
})()