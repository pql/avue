import {
  hTol,
  toColumn
} from '../util/utils.js'
import {
  list,
  update,
  insert,
  del
} from '../db/pool.js'
import visualMode from '../modules/visual.js'
import configMode from '../modules/config.js'
let table = 'blade_visual'
let tableConfig = 'blade_visual_config'

function save(data) {
  return new Promise(resolve => {
    let visual = data.visual;
    let config = data.config;
    let id;
    insert({
      table,
      column: toColumn(visualMode.id, visualMode.column),
      data: hTol(visualMode.column, Object.assign(visual, {
        status: 1,
        isDeleted: 0
      }))
    }, (data) => {
      id = data
      insert({
        table: tableConfig,
        column: toColumn(configMode.id, configMode.column),
        data: hTol(configMode.column, {
          visualId: id,
          detail: config.detail,
          component: (config.component || '').replace(/\"/g, '\\\"')
        })
      }).then(() => {
        resolve({
          id
        })
      })
    })
  })
}
export default {
  list: (data) => list({
    table,
    data,
    hump: true
  }),
  update: (data) => {
    return new Promise(resolve => {
      update({
        table: tableConfig,
        data: {
          visual_id: data.visual.id
        },
        params: {
          detail: data.config.detail,
          component: (data.config.component || '').replace(/\"/g, '\\\"')
        }
      }).then(() => {
        return update({
          table: table,
          data: {
            id: data.visual.id
          },
          params: {
            background_url: data.visual.backgroundUrl
          }
        })
      }).then(() => {
        resolve()
      })
    })
  },
  updates: (data) => {
    let visual = data.visual
    let params = {};
    ['title', 'category', 'password', 'status', 'version'].forEach(ele => {
      if (visual[ele]) {
        params[ele] = visual[ele]
      }
    });
    return update({
      table: table,
      data: {
        id: data.visual.id
      },
      params: params
    })
  },
  save: (data) => save(data),
  detail: (id) => {
    return new Promise(resolve => {
      let visual;
      let config;
      list({
        table,
        data: {
          id
        },
        parent: true
      }).then(res1 => {
        visual = res1[0];
        return list({
          table: tableConfig,
          data: {
            visual_id: id
          },
          parent: true
        })
      }).then(res2 => {
        config = res2[0];
        if (visual && config) {
          resolve({
            config,
            visual
          })
        } else {
          resolve({})
        }
      })
    })
  },
  copy: (id) => {
    return new Promise((resolve) => {
      let data = {
        visual: {},
        config: {}
      }
      list({
        table,
        data: {
          id
        },
        parent: true
      }).then(res1 => {
        data.visual = res1[0]
        return list({
          table: tableConfig,
          data: {
            visual_id: data.visual.id
          },
          parent: true
        })
      }).then(res2 => {
        data.config = res2[0];
        return save(data)
      }).then(res3 => {
        resolve(res3)
      })
    })
  },
  del: (id) => del({
    table: table,
    data: {
      id
    }
  }),
}