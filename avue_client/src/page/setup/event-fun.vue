<template>
  <div style="padding:0 10px">
    <other-list style="padding:0 0 10px 0"></other-list>
    <div class="avue-flex">
      <div class="item">
        <el-button type="primary"
                   size="mini"
                   @click="$refs.codeTip.open()"
                   icon="el-icon-notebook-2">说明</el-button>
      </div>
    </div>
    <monaco-editor v-model="text"
                   height="300"
                   language="javascript"></monaco-editor>
    <code-tip ref="codeTip"
              :type="type"></code-tip>
  </div>
</template>

<script>
import otherList from '@avue/avue-data/page/group/other-list'
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import codeTip from '@avue/avue-data/page/group/code-tip'
export default {
  inject: ["contain"],
  components: { MonacoEditor, codeTip, otherList },
  props: {
    value: [String, Object],
  },
  provide () {
    return {
      contain: this.contain,
    };
  },
  watch: {
    value: {
      handler (val) {
        this.text = val || this.temp;
      },
      immediate: true
    },
    text: {
      handler (val) {
        this.$emit('input', val);
      },
      immediate: true
    },
  },
  data () {
    return {
      text: '',
      temp: `(params,refs)=>{
    console.log(params,refs)
}`,
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.event {
  &__menu {
    margin-bottom: 10px;
    padding-right: 10px;
  }
  &__label {
    width: 100%;
    padding: 5px 10px 10px 10px;
    box-sizing: border-box;
    font-size: 13px;
    color: var(--text-color);
  }
  &__content {
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;
  }
}
</style>
