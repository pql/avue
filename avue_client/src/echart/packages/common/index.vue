<template>
  <div :class="[b(),className]"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255,255,255,0)"
       v-loading="loading"
       :style="styleSizeName">
    <div :ref="id"
         :style="styleChartName"></div>
  </div>
</template>

<script>
import { funEval } from '@avue/avue-data/utils/utils';
import create from "../../create";
export default create({
  name: "common",
  data () {
    return {
      loading: false,
      timeout: null
    }
  },
  computed: {
    src () {
      return this.option.src;
    },
    remote () {
      return this.option.remote;
    }
  },
  watch: {
    src () {
      this.debounce(this.updateChart)()
    },
    remote () {
      this.updateChart()
    }
  },
  methods: {
    debounce (func, wait = 600) {
      let that = this;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(that.timeout);
        that.timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    },
    updateChart () {
      const optionData = this.deepClone(this.dataChart) || [];
      let option
      const callback = (res) => {
        this.$emit('error-change', '')
        this.loading = false;
        this.myChart.resize();
        this.myChart.setOption(option, this.initialize);
        this.bindEvent()
      }
      if (this.remote && this.src) {
        this.loading = true;
        this.$axios.get(this.src).then(res => {
          try {
            let result = funEval(res.data)
            option = result && result(optionData, this.dataParams);
            this.$emit('remote-change', {
              id: this.component,
              content: option
            })
            callback()
          } catch (err) {
            this.$emit('error-change', err)
          }
        }).catch(err => {
          this.$emit('error-change', err)
          this.loading = false;
        })
      } else {
        try {
          option = this.echartFormatter(optionData, this.dataParams) || {};
          callback()
        } catch (err) {
          this.$emit('error-change', err)
        }
      }
    }
  }
});
</script>



