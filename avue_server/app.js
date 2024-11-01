import express from 'express';
import visualRoute from './router/visual.js';
import categoryRoute from './router/category.js'
import mapRoute from './router/map.js'
import componentRoute from './router/component.js'
import dbRoute from './router/db.js'
import aiRoute from './router/ai.js'
import recordRoute from './router/record.js'
import globRoute from './router/glob.js'
import assetsRoute from './router/assets.js'
import templateRoute from './router/template.js'
import channelRoute from './router/channel.js'
import versionRoute from './router/version.js'
import funRoute from './router/fun.js'
import bodyParser from 'body-parser';
import morgan from 'morgan';
const app = express();
app.use(morgan('short'));
app.use(bodyParser.urlencoded({
  limit: '1000mb',
  extended: true
}));
//跨越解决
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  // 这里获取 origin 请求头 而不是用 *
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
});
visualRoute(app)
categoryRoute(app);
mapRoute(app)
dbRoute(app)
globRoute(app)
assetsRoute(app)
recordRoute(app)
componentRoute(app)
templateRoute(app)
channelRoute(app)
versionRoute(app)
aiRoute(app)
funRoute(app)
app.listen(10002, () => console.log('Example app listening on http://localhost:10002'))