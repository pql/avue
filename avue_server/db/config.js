export default {
  // 数据库配置
  mysql: {
    host: '192.168.1.4',
    user: 'root',
    password: 'bb123456',
    port: '3306',
    database: 'avue',
    useConnectionPooling: true,
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  //不配置阿里云oss，默认走本地图片存储
  //阿里云oss作用就是用来存储图片的
  aliyun: {
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    endpoint: '',
    bucket: '',
  }
}