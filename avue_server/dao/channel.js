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
import channelMode from '../modules/channel.js'
let table = 'blade_visual_push_channel'
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
    params: hTol(channelMode.column, data)
  }),
  save: (data) => insert({
    table,
    column: toColumn(channelMode.id, channelMode.column),
    data: hTol(channelMode.column, data)
  }),
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}