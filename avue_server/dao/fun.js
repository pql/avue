import { hTol, toColumn } from '../util/utils.js'
import { list, insert, del, update } from '../db/pool.js'
import funMode from '../modules/fun.js'
let table = 'blade_visual_func'
export default {
	list: (data) => list({ table, data }),
	detail: (id) => list({ table, data: { id }, parent: true, hump: true }),
	update: (data) => update({
		table: table,
		data: {
			id: data.id
		},
		params: hTol(funMode.column, data)
	}),
	save: (data) => insert({
		table,
		column: toColumn(funMode.id, funMode.column),
		data: hTol(funMode.column, data)
	}),
	del: (id) => del({
		table: table,
		data: {
			id
		}
	}),
}

