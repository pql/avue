import Vue from 'vue'
const url = window.$website.iotUrl
const request = Vue.prototype.$axios;
const baseUrl = url + '/openapi'
const headers = {

}
export const getProjectList = (params) => request({
	url: baseUrl + '/product/queryProductList',
	method: 'get',
	headers,
	params: params
});

export const getDeviceList = (params) => request({
	url: baseUrl + '/device/queryDeviceList',
	method: 'get',
	headers,
	params: params
});

export const getModel = (params) => request({
	url: baseUrl + '/thing/getAllThingModelTsl',
	method: 'get',
	headers,
	params: params
});

export const getProperty = (params) => request({
	url: baseUrl + '/device/queryDevicePropertyLatest',
	method: 'get',
	headers,
	params: params
});



