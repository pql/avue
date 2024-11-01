<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       @dblclick="handleDblClick"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255,255,255,0)"
       v-loading="loading"
       @click="handleClick">
    <div :style="styleChartName"
         v-show="!loading">
      <component v-for="(item,index) in remote?list:child"
                 :key="index"
                 :style="getStyleName(item)"
                 :ref="common.NAME+item.index"
                 :id="common.NAME+item.index"
                 :is="common.COMPNAME+item.component.name"
                 v-bind="item"
                 :component="item.component"
                 :data-formatter-str="item.dataFormatter"
                 :click-formatter-str="item.clickFormatter"
                 :dbl-click-formatter-str="item.dblClickFormatter"
                 :mouse-enter-formatter-str="item.mouseEnterFormatter"
                 :mouse-leave-formatter-str="item.mouseLeaveFormatter"
                 :data-before-formatter-str="item.dataBeforeFormatter"
                 :data-after-formatter-str="item.dataAfterFormatter"
                 :echart-formatter-str="item.echartFormatter"
                 :label-formatter-str="item.labelFormatter"
                 :styles-formatter-str="item.stylesFormatter"
                 :formatter-str="item.formatter"
                 :sql-formatter="sqlFormatter"
                 :record-formatter="recordFormatter"
                 :width="item.component.width"
                 :height="item.component.height"
                 title="" />
    </div>
  </div>
</template>

<script>
import { getObj as getComp } from '@avue/avue-data/api/visual'
import create from "../../create";
import common from '@avue/avue-data/config'
export default create({
  name: "group",
  data () {
    return {
      loading: false,
      timeout: null,
      list: '',
      sqlFormatter: '',
      recordFormatter: '',
      common
    };
  },
  computed: {
    remote () {
      return this.option.remote;
    },
    ids () {
      return this.option.id
    },
    child () {
      return this.getList(JSON.parse(this.option.content || '[]'));
    },
    group () {
      return this.option.group
    }
  },
  watch: {
    ids () {
      this.debounce(this.getComp)()
    },
    group (val) {
      if (val) {
        this.getComp()
      }
    },
    remote (val) {
      if (val) {
        this.getComp()
      }
    }
  },
  created () {
    this.getComp()
  },
  mounted () {

  },
  methods: {
    getList (data) {
      let result = [];
      const callback = (list) => {
        list.forEach(ele => {
          if (ele.children) callback(ele.children)
          else result.push(ele)
        })
      }
      callback(data);

      console.log(result);
      return result;
    },
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
    getComp () {
      if (!this.ids) return
      this.loading = true;
      getComp(this.ids).then(res => {
        this.loading = false;
        const data = res.data.data
        this.list = this.getList(JSON.parse(data.config.component))
      }).catch(() => {
        this.loading = false;
      })
    },
    getStyleName (item) {
      return {
        position: 'absolute',
        width: this.setPx(item.component.width),
        height: this.setPx(item.component.height),
        left: this.setPx(item.left),
        top: this.setPx(item.top),
        zIndex: item.zIndex
      }
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
});
</script>


