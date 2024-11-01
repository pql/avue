import {
  hTol,
  toColumn
} from '../util/utils.js'
import {
  list,
  insert,
  del,
  update
} from '../db/pool.js'
import aiMode from '../modules/ai.js'
let table = 'blade_visual_ai'
export default {
  list: (data) => list({
    table,
    data
  }),
  detail: (id) => list({
    table,
    data: {
      id
    },
    parent: true,
    hump: true
  }),
  update: (data) => update({
    table: table,
    data: {
      id: data.id
    },
    params: hTol(aiMode.column, data)
  }),
  save: (data) => insert({
    table,
    column: toColumn(aiMode.id, aiMode.column),
    data: hTol(aiMode.column, data)
  }),
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}