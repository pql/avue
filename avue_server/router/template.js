import resbody from '../util/resbody.js';
import templateDao from '../dao/template.js';
import channelDao from '../dao/channel.js'
import bodyParser from 'body-parser';
import {
  arrayToUpperCase,
  objToUpperCase
} from '../util/utils.js'
import pushDingTalk from '../util/push.js'
import pushWechat from '../util/wechat.js'
import pushEmail from '../util/email.js'
import pushAliSms from '../util/ali.js'
import pushTxSms from '../util/ali.js'
var jsonParser = bodyParser.json({
  limit: '1000mb'
});
let url = '/push/template'
export default (app) => {
  app.get(url + '/list', jsonParser, function (req, res) {
    let query = req.query;
    query.channel_id = query.channelId
    delete query.channelId
    templateDao.list(query).then(data => {
      data.records = arrayToUpperCase(data.records)
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.get(url + '/detail', jsonParser, function (req, res) {
    const id = req.query.id;
    templateDao.detail(id).then(data => {
      res.json(resbody.getSuccessResult(objToUpperCase(data[0])));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/remove', jsonParser, function (req, res) {
    const id = req.query.ids;
    templateDao.del(id).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/submit', jsonParser, function (req, res) {
    const data = req.body;
    templateDao[data.id ? 'update' : 'save'](data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/debug', jsonParser, function (req, res) {
    //替换模板
    function replaceTemplate(template, data) {
      return template.replace(/\${(.*?)}/g, (match, key) => data[key.trim()]);
    }
    const query = req.query;
    let params = query.params;
    if (params) params = JSON.parse(params)
    let template, channel;
    templateDao.list({
      template_code: query.code
    }).then(data => {
      template = data.records[0]
      return channelDao.detail(template.channel_id)
    }).then(data => {
      channel = data[0]
      let content = replaceTemplate(template.template_param, params);
      if (channel.pushType == 1) {
        return pushWechat(channel.webhook, params);
      } else if (channel.pushType == 2) {
        return pushDingTalk(channel.webhook, channel.robotSign, content);
      } else if (channel.pushType == 3) {
        return pushEmail(Object.assign(channel, {
          content
        }));
      } else if (channel.pushType == 4) {
        return pushAliSms(channel, params);
      } else if (channel.pushType == 5) {
        return pushTxSms(channel, params);
      } else {
        res.json(resbody.getSuccessResult());
        return
      }
    }).then(result => {
      res.json(resbody.getSuccessResult(result.data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/save', jsonParser, function (req, res) {
    const data = req.body;
    templateDao.save(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/update', jsonParser, function (req, res) {
    const data = req.body;
    templateDao.update(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
}