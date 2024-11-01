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
import assetsMode from '../modules/assets.js'
let table = 'blade_visual_assets'
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
    params: hTol(assetsMode.column, data)
  }),
  save: (data) => insert({
    table,
    column: toColumn(assetsMode.id, assetsMode.column),
    data: hTol(assetsMode.column, data)
  }),
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}