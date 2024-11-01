<template>
  <div class="tree-menu">
    <avue-tree ref="tree"
               :permission="getPermission"
               :option="option"
               :data="data"
               v-model="form"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(255,255,255,0)"
               v-loading="loading"
               @node-click="nodeClick"
               @update="update"
               @save="save"
               @del="del">
    </avue-tree>
  </div>
</template>
<script>
import { getList, addObj, delObj, updateObj } from '@avue/avue-data/api/category'
export default {
  props: {
    type: String,
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      form: {},
      data: [],
      option: {
        defaultExpandAll: true,
        dialogWidth: '400',
        props: {
          label: 'categoryKey',
          value: 'categoryValue',
        },
        formOption: {
          labelWidth: 80,
          column: [{
            label: '模块名',
            prop: 'categoryKey',
            span: 24,
            rules: [{
              required: true,
              message: "请输入模块名",
              trigger: "blur"
            }]
          }, {
            label: '模块值',
            prop: 'categoryValue',
            span: 24,
            rules: [{
              required: true,
              message: "请输入模块值",
              trigger: "blur"
            }]
          }],
        }
      }
    }
  },
  mounted () {
    this.getList()

  },
  methods: {
    nodeClick (data) {
      this.$emit('node-click', data);
    },
    getPermission (key, data) {
      if (!this.menu) return false
      else if (key == "addBtn" && data.categoryKey) { return false }
      else if (["editBtn", "delBtn"].includes(key) && data.categoryValue == '') { return false }
      else return true;
    },
    getList () {
      this.loading = true
      getList({
        categoryModule: this.type,
        current: 1,
        size: 99,
      }).then(res => {
        this.loading = false
        const data = res.data.data;
        this.data = [{ categoryKey: '全部', categoryValue: '' }].concat(data);
        this.$nextTick(() => this.$refs.tree.setCurrentKey(''))
      })
    },
    del (data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(data.data.id).then(() => {
          this.getList()
        })
      }).catch(() => {

      });
    },
    update (node, data, done, loading) {
      data.categoryModule = this.type
      updateObj(data).then(_ => {
        done();
        this.getList()
      }).catch(_ => {
        loading()
      })
    },
    save (node, data, done, loading) {
      data.categoryModule = this.type
      addObj(data).then(_ => {
        done();
        this.getList()
      }).catch(_ => {
        loading()
      })

    }
  }
}
</script>
<style lang="scss">
.avue-tree__menu {
  background-color: var(--primary-color);
  color: var(--text-color);
}
.el-cascader-panel.is-bordered {
  border-color: var(--border-color);
}
.tree-menu {
  min-height: 500px;
  height: 100%;
  border-right: 1px solid var(--border-color);
  background-color: var(--primary--bg-color);
  height: calc(100% - 50px);
  padding: 30px 10px 10px 10px;
  .el-tree,
  .el-tree-node__content {
    background-color: transparent !important;
  }
  .el-tree-node {
    padding: 6px 0;
  }
  .is-current {
    position: relative;
    color: var(--primary-color) !important;
    background-color: var(--bg-color);
    font-size: 15px;
    border-radius: 5px;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 3px;
      height: 50%;
      border-radius: 6px;
      transform: translateY(-50%);
      background-color: var(--primary-color);
    }
  }
  .avue-tree__filter .el-button {
    margin-left: 5px;
  }
}
</style>