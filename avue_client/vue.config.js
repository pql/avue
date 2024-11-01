const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.VUE_APP_PATH,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'), // This line must in sass option
      }
    }
  },
  transpileDependencies: [
    'monaco-editor',
    '@jiaminghi/data-view'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://iot.huiteng.club/api/',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/iot': {
        target: 'http://iot.huiteng.club/iot/',
        ws: true,
        pathRewrite: {
          '^/iot': '/'
        }
      }
    }
  },
  configureWebpack: (config) => {
    Object.assign(config.resolve.alias, {
      // 大屏工程路径别名
      '@avue/avue-data': resolve('src'),
      '@': resolve('src'),
    })
  },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
}