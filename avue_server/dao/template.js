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
import templateMode from '../modules/template.js'
let table = 'blade_visual_push_template'
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
    params: hTol(templateMode.column, data)
  }),
  save: (data) => insert({
    table,
    column: toColumn(templateMode.id, templateMode.column),
    data: hTol(templateMode.column, data)
  }),
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}