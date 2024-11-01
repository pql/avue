<template>
  <div style="padding:0 5px;">
    <el-button size="small"
               type="primary"
               style="margin:10px 0 10px 0;"
               @click="handleAdd()">新增函数</el-button>
    <ul class="menu__ul"
        v-if="list.length!=0">
      <li class="menu__item"
          v-for="(item,index) in list"
          :key="index">
        <span class="menu__icon">
          <svg-icon icon-class="func" />
        </span>
        <span class="menu__label">
          <input type="text"
                 v-model="item.name">

        </span>
        <span class="menu__menu">
          <i class="el-icon-edit"
             @click.stop="handleEdit(item,index)"></i>
          <i class="el-icon-delete"
             @click.stop="handleDel(item,index)"></i>
        </span>
      </li>
    </ul>
    <el-empty v-else
              description="暂无函数">
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
    <codeedit @submit="codeClose"
              :title="form.name+'函数'"
              :rules="false"
              v-model="code.obj"
              v-if="code.box"
              :type="code.type"
              language="javascript"
              :visible.sync="code.box"></codeedit>

  </div>
</template>

<script>
import { getFunction } from '@avue/avue-data/utils/utils'
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
  watch: {
    'contain.config.funcs' () {
      this.initData()
    }
  },
  computed: {
    list () {
      let list = this.contain.config.funcs
      return Object.keys(list).map(key => list[key])
    }
  },
  methods: {
    initData () {
      window.$glob.func = window.$glob.func || {};
      this.list.forEach(ele => {
        window.$glob.func[ele.name] = getFunction(ele.dataFormatter);
      })
    },
    handleAdd () {
      if (!this.contain.config.funcs) {
        this.contain.config.funcs = {}
      }
      let id = uuid();
      this.$set(this.contain.config.funcs, id, {
        id,
        name: '新增函数',
        isname: true,
        dataFormatter: ''
      })
    },
    handleEdit (item) {
      this.form = item;
      this.openCode()
    },
    codeClose (value) {
      this.contain.config.funcs[this.form.id][this.code.type] = value;
      this.initData()
    },
    openCode () {
      this.code.obj = this.form[this.code.type];
      this.code.box = true;
    },
    handleDel (item) {
      this.$confirm(`是否删除【${item.name}】函数?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete this.contain.config.funcs[item.id]
        this.initData()
      })
    }
  }
}
</script>

<style>
</style>