<template>
  <div style="padding:5px 10px;">
    <div style="margin:10px 0 10px 0;">
      <el-button size="small"
                 type="primary"
                 @click="rowSave({})">新增字体</el-button>
    </div>

    <avue-crud ref="crud"
               style="display:none"
               :option="option"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               :data="contain.config.fonts">
    </avue-crud>
    <ul class="menu__ul"
        v-if="contain.config.fonts.length!==0">
      <li class="menu__item"
          v-for="(item,index) in contain.config.fonts"
          :key="index">
        <span class="menu__icon">
          <svg-icon icon-class="fonts" />
        </span>
        <span class="menu__label">
          <input type="text"
                 placeholder="名称"
                 v-model="item.name">
          <input type="text"
                 placeholder="字体地址"
                 v-model="item.value">
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
              description="暂无字体">
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
  </div>
</template>

<script>
import { loadFont } from '@avue/avue-data/utils/utils'
export default {
  inject: ["contain"],
  data () {
    return {
      option: {
        dialogWidth: '400',
        dialogMenuPosition: 'center',
        refreshBtn: false,
        columnBtn: false,
        height: 'auto',
        calcHeight: 50,
        align: 'center',
        headerAlign: 'center',
        menuType: 'icon',
        size: 'mini',
        menuWidth: 130,
        column: [
          {
            label: '字体名称',
            prop: 'name',
            span: 24,
            rules: [{
              required: true,
              message: "请输入字体名称",
              trigger: "blur"
            }]
          },
          {
            label: '字体地址',
            prop: 'value',
            type: 'textarea',
            span: 24,
            hide: true,
            overHidden: true,
            rules: [{
              required: true,
              message: "请输入字体地址",
              trigger: "blur"
            }]
          }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    initData () {
      let list = this.contain.config.fonts;
      list.forEach(ele => {
        loadFont(ele.name, ele.value)
      })
    },
    rowDel (row, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.contain.config.fonts.splice(index, 1)
        this.initData()
      })
    },
    rowUpdate (row, index, done) {
      this.$set(this.contain.config.fonts, index, row)
      this.initData()
      done();
    },
    rowSave (row, done) {
      this.contain.config.fonts.push(row)
      this.initData()
      done && done()
    },
  }
}
</script>

<style>
</style>