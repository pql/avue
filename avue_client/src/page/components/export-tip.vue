<template>
  <el-dialog :title="`【${item.title}】部署`"
             :visible.sync="visible"
             :close-on-click-modal="false"
             class="avue-dialog"
             width="980px">
    <div class="export"
         v-loading="loading"
         v-bind="$loadingParams">
      <div class="item">
        <div class="header">
          第一步：下载部署容器(必须)
        </div>
        <div class="content">
          <div class="box">
            <svg-icon class="icon"
                      icon-class="rq" />
            <div class="title">启动容器（必须）</div>
            <div class="subtitle">需要配置 Nginx 容器开箱即用</div>
            <el-button size="small"
                       type="primary"
                       icon="el-icon-suitcase"
                       @click="handleContent">下载容器</el-button>
          </div>
          <div class="text">
            <div>
              <br />
              <p>下载部署容器。配置 Nginx，参考如下：</p>
              <p v-highlight>
              <pre><code>
            location / {
              root /;
              index index.html;
              try_files $uri $uri/ /index.html;
            }
            </code> </pre>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="header">
          第二步：下载组态配置文件
        </div>
        <div class="content">
          <div class="box">
            <svg-icon class="icon"
                      icon-class="pz" />
            <div class="title">配置文件</div>
            <div class="subtitle">生成前端静态包，读取本地配置文件生成</div>
            <el-button size="small"
                       type="primary"
                       icon="el-icon-download"
                       @click="handleExport">下载组态配置文件</el-button>
          </div>
          <div class="text">
            <p>-【本地加载】下载组态配置文件。将组态配置文件view.js 放入启动容器根目录。</p>
            <p>-【云端加载】无需下载组态配置文件，访问第一步下载的容器中index.html文件,url中带组态参数/index.html?id={{item.id}}</p>
            <p>-【iframe加载】<a :href="url"
                 target="_blank">{{url}}</a></p>
          </div>

        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getObj } from '@avue/avue-data/api/visual'
export default {
  data () {
    return {
      url: '',
      loading: false,
      visible: false,
      item: {}
    }
  },
  methods: {
    handleOpen (item = {}) {
      this.item = item;
      this.visible = true
      this.url = location.origin + '/view.html?id=' + this.item.id
    },
    handleContent () {
      location.href = '/index.zip'
    },
    handleExport () {
      this.loading = true
      getObj(this.item.id).then(res => {
        const data = res.data.data;
        let mode = {
          detail: JSON.parse(data.config.detail),
          component: JSON.parse(data.config.component)
        }
        const blob = new Blob([`//将组态配置文件view.js 放入部署容器根目录 \n let option =${JSON.stringify(mode, null, 4)}`], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, "view.js");
        this.loading = false
        this.$message.success('组态导出成功')
      }).catch(err => {
        console.log(err)
        this.$message.error('组态导出失败')
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss">
.export {
  padding: 0 20px;
  .item {
    margin: 20px 0;
  }
  .header {
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.52);
    font-size: 16px;
    font-weight: bold;
  }

  .content {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .box {
    margin-right: 40px;
    padding: 20px 0;
    width: 380px;
    background-color: var(--primary-bg-color);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
    box-sizing: border-box;
  }
  .icon {
    margin-bottom: 10px;
    width: 50px;
    height: 40px;
  }
  .title {
    margin-bottom: 10px;
    font-size: 16px;
    color: var(--text-color);
    font-weight: bold;
  }
  .subtitle {
    margin-bottom: 40px;
    color: var(--info-color);
  }
  .text {
    flex: 1;
    color: var(--info-color);
    line-height: 25px;
    .hljs {
      background-color: transparent;
    }
  }
}
</style>


