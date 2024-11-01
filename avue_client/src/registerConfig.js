import Vue from 'vue'
import dataV from '@jiaminghi/data-view'
import draggable from '@avue/avue-draggable'
import JsonViewer from 'vue-json-viewer'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/atom-one-dark.css'
import highlight from '@avue/avue-data/page/components/highlight'
import '@avue/avue-data/styles/common.scss'
import '@avue/avue-data/icons/'
import {
  loadScript
} from '@avue/avue-data/utils/utils'
import registerAxios from '@avue/avue-data/axios';

import { switchTheme } from '@avue/avue-data/utils/utils';

function registerLibs (config) {
  const $loadingParams = {};
  $loadingParams['element-loading-text'] = "加载中..."
  Vue.prototype.$loadingParams = $loadingParams
  switchTheme(localStorage.getItem('theme'), Vue.prototype);
  Vue.use(draggable, {
    keys: config.keys
  })
  Vue.directive('highlight', function (el) {
    let highlight = el.querySelectorAll('pre code');
    highlight.forEach((block) => {
      hljs.highlightBlock(block)
    })
  });
  Vue.component('avue-highlight', highlight)
  window.$loadScript = loadScript;
  document.title = config.title
  Vue.prototype.$website = config;
  Vue.use(dataV)
  Vue.use(JsonViewer)
}


function registerRouters (config, router) {
  let mainPath = config.routers.mainPath
  if (!router) return
  const routers = [{
    path: mainPath,
    component: () => import('@avue/avue-data/page/index'),
    children: [{
      path: '',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list')),
    },
    {
      path: 'category',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list/category')),
    }, {
      path: 'components',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list/components'))

    }, {
      path: 'file',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list/file'))
    }, {
      path: 'document',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list/document'))
    }, {
      path: 'task',
      component: () => require.ensure([], () => require('@avue/avue-data/page/list/task'))
    }]
  }, {
    path: mainPath + 'build',
    name: 'build',
    component: () => require.ensure([], () => require('@avue/avue-data/page/build'))
  }, {
    path: mainPath + 'build/:id',
    name: 'build',
    component: () => require.ensure([], () => require('@avue/avue-data/page/build'))
  }, {
    path: mainPath + 'view/:id',
    name: 'view',
    component: () => require.ensure([], () => require('@avue/avue-data/page/view'))
  }]
  if (router.addRoutes) {
    router.addRoutes(routers)
  } else {
    routers.forEach((route) => {
      router.addRoute(route)
    })
  }
}
export default function ({
  config,
  router,
  axios
}) {
  Object.assign(window.$website, config)
  if (!window.$website.routers) window.$website.routers = {}
  window.$website.routers.mainPath = window.$website.routers.mainPath || '/'
  registerRouters(window.$website, router)
  registerLibs(window.$website)
  registerAxios(axios)
}