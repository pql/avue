<template>
  <div>
    <el-dialog append-to-body
               @open="open"
               title="组态配置"
               :close-on-click-modal="false"
               :visible.sync="show"
               width="60%">
      <div style="margin-bottom: 20px;">
        <el-button @click="openBlock"
                   size="small"
                   type="primary">导入组件</el-button>
      </div>
      <monaco-editor v-model="json"
                     height="400"
                     language="javascript"></monaco-editor>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="exportData"
                   size="small"
                   type="success">导出配置</el-button>
        <el-button @click="importData"
                   size="small"
                   type="primary">确认导入</el-button>
      </span>

    </el-dialog>

    <el-dialog append-to-body
               @open="open"
               class="avue-dialog"
               title="导入组件(支持数组/对象)"
               :close-on-click-modal="false"
               :visible.sync="show1"
               width="80%">
      <div style="margin-bottom:20px;">
        <el-button @click="openSc"
                   size="small"
                   type="primary">收藏组件</el-button>
        <el-button @click="openScreen"
                   size="small"
                   type="primary">组态组件</el-button>
      </div>
      <monaco-editor v-model="json1"
                     height="500"
                     language="javascript"></monaco-editor>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="importBlock"
                   size="small"
                   type="primary">确认导入</el-button>
      </span>

    </el-dialog>
    <el-dialog append-to-body
               class="avue-dialog"
               title="导入组态组件"
               :close-on-click-modal="false"
               :visible.sync="show2"
               width="60%">
      <el-input v-model="search"
                size="small"
                placeholder="请输入组态ID">
        <template #append>
          <el-button icon="el-icon-search"
                     @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <avue-crud v-loading="loading"
                 v-bind="$loadingParams"
                 @selection-change="selectionChange"
                 :option="option"
                 :data="data">
      </avue-crud>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="importScreen"
                   size="small"
                   type="primary">确认导入</el-button>
      </span>
    </el-dialog>
    <el-dialog append-to-body
               class="avue-dialog"
               title="导入收藏组件"
               :visible.sync="show3"
               width="70%">
      <component-list v-if="show3"
                      :activeName="3"
                      @change="handleApiChange"
                      :menu="false"></component-list>
    </el-dialog>

  </div>
</template>

<script>
import { config as defaultConfig } from '@avue/avue-data/option/config'
import { getObj } from '@avue/avue-data/api/visual'
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import { getObj as getCompObj } from '@avue/avue-data/api/components'
import componentList from '@avue/avue-data/page/list/components'
import { importArrayBlock } from '@avue/avue-data/utils/utils';
export default {
  components: { MonacoEditor, componentList },
  inject: ["contain"],
  data () {
    return {
      show: false,
      show1: false,
      show2: false,
      show3: false,
      json: {},
      json1: '',
      search: '',
      selection: [],
      option: {
        tip: false,
        header: false,
        selection: true,
        loading: false,
        delBtn: false,
        disabled: true,
        editBtnText: '查看',
        updateBtn: false,
        rowKey: 'index',
        column: [{
          label: '组件类型',
          prop: 'title',
          span: 24
        }, {
          label: '组件名称',
          prop: 'name',
          span: 24
        }, {
          label: '代码',
          hide: true,
          span: 24,
          rows: 8,
          type: 'textarea',
          prop: 'code'
        }]
      },
      data: []
    }
  },
  methods: {
    handleApiChange (item) {
      getCompObj(item.id).then(res => {
        const data = res.data.data;
        this.json1 = JSON.parse(data.content);
        this.show3 = false;
      })
    },
    selectionChange (list) {
      this.selection = list;
    },
    handleSearch () {
      this.loading = true;
      this.data = [];
      getObj(this.search).then(res => {
        this.loading = false;
        const data = res.data.data
        if (data) {
          let list = JSON.parse(data.config.component)
          list.forEach(ele => {
            ele.code = JSON.stringify(this.deepClone(ele), null, 4)
          })
          this.data = list;
        }
      })
    },
    open () {
      this.json = {
        detail: this.contain.config,
        component: this.contain.nav
      }
      this.json1 = ''
    },
    importBlock () {
      try {
        let json = typeof (this.json1) == 'string' ? JSON.parse(this.json1) : this.json1
        const group = this.contain.group;
        if (Array.isArray(json)) {
          json.forEach(ele => {
            importArrayBlock([ele], group)
            this.contain.nav.unshift(ele)
          })
        } else {
          importArrayBlock([json], group)
          this.contain.nav.unshift(json)
        }
        this.show = false
        this.show1 = false
        this.$message.success('导入组件成功')
      } catch (err) {
        this.$message.error('导入数据错误')
      }
    },
    openBlock () {
      this.show1 = true
    },
    importScreen () {
      let list = this.deepClone(this.selection);
      list.forEach(ele => {
        importArrayBlock([ele], this.contain.group)
        delete ele.$index
        delete ele.code
      })
      this.show2 = false
      this.json1 = list;
    },
    openSc () {
      this.show3 = true
    },
    openScreen () {
      this.data = []
      this.selection = []
      this.search = ''
      this.show2 = true
    },
    importData () {
      try {
        let json = typeof (this.json) == 'string' ? JSON.parse(this.json) : this.json
        json.detail = Object.assign(defaultConfig, json.detail);
        this.contain.config = json.detail
        this.contain.nav = json.component
        this.show = false;
        this.$message.success('数据导入成功')
      } catch (err) {
        console.log(err)
        this.$message.error('导入数据错误')
      }
    },
    exportData () {
      const blob = new Blob([JSON.stringify(this.json, null, 4)], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, "data.json");
      this.loading = false
      this.$message.success('组态导出成功')
    }
  }
}
</script>

<style>
</style>