import registerConfig from '@avue/avue-data/registerConfig';
import { website } from '@avue/avue-data/config.js'
import { loadScript } from '@avue/avue-data/utils/utils'
import mqtt from 'mqtt';
const install = (Vue, ops) => {
  const AvueData = () => import('@avue/avue-data/page/view')
  Vue.component('avue-data', AvueData)
  Vue.prototype.$website = website;
  window.mqtt = mqtt;
  window.$loadScript = loadScript;
}

// 如果是直接引入的
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  registerConfig
}
export {
  install,
  registerConfig
}