<template>
  <draggable ghost-class="ghost"
             class="menu__ul"
             :class="{'menu__ul--simple':type==1}"
             :group="{ name: 'layer' }"
             :list="nav"
             :animation="300">
    <template v-for="item in nav">
      <div :key="item.index"
           v-show="validGroup(item)"
           class="menu__folder"
           :ref="common.NAME+item.index"
           @click.stop="handleSetActive(item,false)"
           @mouseenter.stop="mouseOver(item)"
           @mouseleave.stop="mouseOut(item)"
           v-if="item.children">
        <div v-contextmenu="{id:contain.menuId,event:contain.handleContextMenu,value:item}"
             :class="['menu__item--folder',{'is-active':handleGetActive(item),'is-over': contain.activeOverIndex===item.index}]">
          <i class="iconfont icon-fold"
             @click.stop="openFolder(item)"
             :class="{'is-active':item.menu}"></i>
          <i class="iconfont icon-folder"
             @click.stop="handleSetActive(item)"></i>
          <span class="menu__label"
                v-if="item.isname">
            <input type="text"
                   @keyup.enter="item.isname=false"
                   v-model="item.name">
          </span>
          <span v-else
                @dblclick="handleChangeName(item)"
                class="menu__name">{{item.name}}</span>
          <span class="menu__menu">
            <i class="el-icon-video-play"
               :class="{'is-active':item.auto==true}"
               @click.stop="contain.handleParams('auto',item)"></i>
            <i class="iconfont icon-buxianshi"
               :class="{'is-active':item.display==true}"
               @click.stop="contain.handleParams('display',item)"></i>
            <i class="el-icon-lock"
               :class="{'is-active':item.lock===true}"
               @click.stop="contain.handleParams('lock',item)"></i>
          </span>
        </div>
        <div :key="'list'+item.index"
             class="menu__list"
             v-show="item.menu">
          <layer :count="count+1"
                 :type="type"
                 :key="item.index"
                 :nav="item.children"></layer>
        </div>
      </div>
      <div v-else
           v-show="validGroup(item)"
           :key="item.index"
           v-contextmenu="{id:contain.menuId,event:contain.handleContextMenu,value:item}"
           @click.stop="handleSetActive(item)"
           :class="['menu__item',{'is-active':handleGetActive(item),'is-over': contain.activeOverIndex===item.index}]"
           @mouseover.stop="mouseOver(item)"
           @mouseout.stop="mouseOut(item)">
        <span class="menu__icon">
          <i :class="'iconfont '+item.icon"></i>
        </span>
        <span class="menu__label"
              v-if="item.isname">
          <input type="text"
                 @keyup.enter="item.isname=false"
                 v-model="item.name">
        </span>
        <span v-else
              @dblclick="handleChangeName(item)"
              class="menu__label">{{item.name}}</span>
        <span class="menu__menu">
          <i class="iconfont icon-buxianshi"
             :class="{'is-active':item.display==true}"
             @click.stop="contain.handleParams('display',item)"></i>
          <i class="el-icon-lock"
             :class="{'is-active':item.lock===true}"
             @click.stop="contain.handleParams('lock',item)"></i>
        </span>
      </div>
    </template>
  </draggable>
</template>

<script>
import vuedraggable from 'vuedraggable';
import common from '@avue/avue-data/config'
export default {
  name: 'layer',
  inject: ["contain"],
  provide () {
    return {
      contain: this.contain
    };
  },
  components: {
    draggable: vuedraggable
  },
  props: {
    type: {
      type: Number,
      default: 1,
    },
    count: {
      type: Number,
      default: 1,
    },
    nav: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      common
    }
  },
  methods: {
    validGroup (item) {
      if (this.validatenull(item.group)) return true
      return item.group == this.contain.group
    },
    mouseOver (item) {
      this.contain.activeOverIndex = item.index
    },
    mouseOut (item) {
      this.contain.activeOverIndex = undefined
    },
    handleGetActive (item) {
      return this.contain.active.includes(item.index);
    },
    handleSetActive (item, type = true) {
      if (item.children && type) {
        let active = []
        const deepList = (list) => {
          list.forEach(ele => {
            if (ele.children) deepList(ele.children)
            else active.push(ele.index)
          })
        }
        deepList(item.children)
        this.contain.selectNav(active);
      } else {
        this.contain.selectNav(item.index);
      }
    },
    handleChangeName (item) {
      this.$set(item, 'isname', !item.isname)
    },
    openFolder (item) {
      this.$set(item, 'menu', !item.menu)
      item.isname = false;
    },
    handleRefresh () {
      const deepList = (list) => {
        list.forEach(ele => {
          if (ele.children) {
            this.$set(ele, 'menu', false)
            deepList(ele.children)
          }
        })
      }
      deepList(this.nav);
    }
  }
}
</script>

<style>
</style>