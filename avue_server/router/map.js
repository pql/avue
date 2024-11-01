import resbody from '../util/resbody.js';
import mapDao from '../dao/map.js';
import bodyParser from 'body-parser';
import {
  arrayToUpperCase,
  objToUpperCase
} from '../util/utils.js'
var jsonParser = bodyParser.json({
  limit: '1000mb'
});
let url = '/map'
export default (app) => {
  app.get(url + '/lazy-list', jsonParser, function (req, res) {
    let query = req.query;
    mapDao.list({
      parent_id: query.parentId
    }).then(data => {
      let list = arrayToUpperCase(data.records)
      list.forEach(ele => {
        ele.hasChildren = true;
      });
      res.json(resbody.getSuccessResult(list));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.get(url + '/detail', jsonParser, function (req, res) {
    const id = req.query.id;
    mapDao.detail(id).then(data => {
      res.json(resbody.getSuccessResult(objToUpperCase(data[0])));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })

  app.get(url + '/data', jsonParser, function (req, res) {
    const id = req.query.id;
    mapDao.detail(id).then(data => {
      res.json(JSON.parse(data[0].data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/remove', jsonParser, function (req, res) {
    const id = req.query.ids;
    mapDao.del(id).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/save', jsonParser, function (req, res) {
    const data = req.body;
    mapDao.save(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })

  app.post(url + '/update', jsonParser, function (req, res) {
    const data = req.body;
    mapDao.update(data).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
}