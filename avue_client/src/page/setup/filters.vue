<template>
  <div style="padding:0 10px;">
    <el-button size="small"
               type="primary"
               style="margin:10px 0 10px 0;"
               @click="handleAddGroup()">新增过滤器</el-button>
    <ul class="menu__ul"
        v-if="list.length!=0">
      <li class="menu__item"
          v-for="(item,index) in list"
          :key="index">
        <span class="menu__icon">
          <svg-icon icon-class="filters" />
        </span>
        <span class="menu__label">
          <input type="text"
                 v-model="item.name">
        </span>
        <span class="menu__menu">
          <i class="el-icon-edit"
             @click.stop="handleEditGroup(item,index)"></i>
          <i class="el-icon-delete"
             @click.stop="handleDelGroup(item,index)"></i>
        </span>
      </li>
    </ul>
    <el-empty v-else
              description="暂无过滤器">
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
    <codeedit @submit="codeClose"
              :title="form.name+'过滤器'"
              :rules="false"
              v-model="code.obj"
              v-if="code.box"
              :type="code.type"
              language="javascript"
              :visible.sync="code.box"></codeedit>

  </div>
</template>

<script>
import codeedit from '@avue/avue-data/page/group/code';
import { uuid } from '@avue/avue-data/utils/utils'
export default {
  inject: ["contain"],
  components: {
    codeedit
  },
  data () {
    return {
      code: {
        type: 'dataFormatter',
        box: false,
        obj: {},
      },
      item: {},
      form: {},
      index: null,
      obj: {}
    }
  },
  computed: {
    list () {
      let list = this.contain.config.filters
      return Object.keys(list).map(key => list[key])
    }
  },
  methods: {
    handleContextMenu (item = {}, done) {
      this.item = item;
      done()
    },
    handleAddGroup () {
      if (!this.contain.config.filters) {
        this.contain.config.filters = {}
      }
      let id = uuid();
      this.$set(this.contain.config.filters, id, {
        id,
        name: '新增过滤器',
        dataFormatter: ''
      })
    },
    handleEditGroup (item) {
      this.form = item;
      this.openCode()
    },
    codeClose (value) {
      this.contain.config.filters[this.form.id][this.code.type] = value;
    },
    openCode () {
      this.code.obj = this.form[this.code.type];
      this.code.box = true;
    },
    handleDelGroup (item) {
      this.$confirm(`是否删除【${item.name}】过滤器?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete this.contain.config.filters[item.id]
      })
    }
  }
}
</script>

<style>
</style>