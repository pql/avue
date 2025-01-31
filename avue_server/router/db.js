
import resbody from '../util/resbody.js';
import dbDao from '../dao/db.js';
import crypto from '../util/crypto.js'
import { content } from '../db/pool.js'
import { getSqlConfig } from '../util/utils.js'
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json({ limit: '1000mb' });
let url = '/db'
export default (app) => {
  app.get(url + '/list', jsonParser, function (req, res) {
    const query = req.query;
    dbDao.list(query).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });;
  })
  app.get(url + '/detail', jsonParser, function (req, res) {
    const id = req.query.id;
    dbDao.detail(id).then(data => {
      res.json(resbody.getSuccessResult(data[0]));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/remove', jsonParser, function (req, res) {
    const id = req.query.ids;
    dbDao.del(id).then(data => {
      res.json(resbody.getSuccessResult(data));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/db-test', function (req, res) {
    const body = JSON.parse(crypto.decrypt(req.headers.data));
    let config = getSqlConfig(body);
    content(config).then(data => {
      res.json(resbody.getSuccessResult({}));
    }).catch(error => {
      res.json(resbody.getFailResult(error));
    });
  })
  app.post(url + '/dynamic-query', function (req, res) {
    const body = JSON.parse(crypto.decrypt(req.headers.data));
    const id = body.id
    const sql = body.sql;
    dbDao.detail(id).then(data => {
      let config = getSqlConfig(data[0]);
      content(config, sql).then(data => {
        res.json(resbody.getSuccessResult(data));
      }).catch(error => {
        res.json(resbody.getFailResult(error));
      });
    })

  })
  app.post(url + '/submit', jsonParser, function (req, res) {
    const data = req.body;
    if (data.id) {
      dbDao.update(data).then(data => {
        res.json(resbody.getSuccessResult(data));
      }).catch(error => {
        res.json(resbody.getFailResult(error));
      });
    } else {
      dbDao.save(data).then(data => {
        res.json(resbody.getSuccessResult(data));
      }).catch(error => {
        res.json(resbody.getFailResult(error));
      });
    }
  })
}
