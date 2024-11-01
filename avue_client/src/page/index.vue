<template>
  <el-container class="index">
    <el-aside class="left">
      <logo></logo>
      <navs @change="handleChange"></navs>
      <help></help>
    </el-aside>
    <el-main class="main">
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
import navs from '@avue/avue-data/page/nav'
import logo from '@avue/avue-data/page/logo'
import help from '@avue/avue-data/page/help'
export default {
  name: "index",
  components: {
    navs,
    logo,
    help
  },
  data () {
    return {
      publicPath: process.env.VUE_APP_PATH,
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    handleChange (item, index) {
      this.$router.push({ path: this.$website.routers.mainPath.replace(/\/+$/, '') + item.path })
    }
  }
}
</script>
<style lang="scss">
@import '@avue/avue-data/styles/list.scss';
.index {
  height: 100%;
  & > .left {
    position: relative;
    width: 220px !important;
    height: 100%;
    border-right: 1px solid var(--border-color);
    background: var(--primary-bg-color);
  }
  & > .main {
    padding: 0;
  }
}
</style>