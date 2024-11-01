<template>
  <div class="item-content">
    <el-form-item label-width="100"
                  label="条件类型">
      <el-radio-group v-model="item.typeIf"
                      size="mini">
        <el-radio :label="1">关系条件</el-radio>
        <el-radio :label="0">高级条件</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="item.typeIf==1"
                  label-width="100"
                  label="比较条件">
      <avue-select v-model="item.key"
                   style="width:120px"
                   allowCreate
                   :dic="contain.activeObj.dataBind"
                   :props="{desc:'value'}"
                   filterable
                   placeholder="请选择值"></avue-select>
      <avue-select :dic="conditionOption"
                   style="width:60px"
                   v-model="item.condition"
                   placeholder="请选择规则"></avue-select>
      <avue-select v-model="item.type"
                   style="width:100px"
                   :dic="[{label:'固定值',value:0},{label:'对象',value:1}]"></avue-select>
      <template v-if="item.type==1">
        <avue-select v-model="item.index"
                     :dic="contain.list"
                     style="width:150px"
                     @change="handleChange(item)"
                     placeholder="请选择组件"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
        <avue-select v-model="item.value"
                     style="width:120px"
                     :dic="item.dic"
                     :props="{desc:'value'}"
                     allowCreate
                     filterable
                     placeholder="请选择值"></avue-select>
      </template>
      <el-input v-else
                v-model="item.value"
                style="width:120px"
                placeholder="请输入值"></el-input>
    </el-form-item>
    <el-form-item v-else-if="item.typeIf==0">
      <monaco-editor v-model="item.fun"
                     height="250"></monaco-editor>
    </el-form-item>
  </div>
</template>

<script>
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import { conditionOption } from '@avue/avue-data/option/config'

export default {
  inject: ["contain"],
  props: {
    item: Object
  },
  components: { MonacoEditor },
  data () {
    return {
      conditionOption
    }
  },
  methods: {
    handleChange (row) {
      this.$nextTick(() => {
        row.dic = []
        let { item } = this.contain.findnav(row.index)
        row.dic = item.dataBind
      })
    },
  }
}
</script>

<style>
</style>