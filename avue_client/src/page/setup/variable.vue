<template>
  <div style="padding:5px 10px;">
    <div style="margin:10px 0 10px 0;">
      <el-button size="small"
                 type="primary"
                 @click="rowAdd({})">新增变量</el-button>
    </div>

    <avue-crud ref="crud"
               style="display:none"
               :option="option"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               v-model="form"
               :data="contain.config.glob">
    </avue-crud>
    <ul class="menu__ul"
        v-if="contain.config.glob.length!==0">
      <li class="menu__item"
          v-for="(item,index) in contain.config.glob"
          :key="index">
        <span class="menu__icon">
          <svg-icon icon-class="variable" />
        </span>
        <span class="menu__label">
          <span class="menu__name">
            <input type="text"
                   placeholder="名称"
                   v-model="item.name">
            <input type="text"
                   placeholder="属性"
                   v-model="item.key">
            <input type="text"
                   placeholder="值"
                   v-model="item.value">
          </span>
        </span>
        <span class="menu__menu">
          <i class="el-icon-edit"
             @click.stop="$refs.crud.rowEdit(item,index)"></i>
          <i class="el-icon-delete"
             @click.stop="$refs.crud.rowDel(item,index)"></i>
        </span>
      </li>
    </ul>
    <el-empty v-else
              description="暂无变量">
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
  </div>
</template>

<script>

export default {
  inject: ["contain"],
  data () {
    return {
      form: {}
    }
  },
  computed: {
    option () {
      return {
        dialogWidth: '400',
        dialogMenuPosition: 'center',
        refreshBtn: false,
        columnBtn: false,
        height: 'auto',
        calcHeight: 50,
        align: 'center',
        headerAlign: 'center',
        menuType: 'icon',
        menuWidth: 130,
        column: [
          {
            label: '名称',
            prop: 'name',
            span: 24,
            formatter: (row) => {
              return `${row.name}-${row.key}`
            },
            rules: [{
              required: true,
              message: "请输入名称",
              trigger: "blur"
            }]
          },
          {
            label: '变量名',
            prop: 'key',
            hide: true,
            span: 24,
            tip: '输入框中使用${' + this.form.key + `}，js语法中使用window.$glob.${this.form.key}`,
            rules: [{
              required: true,
              message: "请输入变量名",
              trigger: "blur"
            }]
          },
          {
            label: '变量值',
            prop: 'value',
            type: 'textarea',
            span: 24,
            hide: true,
            overHidden: true,
            rules: [{
              required: true,
              message: "请输入变量值",
              trigger: "blur"
            }]
          }
        ]
      }
    }
  },
  methods: {
    initData () {
      let list = this.contain.config.glob;
      list.forEach(ele => {
        window.$glob[ele.key] = ele.value
      })
    },

    rowAdd (item) {
      this.contain.config.glob.push(item)
    },
    rowDel (row, index) {
      this.contain.config.glob.splice(index, 1)
      this.initData()
    },
    rowUpdate (row, index, done) {
      this.$set(this.contain.config.glob, index, row)
      this.initData()
      done();
    },
    rowSave (row, done) {
      this.contain.config.glob.push(row)
      this.initData()
      done()
    },
  }
}
</script>

<style>
</style>