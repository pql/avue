<template>
  <div style="padding:0 5px;">
    <el-dropdown size="small"
                 style="margin:10px 0 10px 0;"
                 trigger="click">
      <span class="el-dropdown-link">
        <el-button size="small"
                   icon="el-icon-plus"
                   type="primary">新增变量</el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="rowAdd({label:'自定义'})">自定义</el-dropdown-item>
        <el-dropdown-item v-for="(item,index) in paramsOption"
                          @click.native="rowAdd(item)"
                          :divided="index==0"
                          :key="index">{{ item.label }}</el-dropdown-item>
        <el-dropdown-item v-for="(item,index) in dataParent.iotList"
                          @click.native="rowAdd(item)"
                          :divided="index==0"
                          :key="index">{{ item.label }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <avue-crud ref="crud"
               style="display:none"
               :option="option"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               v-model="form"
               :data="contain.activeObj.dataBind">
    </avue-crud>
    <ul class="menu__ul"
        v-if="contain.activeObj.dataBind.length!==0">
      <li class="menu__item"
          v-for="(item,index) in contain.activeObj.dataBind"
          :key="index">
        <span class="menu__icon">
          <svg-icon icon-class="variable" />
        </span>
        <span class="menu__label">
          <span class="menu__name">
            <el-checkbox v-model="item.option"
                         :disabled="item.system"></el-checkbox>
            <input type="text"
                   :disabled="item.system"
                   placeholder="变量名"
                   v-model="item.label">
            <input type="text"
                   placeholder="属性"
                   :disabled="item.system"
                   v-model="item.value">
            <avue-select :dic="valueTypeOption"
                         type="small"
                         style="width:70px;"
                         placeholder="类型"
                         :disabled="item.iot?false:item.system"
                         v-model="item.type" />

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

import { paramsOption, valueTypeOption } from '@avue/avue-data/option/config'
export default {
  inject: ["contain", "dataParent"],
  data () {
    return {
      form: {},
      paramsOption,
      valueTypeOption,
    }
  },
  computed: {
    option () {
      return {
        dialogWidth: '400',
        dialogMenuPosition: 'center',
        align: 'center',
        headerAlign: 'center',
        menuType: 'icon',
        column: [
          {
            label: '名称',
            prop: 'label',
            span: 24,
            disabled: this.form.system,
            rules: [{
              required: true,
              message: "请输入名称",
              trigger: "blur"
            }]
          },
          {
            label: '属性',
            prop: 'value',
            span: 24,
            disabled: this.form.system,
            rules: [{
              required: true,
              message: "请输入属性",
              trigger: "blur"
            }]
          },
          {
            label: '类型',
            prop: 'type',
            type: 'select',
            disabled: this.form.iot ? false : this.form.system,
            dicData: valueTypeOption,
            span: 24
          }, {
            label: '组件属性',
            prop: 'option',
            type: 'switch',
            display: !this.form.system,
            span: 24
          }
        ]
      }
    }
  },
  methods: {
    rowAdd (item) {
      let obj = this.contain.activeObj.dataBind.find(ele => ele.value == item.value)
      if (obj) return
      this.contain.activeObj.dataBind.push(item)
    },
    rowDel (row, index) {
      this.contain.activeObj.dataBind.splice(index, 1)
    },
    rowUpdate (row, index, done) {
      this.$set(this.contain.activeObj.dataBind, index, row)
      done();
    },
    rowSave (row, done) {
      this.contain.activeObj.dataBind.push(row)
      done()
    }
  }
}
</script>
