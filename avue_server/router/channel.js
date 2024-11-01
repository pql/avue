import resbody from '../util/resbody.js';
import channelDao from '../dao/channel.js';
import bodyParser from 'body-parser';
import {
  arrayToUpperCase,
  objToUpperCase
} from '../util/utils.js'
var jsonParser = bodyParser.json({
  limit: '1000mb'
});
let url = '/push/channel'
export default (app) => {
  app.get(url + '/list', jsonParser, function (req, res) {
    const query = req.query;
    channelDao.list(query).then(data => {
      data.records = arrayToUpperCase(data.records)
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });;
  })
  app.get(url + '/detail', jsonParser, function (req, res) {
    const id = req.query.id;
    channelDao.detail(id).then(data => {
      res.json(resbody.getSuccessResult(objToUpperCase(data[0])));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/remove', jsonParser, function (req, res) {
    const id = req.query.ids;
    channelDao.del(id).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/save', jsonParser, function (req, res) {
    const data = req.body;
    channelDao.save(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/submit', jsonParser, function (req, res) {
    const data = req.body;
    channelDao[data.id ? 'update' : 'save'](data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/update', jsonParser, function (req, res) {
    const data = req.body;
    channelDao.update(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
}