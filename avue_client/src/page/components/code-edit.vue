<template>
  <div>
    <el-dialog title="代码编辑"
               fullscreen
               modal-append-to-body
               :visible.sync="box"
               append-to-body
               :close-on-click-modal="false"
               width="100%">
      <div class="code-edit">
        <div class="left">
          <monaco-editor v-model="form.content"
                         :language="options.language"
                         :height="options.height"
                         :options="options"></monaco-editor>
        </div>
        <div class="right"
             v-if="reload">
          <div class="tip"
               v-if="error">{{error}}</div>
          <avue-echart-vue :option="vueOption"
                           v-bind="contain&&contain.activeObj"
                           v-if="form.type==0"
                           @error-change="errorChange"
                           width="100%"
                           height="100%"></avue-echart-vue>
          <avue-echart-common :echart-formatter-str="vueOption.content"
                              v-bind="contain&&contain.activeObj"
                              @error-change="errorChange"
                              v-else-if="form.type==1"
                              width="100%"></avue-echart-common>
          <avue-echart-html :option="vueOption"
                            v-bind="contain&&contain.activeObj"
                            @error-change="errorChange"
                            v-else-if="form.type==2"
                            width="100%"></avue-echart-html>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import common from '@avue/avue-data/config'
import AvueEchartVue from '@avue/avue-data/echart/packages/vue';
import AvueEchartCommon from '@avue/avue-data/echart/packages/common';
import AvueEchartHtml from '@avue/avue-data/echart/packages/html';
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
export default {
  inject: ["contain"],
  components: {
    AvueEchartCommon,
    AvueEchartVue,
    AvueEchartHtml,
    MonacoEditor
  },
  watch: {
    'form.content' (val) {
      this.handleOption()
    },
    value: {
      handler (val) {
        this.form = val;
      },
      deep: true

    },
    form: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  props: {
    value: {}
  },
  data () {
    return {
      common,
      error: "",
      vueOption: '',
      box: false,
      reload: false,
      options: {
        height: 600,
        language: 'javascript',
      },
      form: {}
    }
  },
  methods: {
    errorChange (val) {
      if (val) console.log(val)
      this.error = val
    },
    handleOpen () {
      this.form = this.value
      this.box = true;
      this.$nextTick(() => {
        this.handleOption()
      })
    },
    handleClose () {
      this.$emit('input', this.form)
      this.box = false;
    },
    handleOption () {
      this.reload = false;
      this.vueOption = this.deepClone(this.form)
      this.$nextTick(() => {
        this.reload = true;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.code-edit {
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  box-sizing: border-box;
  .left {
    width: 50%;
  }
  .right {
    width: 50%;
  }
  .right {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .tip {
    color:var(--text-color);
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
</style>