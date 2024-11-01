
import resbody from '../util/resbody.js';
import funDao from '../dao/fun.js';
import bodyParser from 'body-parser';
var jsonParser = bodyParser.json({ limit: '1000mb' });
let url = '/fun'
export default (app) => {
	app.get(url + '/list', jsonParser, function (req, res) {
		const query = req.query;
		funDao.list(query).then(data => {
			res.json(resbody.getSuccessResult(data));
		}).catch(error => {
			res.json(resbody.getFailResult(error));
		});
	})
	app.get(url + '/detail', jsonParser, function (req, res) {
		const id = req.query.id;
		funDao.detail(id).then(data => {
			res.json(resbody.getSuccessResult(data[0]));
		}).catch(error => {
			res.json(resbody.getFailResult(error));
		});
	})
	app.post(url + '/remove', jsonParser, function (req, res) {
		const id = req.query.ids;
		funDao.del(id).then(data => {
			res.json(resbody.getSuccessResult(data));
		}).catch(error => {
			res.json(resbody.getFailResult(error));
		});
	})
	app.post(url + '/save', jsonParser, function (req, res) {
		const data = req.body;
		funDao.save(data).then(data => {
			res.json(resbody.getSuccessResult(data));
		}).catch(error => {
			res.json(resbody.getFailResult(error));
		});
	})
	app.post(url + '/update', jsonParser, function (req, res) {
		const data = req.body;
		funDao.update(data).then(data => {
			res.json(resbody.getSuccessResult(data));
		}).catch(error => {
			res.json(resbody.getFailResult(error));
		});
	})
}
