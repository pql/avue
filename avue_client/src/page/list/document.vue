<template>
  <div class="document">
    <div class="item">
      <p class="avue-tip-title">文档</p>
      <el-button size="small"
                 type="success"
                 @click="goList">功能清单</el-button>
      <el-button size="small"
                 type="success"
                 @click="goDoc1">原理图</el-button>
      <el-button size="small"
                 type="success"
                 @click="goApi">接口文档</el-button>
      <el-button size="small"
                 type="success"
                 @click="goDoc">说明文档</el-button>

    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goApi () {
      window.open('https://api.scada.bladex.cn/doc.html')
    },
    goList () {
      window.open('https://docs.qq.com/sheet/DZkdNWE1NcVhTdndV')
    },
    goDoc () {
      window.open('https://www.yuque.com/smallwei/iot-scada')
    },
    goDoc1 () {
      window.open('https://kdocs.cn/l/cuOoWqq98ljO')
    }
  }
}
</script>

<style lang="scss">
.document {
  height: 100%;
  overflow: auto;
  padding: 0 30px;
  .item {
    margin-bottom: 20px;
  }
  .avue-tip-title {
    font-size: 18px;
    margin-bottom: 5px;
  }
}
</style>