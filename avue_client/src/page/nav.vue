<template>
  <div class="nav-main">
    <div class="nav-item"
         v-for="(item,index) in navs"
         :key="index"
         :class="{'is-active':index===activeIndex}"
         @click="toggleNav(item,index)">
      <i class="nav-icon"
         :class="item.icon"></i>
      <div class="nav-title">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      navs: [{
        icon: 'el-icon-menu',
        name: '组态管理',
        path: '/'
      }, {
        icon: 'el-icon-folder-opened',
        name: '组态分类',
        path: '/category'
      }, {
        icon: 'el-icon-eleme',
        name: '组件库',
        path: '/components'
      }, {
        icon: 'el-icon-message',
        name: '消息渠道',
        path: '/task'
      }, {
        icon: 'el-icon-files',
        name: '静态资源',
        path: '/file'
      }, {
        icon: 'el-icon-thumb',
        name: '在线教程',
        path: '/document'
      }],
      activeIndex: 0,
    }
  },
  mounted () {
    let index = this.navs.findIndex(ele => ele.path === this.$route.path)
    this.activeIndex = index
  },
  methods: {
    toggleNav (nav, index) {
      this.activeIndex = index;
      this.$emit('change', nav, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-main {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
}
.nav-item {
  position: relative;
  height: 40px;
  display: flex;
  flex-shrink: 0;
  margin: 3px 0;
  line-height: 40px;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;
  color: var(--info-color);
  font-size: 14px;
  &:hover {
    color: var(--primary-color);
    background-color: var(--bg-color);
  }
  &.is-active {
    color: var(--primary-color);
    background-color: var(--bg-color);
    font-size: 15px;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 3px;
      height: 50%;
      border-radius: 6px;
      transform: translateY(-50%);
      background-color: var(--primary-color);
    }
  }
}
.nav-icon {
  margin-left: 15px;
  margin-right: 4px;
}
</style>
