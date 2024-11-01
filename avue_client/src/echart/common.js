import {
  setPx,
  addParam
} from './util';

import config from './config';
import mqtt from 'mqtt';
import commonOption from './option'
import crypto from '@avue/avue-data/utils/crypto'
import Iot from '@avue/avue-data/iot/index';
import {
  getFunction,
  convertValue,
  funEval,
  uuid,
  getComparisonFunction
} from '@avue/avue-data/utils/utils';
import COMMON from '@avue/avue-data/config'
export default (() => {
  return {
    props: {
      filterList: Object,
      dataFormatterId: String,
      dataFormatterStr: String,
      echartFormatterStr: String,
      labelFormatterStr: String,
      stylesFormatterStr: String,
      formatterStr: String,
      titleFormatter: Function,
      sqlFormatter: Function,
      recordFormatter: Function,
      transfer: Function,
      transferList: Array,
      dataQueryType: String,
      dataQuery: String,
      dataHeader: String,
      index: String,
      object: {
        type: Object,
        default: () => {
          return {}
        }
      },
      initialize: {
        type: Boolean,
        default: true
      },
      width: {
        type: [Number, String],
        default: 600
      },
      height: {
        type: [Number, String],
        default: 600
      },
      theme: {
        type: String
      },
      child: {
        type: Object,
        default: () => {
          return {};
        }
      },
      record: {
        type: String
      },
      public: {
        type: String
      },
      sql: {
        type: String
      },
      time: {
        type: Number,
        default: 0
      },
      proxy: {
        type: Boolean
      },
      url: {
        type: String
      },
      wsUrl: {
        type: String
      },
      mqttUrl: {
        type: String
      },
      iot: {
        type: Object,
        default: () => {
          return {}
        }
      },
      state: String,
      stateList: {
        type: Array,
        default: () => {
          return []
        }
      },
      dataBind: {
        type: Array,
        default: () => {
          return []
        }
      },
      mqttConfig: {
        type: Object,
        default: () => {
          return {};
        }
      },
      disabled: {
        type: Boolean,
        default: true
      },
      dataType: {
        type: Number,
        default: 0
      },
      dataMethod: {
        type: String,
        default: 'get'
      },
      id: {
        type: String,
        default: 'main_' + uuid()
      },
      data: {
        type: [Object, String, Array]
      },
      component: {
        type: Object,
        default: () => {
          return {};
        }
      },
      option: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    mixins: [commonOption],
    data () {
      return {
        headerHeight: '',
        checkPublic: '',
        checkChart: '',
        myChart: '',
        dataOldChart: [],
        dataResultChart: [],
        dataChart: [],
        dataAxios: {},
        dataParams: {},
        refList: [],
        iotClient: {},
        iotObject: {
          obj: {},
          data: {}
        },
        wsClient: {},
        mqClient: {},
        styles: {},
        appendCheck: {},
        appendObj: {},
        appendList: [],
        className: ''
      };
    },
    watch: {
      state () {
        this.updateData()
      },
      data: {
        handler () {
          this.updateData()
        },
        deep: true
      },
      dataAppend (val) {
        this.appendObj = {};
        this.appendList = []
        if (!val) {
          this.appendCheck = clearInterval(this.appendCheck)
        } else {
          this.dataChart = []
        }
        this.updateData()
      },
      echartFormatter () {
        this.updateChart();
      },
      width () {
        this.$nextTick(() => {
          this.updateChart();
        })
      },
      height () {
        this.$nextTick(() => {
          this.updateChart();
        })
        this.updateChart();
      },
      theme () {
        this.myChart.dispose();
        this.init();
      },
      option: {
        handler () {
          this.updateChart();
        },
        deep: true
      },
      'component.animatedInfinite' () {
        this.initAnima()
      },
      'component.animated' () {
        this.initAnima()
      },
      'component.animatedSwitch' () {
        this.initAnima()
      }
    },
    computed: {
      mappingValue () {
        return this.dataChart[this.option.mapping || 'value']
      },
      dataFormatter () {
        let fun = this.dataFormatterStr
        if (this.dataFormatterId) {
          fun = this.filterList[this.dataFormatterId].dataFormatter
        }
        return getFunction(fun)
      },
      echartFormatter () {
        return getFunction(this.echartFormatterStr)
      },
      labelFormatter () {
        return getFunction(this.labelFormatterStr)
      },
      stylesFormatter () {
        return getFunction(this.stylesFormatterStr)
      },
      formatter () {
        return getFunction(this.formatterStr)
      },
      count () {
        return this.option.count;
      },
      dataAppend () {
        return this.option.dataAppend;
      },
      dataChartLen () {
        return (this.dataChart || []).length;
      },
      switchTheme () {
        return this.vaildData(this.option.switchTheme, false);
      },
      name () {
        let className = this.$el.className.split(' ')[0]
        const result = className.replace(config.name, '');
        return result;
      },
      minWidth () {
        const val = this.option.minWidth;
        if (val > this.width) return val;

      },
      styleChartName () {
        const obj = {
          fontFamily: this.component.fontFamily,
          width: setPx(this.minWidth || this.width),
          height: setPx(this.height),
          opacity: this.component.opacity || 1,
          transformOrigin: '0 0',
          filter: `contrast(${this.component.contrast || 100}%) saturate(${this.component.saturate || 100}%) brightness(${this.component.brightness || 100}%) opacity(${this.component.opacity || 100}%) grayscale(${this.component.grayscale || 0}%) hue-rotate(${this.component.hueRotate || 0}deg) invert(${this.component.invert || 0}%) blur(${this.component.blur}px)`,
          transform: `scale(${this.component.scale || 1}) perspective(${this.component.perspective || 500}px) rotateX(${this.component.rotateX || 0}deg) rotateY(${this.component.rotateY || 0}deg) rotateZ(${this.component.rotateZ || 0}deg)`
        };
        return obj;
      },
      styleSizeName () {
        return Object.assign({
          width: setPx(this.width),
          height: setPx(this.height),
        }, (() => {
          if (this.minWidth) {
            return {
              overflowX: 'auto',
              overflowY: 'hidden'
            };
          }
          return {};
        })(), this.styles, {
          animationDuration: this.component.animateDuration + 's',
          animationDelay: this.component.animateDelay + 's',
          animationTimingFunction: this.component.animateSpeed,
          animationDirection: this.component.animateDirection,
        });
      }
    },
    mounted () {
      this.init();
    },
    methods: {
      init () {
        this.refList = this.getItemRefs()
        const main = this.$refs[this.id];
        this.initAnima()
        if (main) {
          // 判断是否图表去初始化
          const isChart = config.echart.includes(this.name);
          if (isChart) this.myChart = window.echarts.init(main, this.theme, {
            renderer: this.option.renderer ? 'svg' : 'canvas'
          });
        }
        this.updateChart();
        this.updateData()
      },
      initAnima () {
        if (this.component.animatedSwitch) {
          this.className = `animated ${this.component.animated || ''}${this.component.animatedInfinite ? ' infinite' : ''}`
        } else {
          this.className = ''
        }
      },
      getItemRefs () {
        let refList = this.$parent.$parent.$parent.$refs;
        let result = {}
        Object.keys(refList).forEach(ele => {
          if (ele.indexOf(COMMON.NAME) !== -1) {
            let obj = refList[ele][0]
            if (obj) result[ele.replace(COMMON.NAME, '')] = obj.$refs.temp
          } else if ((refList[ele][0] || {}).type === 'folder') {
            let obj = refList[ele][0]
            if (obj) result[ele.replace(COMMON.DEAFNAME, '')] = obj
          }
        })
        return result;
      },
      updateChart () {

      },
      updateAppend (result) {
        if (this.validatenull(this.appendObj)) {
          this.appendList = result
          this.appendObj = result[0]
        } else {
          let appendList = [];
          for (let i = 0; i < result.length; i++) {
            const ele = result[i]
            if (ele.id === this.appendObj.id) break
            else appendList.push(ele)
          }
          this.appendObj = result[0]
          appendList.reverse().forEach(ele => {
            this.appendList.unshift(ele);
          })
        }
        if (this.validatenull(this.appendCheck)) {
          this.appendCheck = setInterval(() => {
            let length = this.appendList.length - 1;
            if (length >= 0) {
              let obj = this.appendList.splice(length, 1)[0]
              this.dataChart.unshift(obj);
              let len = this.dataChart.length;
              if (len > this.count) {
                this.appendList.splice(len - 1, 1)
              }
            }
          }, 2000)
        }
      },
      bindEvent () {
        if (this.myChart) {
          [{
            name: 'click',
            event: 'handleClick'
          }, {
            name: 'dblclick',
            event: 'handleDblClick'
          }, {
            name: 'mouseover',
            event: 'handleMouseEnter'
          }, {
            name: 'mouseout',
            event: 'handleMouseLeave'
          }].forEach(ele => {
            this.myChart.off(ele.name);
            this.myChart.on(ele.name, e => this.handleCommonBind(e, e.dataIndex, ele.event));
          })
        }
        if (typeof this.stylesFormatter === 'function') {
          this.styles = this.stylesFormatter(this.dataChart, this.dataParams, this.getItemRefs()) || {};
        }
      },
      // 更新数据核心方法
      updateData (p = {}) {
        let record, key = false;
        let isRecord = this.dataType === 4;
        let isPublic = this.dataType === 5;
        let isIot = this.dataType === 8;
        this.dataParams = Object.assign(this.dataParams, p)
        return new Promise((resolve, reject) => {
          this.resetData && this.resetData();
          if (key) return;
          key = true;
          let safe = this
          const formatter = (data, params) => {
            this.dataOldChart = data;
            if (isRecord) {
              const dataFormatter = getFunction(safe.dataFormatter)
              if (typeof dataFormatter == 'function') {
                data = dataFormatter(data)
              }
            }
            if (typeof this.dataFormatter === 'function') {
              try {
                data = this.dataFormatter(data, params, this.getItemRefs());
              } catch (err) {
                reject(err)
                console.log(new Error(err))
                data = err + ''
              }
            }
            if (!this.validatenull(this.state)) {
              let stateObj = this.stateList.find(ele => ele.state == this.state) || {}
              data.value = stateObj.value;
            }
            if (!this.validatenull(data && data.state)) {
              let stateObj = this.stateList.find(ele => ele.state == data.state) || {}
              data.value = stateObj.value;
            }
            setTimeout(() => {
              this.handleDataAfterFormatter(data, -1)
            })

            return data
          }
          const getData = () => {
            this.handleDataBeforeFormatter({}, -1)
            safe = record || this
            key = false;
            let isApi = safe.dataType === 1;
            let isSql = safe.dataType === 2;
            let isWs = safe.dataType === 3;
            let isMqtt = safe.dataType == 6;
            let isNode = safe.dataType === 7;
            this.closeClient()
            const bindEvent = () => {
              this.updateChart();
              this.bindEvent()
              if (typeof this.stylesFormatter === 'function') {
                this.styles = this.stylesFormatter(this.dataChart, this.dataParams, this.getItemRefs()) || {};
              }
              this.$refs.main && this.$refs.main.updateData && this.$refs.main.updateData(p)
              resolve({
                news: this.dataChart,
                old: this.dataOldChart
              });
            }
            if (isApi || isNode) {
              let url = safe.url;
              if (this.validatenull(url)) return
              let dataQuery = getFunction(safe.dataQuery)
              dataQuery = typeof (dataQuery) === 'function' && dataQuery(url) || {}
              let dataHeader = getFunction(safe.dataHeader)
              dataHeader = typeof (dataHeader) === 'function' && dataHeader(url) || {}
              let params = Object.assign(dataQuery, this.dataParams);
              let axiosParams = {}
              if (safe.proxy || isNode) dataHeader.proxy = true;
              if (['post', 'put'].includes(safe.dataMethod)) {
                axiosParams.data = params
                if (safe.dataQueryType == 'form') {
                  if (safe.proxy) dataHeader.form = true
                  let formData = []
                  Object.keys(params).forEach(ele => {
                    formData.push(`${ele}=${params[ele]}`)
                  })
                  axiosParams.data = formData.join('&')
                }
              } else if (['get', 'delete'].includes(safe.dataMethod)) {
                axiosParams.params = params
              }
              this.$axios({
                ...{
                  method: safe.dataMethod,
                  url: url,
                  headers: dataHeader,
                },
                ...axiosParams
              }).then(res => {
                this.dataAxios = res;
                let result = res.data;
                result = formatter(result, params)
                if (this.dataAppend) {
                  this.updateAppend(result)
                } else {
                  this.dataChart = result;
                }
                bindEvent();
              }).catch(err => {
                reject(err)
              });
            } else if (isWs) {
              let url = safe.wsUrl
              if (this.validatenull(url)) return
              let dataQuery = getFunction(safe.dataQuery)
              dataQuery = typeof (dataQuery) === 'function' && dataQuery(url) || {}
              let params = Object.assign(dataQuery, this.dataParams);
              url = url + addParam(params)
              this.wsClient = new WebSocket(url)
              this.wsClient.onmessage = (msgEvent = {}) => {
                let result = JSON.parse(msgEvent.data)
                this.dataChart = formatter(result, this.dataParams)
                bindEvent();
              }
            } else if (isSql) {
              let sql = JSON.parse(crypto.decrypt(safe.sql));
              let data, result;
              try {
                sql.sql = funEval(sql.sql)(this.dataParams)
                data = crypto.encrypt(JSON.stringify(sql));
              } catch (error) {
                data = safe.sql;
              }
              this.sqlFormatter(data).then(res => {
                result = res.data.data;
                this.dataChart = formatter(result, this.dataParams)
                bindEvent();
              }).catch(err => {
                reject(err)
              })
            } else if (isMqtt) {
              let url = safe.mqttUrl
              let dataMqttConfig = JSON.parse(safe.mqttConfig)
              dataMqttConfig.clientId = 'mqttjs_' + (this.index || uuid());
              this.mqClient = mqtt.connect(url, dataMqttConfig)
              this.mqClient.on('connect', () => {
                this.mqClient.subscribe(dataMqttConfig.topic.name, {
                  qos: dataMqttConfig.topic.qos || 0
                }, (error, res) => {
                  console.log('Subscribe to topics res', res, error)
                  bindEvent()
                })
              })
              this.mqClient.on('message', (topic, message) => {
                let defaultTopic = dataMqttConfig.topic
                if (topic === defaultTopic.name) {
                  let result = JSON.parse(message)
                  this.dataChart = formatter(result, this.dataParams)
                }
              })

            } else if (isPublic) {
              let refList = this.getItemRefs();
              let result = refList[this.public].dataChart
              this.dataChart = formatter(result, this.dataParams)
              bindEvent();
            } else if (isIot) {
              this.iotObject.data = {}
              let iot = new Iot({
                productKey: this.iot.projectId,
                deviceName: this.iot.deviceId,
                deviceSecret: this.iot.deviceSecret,
                time: this.time,
                type: this.iot.type,
                user: this.iot.username,
                passwd: this.iot.password,
                params: this.dataBind.filter(ele => ele.iot).map(ele => ele.value),
                connect: (client) => {
                  this.iotClient = client;
                },
                message: (params) => {
                  if (params) {
                    Object.keys(params).forEach(ele => {
                      this.$set(this.iotObject.data, ele, params[ele])
                    })
                  }
                  this.dataChart = formatter(this.iotObject.data, this.dataParams)
                  bindEvent()

                }
              })
              this.iotObject.obj = iot;
            } else {
              let result = safe.data;
              if (isRecord) {
                result = funEval(result)
              }
              this.dataChart = formatter(result, this.dataParams)
              bindEvent();
            }
          };
          const sendData = () => {
            this.$nextTick(() => {
              getData();
              clearInterval(this.checkPublic);
              if (isPublic) {
                this.checkPublic = setInterval(() => {
                  let refList = this.getItemRefs();
                  let result = refList[this.public].dataChart
                  if (JSON.stringify(result) == JSON.stringify(this.dataResultChart)) {
                    return
                  }
                  this.dataResultChart = result
                  getData();
                }, 100);
              }
              this.checkChart && clearInterval(this.checkChart)
              if (this.time != 0 && !this.validatenull(this.time) && this.disabled && !isIot) {
                this.checkChart = setInterval(() => {
                  getData();
                }, this.time);
              }
            });
          }
          if (isRecord && this.record) {
            this.recordFormatter(this.record).then(res => {
              const data = res.data.data;
              record = {
                ...data,
                sql: data.data
              }
              sendData()
            }).catch(err => {
              reject(err)
            })
          } else {
            sendData()
          }
        })
      },
      transferAll (params, type) {
        let refList = this.getItemRefs();
        let paramList = this.child.paramList || []
        paramList = paramList.filter(ele => (ele.event || 'clickFormatter') == type && ele.switch);
        paramList = paramList.filter(ele => {
          return this.handleTransfer([
            {
              condition: ele.condition,
              conditionType: ele.conditionType
            }
          ], false);
        });
        paramList.forEach(ele => {
          this.transfer && this.transfer(ele.action, refList, params, this.index)
        })

      },
      handleCommonBind (item, index, type) {
        this.transferAll(item || this.dataChart, type);
        let params = {}
        if (!this.validatenull(index)) {
          params = {
            item,
            index,
            data: this.dataChart
          }
          if (item && item.value) params.value = item.value
        } else {
          params = item || this.dataChart
        }
      },
      handleDataAfterFormatter (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'dataAfterFormatter')
        if (!this.initialize && this.transferList) {
          let list = this.transferList.paramList
          list = list.filter(ele => ele.switch)
          this.handleTransfer(list)
        }
      },
      handleTransfer (list = [], carry = true) {
        let flag = true;
        let refList = this.getItemRefs();
        const getValue = (value, safe) => {
          let obj = safe.dataBind.find(param => param.value == value) || {};
          if (obj.option) {
            value = safe.option[value]
          } else if (obj && obj.system) {
            if (obj.parent == 'component') {
              value = safe.component[value]
            } else if (obj.iot || obj.parent == 'dataChart') {
              value = safe.dataChart[value]
            } else {
              value = safe.object[value]
            }
          } else {
            value = safe.dataChart[value]
          }
          value = convertValue(value, obj.type);
          return value
        }
        list.forEach(ele => {
          const conditionType = ele.conditionType;
          let result = [];
          ele.condition.forEach(con => {
            if (con.typeIf == 1) {
              let obj = refList[con.index]
              let value = con.value
              if (con.type == 1 && obj) {
                value = getValue(con.key, obj)
              }
              else {
                obj = this.dataBind.find(param => param.value == con.key) || {}
                value = convertValue(value, obj.type);
              }
              const compareFn = getComparisonFunction(con.condition);
              result.push(compareFn(getValue(con.key, this), value))
            } else if (con.typeIf == 0) {
              result.push(getFunction(con.fun)(this.dataChart, refList))
            }

          })
          flag = conditionType == 1 ? result.every(value => value === true) : result.some(value => value === true);
          if (flag && carry) this.transfer && this.transfer(ele.action, refList, this.dataChart, this.index)
        })
        return flag;
      },
      handleDataBeforeFormatter (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'dataAfterFormatter')
      },
      handleClick (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'clickFormatter')
      },
      handleDblClick (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'dblClickFormatter')
      },
      handleMouseEnter (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'mouseEnterFormatter')
      },
      handleMouseLeave (item = {}, index) {
        if (item.pointerType == 'mouse') item = this.dataChart
        this.handleCommonBind(item, index, 'mouseLeaveFormatter')
      },
      // 下面俩都是chart的公共的方法,就放这里面共用
      getColor (index, first) {
        const category = this.option.category;
        if (!this.validatenull(window.$glob.theme)) {
          let colors = window.$glob.theme.color
          if (colors[index]) {
            return colors[index]
          }
        } else {
          const barColor = this.option.barColor || [];
          if (barColor[index]) {
            const color1 = barColor[index].color1;
            const color2 = barColor[index].color2;
            const postion = (barColor[index].postion || 0.9) * 0.01;
            if (first) return color1;
            if (color2) {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: category ? 1 : 0,
                y2: category ? 0 : 1,
                colorStops: [{
                  offset: 0,
                  color: color1 // 0% 处的颜色
                }, {
                  offset: postion,
                  color: color2 // 100% 处的颜色
                }],
                global: false // 缺省为 false
              };
            }
            return color1;
          } else {
            return []
          }
        }

      },
      getHasProp (isHas, propObj, staticObj = {}) {
        return Object.assign((() => {
          return isHas ? propObj : {};
        })(), staticObj);
      },
      closeClient () {
        this.wsClient.close && this.wsClient.close()
        this.mqClient.end && this.mqClient.end()
        this.mqClient.close && this.mqClient.close()
        this.iotClient.end && this.iotClient.end()
        this.iotClient.close && this.iotClient.close()
      }
    },
    beforeDestroy () {
      clearInterval(this.checkPublic)
      clearInterval(this.checkChart);
      this.closeClient()
    }
  };
})();