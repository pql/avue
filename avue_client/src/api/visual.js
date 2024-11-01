import Vue from 'vue'
const url = window.$website.url
const request = Vue.prototype.$axios;
const baseUrl = url + '/visual'
export const getList = (params) => request({
  url: baseUrl + '/list',
  method: 'get',
  params: params
});



export const copyObj = (id) => request({
  url: baseUrl + '/copy',
  method: 'post',
  params: {
    id: id
  }
});

export const getCategory = (params) => request({
  url: url + '/category/list',
  method: 'get',
  params: params
});

export const getObj = (id) => request({
  url: baseUrl + '/detail',
  method: 'get',
  params: {
    id
  }
});
export const uploadImg = (file) => request({
  url: baseUrl + '/put-file',
  method: 'post',
  data: file,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const addObj = (data) => request({
  url: baseUrl + '/save',
  method: 'post',
  data: {
    visual: {
      password: data.password,
      category: data.category,
      status: data.status,
      title: data.title,
    },
    config: {
      detail: data.detail,
      component: data.component || '[]'
    },
  }
});

export const updateComponent = (data) => request({
  url: baseUrl + '/update',
  method: 'post',
  data: data
});

export const updateObj = (data) => request({
  url: baseUrl + '/update',
  method: 'post',
  data: {
    visual: data
  }
});

export const delObj = (id) => request({
  url: baseUrl + '/remove',
  method: 'post',
  params: {
    ids: id
  }
});