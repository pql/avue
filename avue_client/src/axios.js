import {
  checkUrl,
  getGlobValue
} from '@avue/avue-data/utils/utils'
import {
  Message
} from 'element-ui';
import Vue from 'vue'
const $website = window.$website
const {
  clientOption
} = $website
window.$glob = {
  url: '',
  group: '',
  themeId: '',
  theme: {},
  params: {},
  query: {},
  header: {}
}

const query = window.location.search.substring(1);
if (query !== '') {
  query.split('&').forEach(ele => {
    const pair = ele.split('=');
    window.$glob.params[pair[0]] = pair[1];
  });
}

const token = window.$glob.params[clientOption.accessToken];
if (token) {
  localStorage.setItem(clientOption.accessToken, token);
  location.replace(location.origin + location.pathname);
}


export default (axios) => {
  Vue.prototype.$axios = axios
  Vue.prototype.$axiosCreate = true
  axios.defaults.timeout = 20000;
  axios.defaults.validateStatus = status => status >= 200 && status <= 500;

  axios.interceptors.request.use(config => {
    let url = getGlobValue(config.url);
    if (!checkUrl(url)) url = window.$glob.url + url
    config.url = url;

    const header = window.$glob.header || {};
    config.headers = {
      ...config.headers,
      ...header
    };

    const token = localStorage.getItem(clientOption.accessToken);
    if (token) {
      config.headers[clientOption.authorization] = `Basic ${btoa(`${clientOption.clientId}:${clientOption.clientSecret}`)}`;
      config.headers[clientOption.tokenHeader] = `${clientOption.bearer} ${token}`;
    }

    const data = window.$glob.query || {};
    let key;
    if (['get', 'delete'].includes(config.method)) {
      key = 'params';
    } else if (['post', 'put'].includes(config.method)) {
      key = 'data';
    }
    if (config[key] && typeof config[key] === 'object') {
      config[key] = Object.assign(config[key] || {}, data)
    }

    if (config.headers.proxy) {
      const headers = {};
      for (const ele in config.headers) {
        if (typeof config.headers[ele] !== 'object') {
          headers[ele] = config.headers[ele];
        }
      }
      const form = {
        url: config.url,
        method: config.method,
        headers,
      };
      form[key] = config[key];
      config.url = $website.url + '/visual/proxy';
      config.method = 'post';
      config.data = form;
    }

    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(config => {
    const status = config.status;
    if (status !== 200) {
      Message({
        message: config.data.msg || `${config.status} ${config.statusText}`,
        type: 'error',
      });
      return Promise.reject(new Error(config.data.msg));
    }
    return config;
  }, error => {
    return Promise.reject(new Error(error));
  });
}