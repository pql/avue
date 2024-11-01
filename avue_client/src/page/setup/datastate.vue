<template>
  <el-form label-width="90px"
           label-position="left"
           style="padding:0 10px;"
           size="small">
    <el-form-item label="初始化状态">
      <avue-select v-model="contain.activeObj.state"
                   placeholder="请选择初始化状态"
                   :props="{label:'name',value:'state'}"
                   :dic="contain.activeObj.stateList"></avue-select>
    </el-form-item>
    <el-button size="small"
               type="primary"
               style="margin:10px 0 10px 0;"
               @click="rowAdd({})">新增状态</el-button>
    <avue-crud ref="crud"
               style="display:none"
               :option="option"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               v-model="form"
               :data="contain.activeObj.stateList">
    </avue-crud>
    <ul class="menu__ul"
        v-if="contain.activeObj.stateList&&contain.activeObj.stateList.length!==0">
      <li class="menu__item"
          v-for="(item,index) in contain.activeObj.stateList"
          :key="index">
        <span class="menu__label">
          <span class="menu__name">
            <img style="width:30px;height:30px;margin-right: 5px;"
                 :src="item.value">
            <input type="text"
                   placeholder="名称"
                   v-model="item.name">
            <input type="text"
                   placeholder="状态"
                   v-model="item.state">
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
              description="暂无状态">
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
  </el-form>
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
            label: '状态',
            prop: 'state',
            hide: true,
            span: 24,
            rules: [{
              required: true,
              message: "请输入状态",
              trigger: "blur"
            }]
          },
          {
            label: '值',
            prop: 'value',
            type: 'textarea',
            span: 24,
            hide: true,
            overHidden: true,
            rules: [{
              required: true,
              message: "请输入值",
              trigger: "blur"
            }]
          }
        ]
      }
    }
  },
  created () {
    if (!this.contain.activeObj.stateList) this.$set(this.contain.activeObj, 'stateList', []);
  },
  methods: {

    rowAdd (item) {
      this.contain.activeObj.stateList.push(item)
    },
    rowDel (row, index) {
      this.contain.activeObj.stateList.splice(index, 1)
    },
    rowUpdate (row, index, done) {
      this.$set(this.contain.activeObj.stateList, index, row)

      done();
    },
    rowSave (row, done) {
      this.contain.activeObj.stateList.push(row)
      done()
    },
  }
}
</script>

<style>
</style>