<template>
  <div :style="{height:height}">
    <el-container class="list iot-file">
      <el-aside>
        <div class="tree-menu">
          <avue-tree ref="tree"
                     :data="treeData"
                     @node-click="nodeClick"></avue-tree>
        </div>
      </el-aside>
      <el-container>
        <el-main class="content">
          <div class="content__box">
            <el-pagination background
                           small
                           layout="prev, pager, next"
                           :pager-count="4"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.currentPage"
                           :page-size="page.pageSize"
                           :total="page.total"></el-pagination>
            <template v-if="pagedData.length > 0">
              <div class="content__item"
                   @mouseenter="item._menu = true"
                   @mouseleave="item._menu = false"
                   @click="select(item, index)"
                   v-for="(item, index) in pagedData"
                   :key="index">
                <div class="content__main">
                  <div class="content__logo">
                    <img style="width:40px;height:40px;"
                         :src="`${isImage(item.value) ? item.value : $router.options.base + 'img/files.png'}`"
                         alt="" />
                  </div>
                </div>
              </div>
            </template>
            <el-empty v-else
                      class="content__empty"
                      description="暂无数据">
              <template #image>
                <svg-icon icon-class="empty" />
              </template>
            </el-empty>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import scadaList from '@avue/avue-data/iot/scada'

export default {
  data () {
    return {
      height: null,
      data: [],
      pagedData: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      treeData: scadaList()
    }
  },
  mounted () {
    this.height = window.innerHeight - 170 + 'px'
    this.nodeClick(this.treeData[0])
    this.$nextTick(() => this.$refs.tree.setCurrentKey('按钮'))
  },
  methods: {
    nodeClick (data) {
      this.data = data.list
      this.page.total = this.data.length
      this.updatePagedData()
      this.page.currentPage = 1;
    },
    select (item) {
      this.$emit('submit', { assetsUrl: item.value })
    },
    openImg (item) {
      this.$ImagePreview([{
        url: item.value
      }], 0, {})
    },
    isImage (filename) {
      const imageExtensions = /\.(jpg|jpeg|png|gif)$/i
      return imageExtensions.test(filename)
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.updatePagedData()
    },
    handleCurrentChange (page) {
      this.page.currentPage = page
      this.updatePagedData()
    },
    updatePagedData () {
      const start = (this.page.currentPage - 1) * this.page.pageSize
      const end = this.page.currentPage * this.page.pageSize
      this.pagedData = this.data.slice(start, end)
    }
  }
}
</script>

<style lang="scss">
.iot-file {
  height: 100%;
  .el-aside {
    height: 100%;
  }
  .el-aside {
    width: 90px !important;
    .el-tree-node__expand-icon {
      display: none;
    }
    .el-tree-node__label {
      padding-left: 15px;
      font-size: 12px;
    }
  }
  .el-pagination {
    margin: 5px 0 10px 0;
    text-align: center;
  }
  .el-header {
    padding: 0 !important;
    text-align: center;
  }
  .content {
    &__item {
      margin-right: 0;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
    &__logo {
      margin-right: 10px;
      img {
        object-fit: cover;
      }
    }
    &__main {
      flex: 1;
      justify-content: flex-start;
    }
    &__menu {
      width: 130px;
      margin-right: 10px;
      position: relative;
      height: inherit;
      right: 0;
      display: inline-block;
    }
    &__name {
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__size {
      min-width: 80px;
      margin-right: 100px;
    }
    &__type {
      min-width: 80px;
      margin-right: 80px;
    }
    &__time {
      min-width: 160px;
    }
  }
}
</style>
