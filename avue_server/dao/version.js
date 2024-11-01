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
import versionMode from '../modules/version.js'
let table = 'blade_visual_version'
export default {
  list: (data) => list({
    table,
    data
  }, {
    key: 'version',
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
    params: hTol(versionMode.column, data)
  }),
  save: (data) => {
    data.data = (data.data || '').replace(/\"/g, '\\\"')
    return insert({
      table,
      column: toColumn(versionMode.id, versionMode.column),
      data: hTol(versionMode.column, data)
    })
  },
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}