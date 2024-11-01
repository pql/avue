<template>
  <div class="help">
    <p @click="goList">功能清单</p>
    <p @click="box=true"
       style="color:#F56C6C">点击购买</p>
    <el-dialog title="扫码联系客服咨询"
               append-to-body
               :before-close="handleClose"
               :close-on-click-modal="false"
               :visible.sync="box"
               class="avue-dialog"
               width="350px">
      <img style="width:100%"
           src="https://avuejs.com/images/wechat.jpg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      box: false
    }
  },
  methods: {
    goList () {
      window.open('https://docs.qq.com/sheet/DZkdNWE1NcVhTdndV')
    },
    goPay () {
      window.open('https://avuejs.com/views/vip.html')
    }
  }
}
</script>

<style lang="scss">
.help {
  width: 100%;
  position: absolute;
  bottom: 2px;
  p {
    cursor: pointer;
    margin: 5px auto;
    font-weight: bold;
    line-height: 1;
    font-family: inherit;
    box-sizing: border-box;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 13px;
    border-radius: 4px;
    color: var(--text-color);
    background-color: var(--primary-bg-color);
    border: 1px solid var(--border-color);
    width: 96%;
    white-space: nowrap;
    outline: none;
    position: relative;
    z-index: auto;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    text-align: center;
    text-decoration: none;
  }
}
</style>