import Router from 'vue-router';
import Vue from 'vue';
Vue.use(Router)
const vueRouter = new Router({
  base: process.env.VUE_APP_PATH,
  mode: process.env.VUE_APP_MODE,
})
export default vueRouter;