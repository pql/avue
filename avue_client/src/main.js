import Vue from 'vue'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router.js';
import {
  registerConfig
} from './index'
import App from './App.vue'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(window.AVUE);

registerConfig({
  config: {
    keys: 'U2FsdGVkX1/xwwqTGwCNbGISEw82wbNp36+2zwR/YUW4Amq7JveW82c0nzxy3qUFCRzd96pakLxVVfWlkxX//k8GhH2SenwJ+ENZ9xqTeSC+GjfM3PCi2hGhe9jpwiPa'
  },
  router,
  axios
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')