import { hTol, toColumn } from '../util/utils.js'
import { list, insert, del, update } from '../db/pool.js'
import globMode from '../modules/glob.js'
let table = 'blade_visual_glob'
export default {
  list: (data) => list({ table, data }),
  detail: (id) => list({ table, data: { id }, parent: true, hump: true }),
  update: (data) => update({
    table: table,
    data: {
      id: data.id
    },
    params: hTol(globMode.column, data)
  }),
  save: (data) => insert({
    table,
    column: toColumn(globMode.id, globMode.column),
    data: hTol(globMode.column, data)
  }),
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}

