<template>
  <div class="top-nav">
    <el-menu class="nav"
             mode="horizontal"
             text-color="#fff"
             active-text-color="#2681ff"
             @mousedown="contain.handleInitActive">
      <el-submenu :index="index+''"
                  v-for="(item,index) in baseList"
                  :key="index">
        <template slot="title">
          <el-tooltip effect="dark"
                      :content="item.label"
                      placement="top">
            <i :class="'nav__icon iconfont '+item.icon"></i>
          </el-tooltip>
        </template>
        <div style="width:390px">
          <el-menu-item v-for="(citem,cindex) in item.children"
                        @click="handleAdd(citem.option,true)"
                        :key="cindex"
                        class="menu-inline"
                        :index="`${index}-${cindex}`">
            <div class="usehove"
                 @dragend="dragend($event,citem.option)"
                 draggable="true">
              <img :src="`${$router.options.base}${citem.option.img}`"
                   class="inside-img">
              <div class="bottom-text">{{citem.label}}</div>
            </div>
          </el-menu-item>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { uuid } from '@avue/avue-data/utils/utils'
import { website } from '@avue/avue-data/config.js'
export default {
  inject: ["contain"],
  provide () {
    return {
      contain: this.contain
    };
  },
  data () {
    return {
      baseList: website.baseList
    }
  },
  created () {
    this.$axios.get('/components.json').then(res => {
      console.log(res.data)
      let len = this.baseList.length;
      let children = this.baseList[len - 1].children
      this.baseList[len - 1].children = children.concat(res.data)
    })
  },
  methods: {
    dragend (e, option) {
      let parentRect = document.getElementById('container').getBoundingClientRect();
      let x = e.clientX - parentRect.left;
      let y = e.clientY - parentRect.top;
      this.handleAdd(option, true, x, y)
    },
    handleAdd (option, first = false, x, y) {
      let obj = this.deepClone(option);
      let index = uuid()
      obj.left = x || 0;
      obj.top = y || 0
      obj.index = index;
      obj.display = false;
      obj.lock = false;
      obj.group = this.contain.group
      obj.iot = {};
      obj.state = obj.state || '';
      obj.stateList = obj.stateList || [];
      obj.child = {
        index: [],
        paramList: []
      }
      obj.transfer = {
        index: [],
        paramList: []
      }
      obj.dataBind = obj.dataBind || [];
      if (first) {
        this.contain.nav.unshift(obj);
      } else {
        this.contain.nav.push(obj);
      }
      setTimeout(() => this.contain.selectNav(index))
    }
  }
}
</script>

<style lang='scss'>
.top-nav {
  .nav {
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    background-color: var(--primary-bg-color);
    border: none;
    border-bottom: 1px solid var(--border-color) !important;
  }
  .nav__icon {
    margin-right: 5px;
  }
  .nav .el-submenu .el-submenu__title,
  .nav .el-menu-item {
    height: 45px;
    line-height: 45px;
    font-size: 12px;
  }

  .el-menu-item {
    height: 100px !important;
  }
}
.el-menu--horizontal {
  .menu-inline {
    text-align: center;
    display: inline-block !important;
  }
  .bottom-text {
    color: #b1b1b1;
  }
  .inside-img {
    width: 110px;
    height: 70px;
    border: 2px solid transparent;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .inside-img:hover {
    border-color: #006eff;
  }
  .usehove:hover {
    .bottom-text {
      color: var(--text-color);
      font-weight: bold;
    }
  }
}
</style>