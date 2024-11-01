import {
  website
} from '@avue/avue-data/config.js'
export const themeList = {
  1: {
    id: 1,
    name: '明亮',
    color: ['rgb(73, 146, 255)', 'rgb(124, 255, 178)', 'rgb(253, 221, 96)', 'rgb(255, 110, 118)', 'rgb(88, 217, 249)', 'rgb(5, 192, 145)'],
    data: []
  },
  2: {
    id: 2,
    name: '暗淡',
    color: ['rgb(84, 112, 198)', 'rgb(145, 204, 117)', 'rgb(250, 200, 88)', 'rgb(238, 102, 102)', 'rgb(115, 192, 222)', 'rgb(59, 162, 114)'],
    data: []
  },
  3: {
    id: 3,
    name: '马卡龙',
    color: ['rgb(46, 199, 201)', 'rgb(182, 162, 222)', 'rgb(90, 177, 239)', 'rgb(255, 185, 128)', 'rgb(216, 122, 128)', 'rgb(141, 152, 179)'],
    data: []
  },
  4: {
    id: 4,
    name: '深色',
    color: ['rgb(193, 46, 52)', 'rgb(230, 182, 0)', 'rgb(0, 152, 217)', 'rgb(43, 130, 29)', 'rgb(0, 94, 170)', 'rgb(51, 156, 168)'],
    data: []
  },
  5: {
    id: 5,
    name: '罗马红',
    color: ['rgb(224, 31, 84)', 'rgb(94, 78, 165)', 'rgb(245, 232, 200)', 'rgb(184, 210, 199)', 'rgb(198, 179, 142)', 'rgb(164, 216, 194)'],
    data: []
  }
}
export const themeObj = {
  light: {
    loadBackground: 'rgba(255,255,255, 0.6)',
    palette: {
      bgColor: '#eee',
      longfgColor: '#BABBBC',
      shortfgColor: '#9C9C9C',
      fontColor: '#333',
      shadowColor: '#eee',
      lineColor: '#2681ff',
      borderColor: '#B5B5B5',
      cornerActiveColor: '#333',
    },
  },
  dark: {
    loadBackground: 'rgba(32,32,35, 0.8)',
    palette: {
      bgColor: '#202023',
      longfgColor: '#BABBBC',
      shortfgColor: '#9C9C9C',
      fontColor: '#919398',
      shadowColor: '#18181c',
      lineColor: '#2681ff',
      borderColor: '#B5B5B5',
      cornerActiveColor: '#fff',
    }
  }
}
//基本配置
export const config = {
  width: 1920,
  height: 1080,
  query: "function(){\n    return window.$glob.params || {}\n}",
  header: "function(){\n    return window.$glob.params || {}\n}",
  screen: 'x',
  group: [],
  glob: [],
  theme: themeList,
  themeId: '',
  filters: {},
  funcs: {},
  style: '',
  before: '',
  overflow: false,
  styles: {
    show: false,
    contrast: 100,
    saturate: 100,
    brightness: 100,
    opacity: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    blur: 0
  },
  fonts: [],
  mark: {
    show: false,
    text: '',
    fontSize: 20,
    color: 'rgba(100,100,100,0.2)',
    degree: -20
  },
  version: '',
  scale: 1,
  backgroundImage: `/img/bg/bg.png`,
  url: '',
  toolShow: true,
  folderDeep: false,
  gradeShow: false,
  gradeLen: 30,
};
// 颜色的配置
export const colorOption = {
  menuWidth: 150,
  refreshBtn: false,
  columnBtn: false,
  labelWidth: 100,
  column: [{
    label: '颜色1',
    prop: 'color1',
    type: 'color',
  }, {
    label: '渐变色',
    prop: 'color2',
    type: 'color',
  }, {
    label: '位置',
    prop: 'postion',
    type: 'number'
  }]
}

// 表格的列配置
export const tableOption = {
  menuWidth: 150,
  refreshBtn: false,
  columnBtn: false,
  labelWidth: 100,
  column: [{
    label: '名称',
    prop: 'label',
  }, {
    label: 'key值',
    prop: 'prop',
  }, {
    label: '宽度',
    prop: 'width',
    hide: true,
  }, {
    label: '状态',
    prop: 'hide',
    type: 'switch',
    hide: true,
    value: false,
    dicData: [{
      label: '隐藏',
      value: true
    }, {
      label: '显示',
      value: false
    },]
  }, {
    label: '格式化',
    prop: 'formatter',
    span: 24,
    hide: true,
  }]
}
export const valueTypeOption = [{
  label: '字符串',
  value: 'string'
}, {
  label: '整数',
  value: 'int'
}, {
  label: '浮点数',
  value: 'float'
}, {
  label: '布尔',
  value: 'boolean'
}, {
  label: '数组',
  value: 'array'
}, {
  label: '对象',
  value: 'object'
}, {
  label: '任意',
  value: 'any'
}]
export const paramsOption = [{
  label: 'X',
  value: 'left',
  type: 'float',
  system: true
}, {
  label: 'Y',
  value: 'top',
  type: 'float',
  system: true
}, {
  label: '宽度',
  value: 'width',
  type: 'float',
  parent: 'component',
  system: true
}, {
  label: '高度',
  value: 'height',
  type: 'float',
  parent: 'component',
  system: true
}, {
  label: '隐藏',
  value: 'display',
  type: 'boolean',
  system: true
}, {
  label: '旋转',
  value: 'rotate',
  type: 'float',
  system: true
}, {
  label: '状态',
  value: 'state',
  type: 'int',
  system: true
}, {
  label: '值',
  value: 'value',
  type: 'any',
  parent: 'dataChart',
  system: true
}]
export const conditionOption = [{
  label: '=',
  value: '='
}, {
  label: '!=',
  value: '!='
}, {
  label: '>',
  value: '>'
}, {
  label: '<',
  value: '<'
}, {
  label: '>=',
  value: '>='
}, {
  label: '<=',
  value: '<='
}]
export const actionOption = [{
  label: '传参',
  value: 'params'
}, {
  label: '跳转链接',
  value: 'href'
}, {
  label: '跳转屏幕',
  value: 'group'
}, {
  label: '显隐',
  value: 'display'
}, {
  label: '操作属性',
  value: 'attribute'
}, {
  label: '请求数据',
  value: 'data'
}, {
  label: '弹窗',
  value: 'dialog'
}, {
  label: '自定义',
  value: 'fun'
}]
//一些字典的配置
export const dicOption = {
  displayType: [{
    label: '隐藏',
    value: 'none'
  }, {
    label: '显示',
    value: 'block'
  }, {
    label: '显示/隐藏',
    value: ''
  }],
  animateSpeed: [{
    label: '匀速',
    value: 'linear'
  }, {
    label: '慢快慢',
    value: 'ease'
  }, {
    label: '低速开始',
    value: 'ease-in'
  }, {
    label: '低速结束',
    value: 'ease-out'
  }, {
    label: '低速开始结束',
    value: 'ease-in-out'
  }],
  animateDirection: [{
    label: '默认',
    value: 'normal'
  }, {
    label: '向后',
    value: 'reverse'
  }, {
    label: '向前向后',
    value: 'alternate'
  }, {
    label: '向后向前',
    value: 'alternate-reverse'
  }],
  lineAnimation: [{
    label: '无',
    value: ''
  }, {
    label: '正向',
    value: 'positive'
  }, {
    label: '反向',
    value: 'reverse'
  }],
  lineType: [{
    label: '实线',
    value: ''
  }, {
    label: '点线',
    value: 'dotted'
  }, {
    label: '虚线',
    value: 'dashed'
  }, {
    label: '混合线',
    value: 'blend'
  }],
  line: [{
    label: '线条',
    value: 'line'
  }, {
    label: '圆环',
    value: 'circle'
  }],
  fontWeight: [{
    label: 'normal',
    value: 'normal'
  }, {
    label: 'bold',
    value: 'bold'
  }, {
    label: 'bolder',
    value: 'bolder'
  }, {
    label: 'ligter',
    value: 'ligter'
  }],
  border: [{
    label: '无边框',
    value: ''
  }, {
    label: '内置图片',
    value: 'img'
  }, {
    label: '内置边框',
    value: 'border'
  }],
  textAlign: [{
    label: '居中',
    value: 'center'
  }, {
    label: '左对齐',
    value: 'left'
  }, {
    label: '右对齐',
    value: 'right'
  }],
  dataType: [{
    label: '静态数据',
    value: 0
  }, {
    label: 'API接口数据',
    value: 1
  }, {
    label: 'WebScoket数据',
    value: 3
  }, {
    label: 'Public共用数据',
    value: 5
  }, {
    label: 'MQTT数据',
    value: 6
  }, {
    label: '解析数据',
    value: 7
  }, {
    label: '设备绑定',
    value: 8
  }],
  orientList: [{
    label: '竖排',
    value: 'vertical'
  }, {
    label: '横排',
    value: 'horizontal'
  }],
  dataMethod: [{
    label: 'GET',
    value: 'get'
  }, {
    label: 'DELETE',
    value: 'delete'
  }, {
    label: 'POST',
    value: 'post'
  }, {
    label: 'PUT',
    value: 'put'
  }],
  funType: [{
    label: '过滤器',
    value: 0
  }, {
    label: '数据',
    value: 1
  }, {
    label: '公共',
    value: 2
  }, {
    label: '事件',
    value: 3
  }, {
    label: '其它',
    value: 4
  }],
  transferEvent: [{
    label: '点击事件',
    value: 'clickFormatter',
    temp: 'temp'
  }, {
    label: '双击事件',
    value: 'dblClickFormatter',
    temp: 'temp'
  }, {
    label: '移入事件',
    value: 'mouseEnterFormatter',
    temp: 'temp'
  }, {
    label: '移出事件',
    value: 'mouseLeaveFormatter',
    temp: 'temp'
  }, {
    label: '数据渲染前事件',
    value: 'dataBeforeFormatter',
    temp: 'temp'
  }, {
    label: '数据渲染后事件',
    value: 'dataAfterFormatter',
    temp: 'temp'
  }],
  notEventList: ['time', 'notice', 'data'],
  dataList: ['data', 'vue', 'common', 'datav', 'text', 'wordcloud', 'img', 'tabs', 'map', 'video', 'clapper', 'pie', 'pictorialbar', 'iframe', 'swiper', 'flop', 'bar', 'line', 'progress', 'table', 'gauge', 'funnel', 'scatter', 'radar', 'img', 'imgborder', 'imgList', 'imgTabs', 'rectangle', 'code', 'graph'].concat(website.componentsList.filter(ele => ele.data === true).map(ele => ele.name)),
  barList: ['bar', 'line', 'scatter'],
  mappingList: ['text', 'iframe', 'img', 'video', 'clapper', 'code'],
  titleList: ['bar', 'pie', 'line'],
  labelList: ['bar', 'line', 'pie', 'rectangle', 'funnel', 'radar', 'scatter'],
  legendList: ['bar', 'pie', 'line', 'radar', 'funnel'],
  echartList: ['bar', 'pie', 'line', 'gauge', 'funnel', 'scatter', 'radar', 'common'],
  colorList: ['bar', 'pie', 'line', 'gauge', 'funnel', 'scatter', 'radar'],
  tipList: ['bar', 'pie', 'line', 'rectangle', 'funnel', 'scatter', 'radar'],
  positionList: ['bar', 'line', 'pictorialbar', 'scatter'],
  labelFormatterList: ['bar', 'map', 'line', 'pie', 'gauge', 'funnel', 'scatter', 'radar', 'rectangle'],
  tabsTypeList: [{
    label: '选项卡',
    value: 'tabs',
  }, {
    label: '选择框',
    value: 'select',
  }],
  mapType: [{
    label: '原生',
    value: 0
  }],
  target: [{
    label: '本窗口',
    value: '_self'
  }, {
    label: '新窗口',
    value: '_blank',
  }],
  swiperType: [{
    label: '普通',
    value: ''
  }, {
    label: '立体',
    value: 'card'
  }],
  swiperIndicator: [{
    label: '外部',
    value: 'indicator'
  }, {
    label: '不显示',
    value: 'none'
  }],
  format: [{
    label: '日期',
    value: 'yyyy-MM-dd'
  }, {
    label: '日期+时分',
    value: 'yyyy-MM-dd hh:mm'
  }, {
    label: '日期+时分秒',
    value: 'yyyy-MM-dd hh:mm:ss'
  }, {
    label: '日期(无年)',
    value: 'MM-dd'
  }, {
    label: '时分',
    value: 'hh:mm'
  }, {
    label: '时分秒',
    value: 'hh:mm:ss'
  }, {
    label: '星期',
    value: 'day'
  }],
  fontFamily: [{
    label: '宋体',
    value: 'SimSun'
  }, {
    label: '新宋体',
    value: 'NSimSun'
  }, {
    label: '黑体',
    value: 'SimHei'
  }, {
    label: '楷体',
    value: 'KaiTi_GB2312'
  }, {
    label: '微软雅黑',
    value: 'Microsoft YaHei'
  }, {
    label: '幼园',
    value: 'YouYuan'
  }, {
    label: '华文细黑',
    value: 'STXihei'
  }, {
    label: '细明体',
    value: 'MingLiU'
  }, {
    label: '新细明体',
    value: 'PMingLiU'
  }]
}