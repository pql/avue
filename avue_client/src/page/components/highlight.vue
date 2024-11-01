<template>
  <div v-if="reload"
       class="avue-code"
       :style="styleName">
    <pre v-highlight>
          <code class="javascript" >{{value}}</code>
      </pre>
  </div>

</template>

<script>
export default {
  props: {
    value: String,
    height: [String, Number]
  },
  data () {
    return {
      reload: true
    }
  },
  computed: {
    styleName () {
      return {
        maxHeight: this.height + 'px',
        overflow: 'auto'
      }
    }
  },
  watch: {
    value: {
      handler () {
        this.reload = false;
        this.$nextTick(() => {
          this.reload = true;
        })
      },
      deep: true
    },
  }
}
</script>

<style lang="scss">
.avue-code {
  margin: 5px 0;
  background: var(--bg-color);
  border: 1px solid var(--bg-color);
  code {
    min-height: 50px;
    margin-top: -20px;
    font-size: 12px;
    line-height: 20px;
  }
  .hljs {
    background-color: var(--bg-color);
  }
}
</style>