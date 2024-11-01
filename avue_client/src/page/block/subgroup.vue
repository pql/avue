<template>
  <div style="width:100%;height:100%;">
    <div v-for="item in nav"
         :key="item.index"
         v-contextmenu="{id:contain.menuId,event:contain.handleContextMenu,value:item}">
      <template v-if="!item.children">
        <avue-draggable v-bind="item"
                        :range="!contain.isSelectActive"
                        :line="!contain.isSelectActive"
                        :tool="contain.config.toolShow"
                        :scale="container.stepScale"
                        :disabled="!contain.menuFlag"
                        :step="container.stepScale"
                        :width="item.component.width"
                        :height="item.component.height"
                        :ref="common.DEAFNAME+item.index"
                        :id="common.DEAFNAME+item.index"
                        :active-flag="contain.active.includes(item.index)"
                        v-show="getShow(item)&&getDisplay(item)&&(container.isBuild || !item.auto)"
                        @move="handleMove"
                        @out="handleOut"
                        @over="handleOver"
                        @focus="handleFocus"
                        @blur="handleBlur">
          <temp :item="item"
                :ref="common.NAME+item.index"></temp>
        </avue-draggable>
        <subgroup :nav="item.children"></subgroup>
      </template>
      <folder v-else
              @move="handleMove"
              @out="handleOut"
              @over="handleOver"
              @focus="handleFocus"
              @blur="handleBlur"
              :key="item.index"
              :item="item"
              v-bind="item"
              :is-build="container.isBuild"
              :auto="item.auto"
              :deep="contain.config.folderDeep"
              :tool="contain.config.toolShow"
              :line="!contain.isSelectActive"
              :step="container.stepScale"
              :scale="container.stepScale"
              :disabled="!contain.menuFlag"
              :id="common.DEAFNAME+item.index"
              :ref="common.DEAFNAME+item.index">
        <el-carousel class="carousel"
                     :interval="item.autoInterval"
                     :indicator-position="item.autoIndicatorPosition ||'none'"
                     :arrow="item.autoArrow || 'never'"
                     :direction="item.autoDirection"
                     :autoplay="item.autoAutoplay"
                     :type="item.autoType"
                     :initial-index="item.autoInitialIndex"
                     v-if="!container.isBuild&&item.auto"
                     style="height:100%">
          <template v-for="citem in item.children">
            <el-carousel-item :key="citem.index"
                              v-show="citem.auto&&getDisplay(citem)">
              <temp v-if="!citem.children"
                    :parent="item"
                    :ref="common.NAME+citem.index"
                    :item="citem"></temp>
              <subgroup v-else
                        :nav="citem.children"></subgroup>
            </el-carousel-item>
          </template>
        </el-carousel>
      </folder>
    </div>
  </div>
</template>

<script>
//注册自定义组件
import components from '@avue/avue-data/components/';
import folder from '@avue/avue-data/page/block/folder'
import temp from '@avue/avue-data/page/block/temp'
import common from '@avue/avue-data/config'
import echartComponents from '@avue/avue-data/echart/'
import Vue from 'vue'
export default {
  name: 'subgroup',
  inject: ["contain", 'container'],
  provide () {
    return {
      contain: this.contain,
      container: this.container
    };
  },
  components: {
    folder,
    temp
  },
  props: {
    nav: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      common: common,
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let list = { ...echartComponents, ...components }
      Object.keys(list).map(ele => {
        let component = list[ele];
        Vue.component(ele, component);
      });
    },
    //刷新数据
    handleRefresh () {
      let result = this.getItemRef()
      if (result) {
        return result.updateData()
      }
      return Promise.resolve()
    },
    getItemRef (index) {
      index = index || this.contain.activeIndex
      let ref = this.$refs[`${this.common.NAME}${index}`] || []
      if (ref[0]) {
        return ref[0].$refs.temp
      } else {
        return {}
      }
    },
    getListRef (index) {
      let ref = this.$refs[`${this.common.DEAFNAME}${index}`] || []
      return ref[0]
    },
    getDisplay (item) {
      return !item.display
    },
    getShow (item) {
      if (!this.container.isBuild && ['time', 'data', 'notice'].includes(item.component.prop)) {
        return false
      }
      return true
    },
    handleMove ({ index, left, top, rotate }) {
      if (this.contain.activeIndex !== index) return
      this.contain.activeList.forEach(item => {
        if (this.contain.activeIndex === item.index) return
        item.left = item.left + left;
        item.top = item.top + top
        item.rotate = rotate
      })
    },
    handleOut () {
      this.contain.activeOverIndex = null;
    },
    handleOver ({ index }) {
      this.contain.activeOverIndex = index;
    },
    handleFocus ({ index }) {
      this.container.gradeFlag = true;
      this.contain.selectNav(index);
      let layerIndex = this.contain.list.findIndex(ele => ele.index === index)
      this.contain.handleMenuScroll(layerIndex * 40)
    },
    handleBlur ({ index, left, top, rotate, width, height, type }) {
      this.container.gradeFlag = false;
      if (index !== this.contain.activeIndex || type === 'folder') return
      this.$set(this.contain.activeObj.component, 'width', width)
      this.$set(this.contain.activeObj.component, 'height', height)
      this.$set(this.contain.activeObj, 'left', left)
      this.$set(this.contain.activeObj, 'top', top)
      this.$set(this.contain.activeObj, 'rotate', rotate)

    },
  }
}
</script>
<style  >
.carousel .el-carousel__container {
  height: 100%;
}
</style>