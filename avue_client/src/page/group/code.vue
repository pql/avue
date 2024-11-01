<template>
  <el-dialog :visible.sync="visible"
             :close-on-click-modal="false"
             :before-close="handleClose"
             class="avue-dialog"
             :title="title || '数据处理'"
             width="90%">
    <other-list>
      <div class="item">
        <el-button type="primary"
                   size="mini"
                   @click="$refs.codeTip.open()"
                   icon="el-icon-notebook-2">说明</el-button>
      </div>
      <div class="item">
        <el-button icon="el-icon-edit"
                   type="primary"
                   size="mini"
                   @click="$refs.code.handleOpen()">放大编辑器</el-button>
      </div>
    </other-list>
    <div class="avue-flex"
         :key="reload"
         style="align-items: flex-start;">
      <monaco-editor v-model="code"
                     v-loading="loading"
                     v-bind="$loadingParams"
                     :language="language"></monaco-editor>
    </div>
    <span class="avue-dialog__footer avue-dialog__footer--right">
      <el-button size="small"
                 @click="setVisible(false)">取 消</el-button>
      <el-button type="primary"
                 @click="submit"
                 size="small">确 定</el-button>
    </span>
    <code-tip ref="codeTip"
              :type="type"></code-tip>
    <code-edit ref="code"
               v-model="form"></code-edit>
  </el-dialog>
</template>

<script>

import codeEdit from '@avue/avue-data/page/components/code-edit'
import { funEval } from '@avue/avue-data/utils/utils'
import otherList from '@avue/avue-data/page/group/other-list'
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import codeTip from '@avue/avue-data/page/group/code-tip'
export default {
  inject: ["contain"],
  components: { codeEdit, MonacoEditor, codeTip, otherList },
  provide () {
    return {
      contain: this.contain,
    };
  },
  data () {
    return {
      reload: Math.random(),
      loading: false,
      form: {
        content: '',
        type: ''
      },
      code: ''
    }
  },
  props: {
    rules: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'javascript'
    },
    codeType: String,
    title: String,
    visible: Boolean,
    type: String,
    value: [String, Object, Array]
  },
  computed: {
    isCodeEdit () {
      return !!this.codeType
    },
    isCode () {
      let prop = this.codeType
      return ['vue', 'common', 'html', 'echart'].includes(prop)
    }
  },
  watch: {
    value: {
      handler (val) {
        if (this.validatenull(val)) {
          if (['dataFormatter', 'stylesFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data,params,refs)=>{
    return {}
}`
          } else if (['query', 'header', 'dataQuery', 'dataHeader'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data)=>{
    return {}
}`
          } else if (['echartFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data)=>{
    const myChart = this.myChart;
    const option={}
    return option
}`
          } else if (['clickFormatter', 'dblClickFormatter', 'mouseEnterFormatter', 'mouseLeaveFormatter', 'dataBeforeFormatter', 'dataAfterFormatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(params,refs)=>{
    console.log(params,refs)
}`
          } else if (['labelFormatter', 'formatter'].includes(this.type) && this.validatenull(val)) {
            this.code = `(name,data)=>{
    console.log(name,data)
    return ''
}`
          } else if (['before'].includes(this.type) && this.validatenull(val)) {
            this.code = `(data)=>{
    return new Promise(resolve=>{
      resolve()
    })
}`
          } else {
            this.code = val;
          }
        } else {
          this.code = val;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleStart () {
      this.loading = true
    },
    handleCode (code) {
      this.loading = false
      this.code = code
      this.$message.success('代码生成完成')
    },
    handleClose () {
      this.setVisible(false);
    },
    submit () {
      let value = this.code;
      if (!this.rules) {
        this.$emit('submit', value);
        this.setVisible(false)
      } else if (typeof value == 'object' || this.type == 'style') {
        this.$emit('submit', value);
        this.setVisible(false)
      } else {
        try {
          funEval(value);
          if (['data', 'column'].includes(this.type)) value = funEval(value);
          this.$emit('submit', value);
          this.setVisible(false)
        } catch (error) {
          console.log(error);
          this.$message.error('数据格式有误')
        }
      }


    },
    setVisible (val) {
      this.$emit('update:visible', val);
    }
  }
}
</script>
