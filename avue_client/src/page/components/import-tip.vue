<template>
  <el-dialog title="导入组态"
             width="30%"
             class="avue-dialog"
             :close-on-click-modal="false"
             :visible.sync="box">
    <center v-loading="loading"
            v-bind="$loadingParams">
      <el-upload drag
                 v-if="box"
                 action="#"
                 :show-file-list="false"
                 :auto-upload="false"
                 :on-change="uploadFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </center>
  </el-dialog>
</template>

<script>
import { addObj } from '@avue/avue-data/api/visual';

export default {
  props: {
    category: String
  },
  data () {
    return {
      loading: false,
      box: false
    }
  },
  methods: {
    uploadFile (file) {
      this.loading = true
      const reader = new FileReader();
      // 异步处理文件数据
      reader.readAsText(file.raw, "UTF-8");
      // 处理完成后立马触发 onload
      reader.onload = (fileReader) => {
        const fileData = fileReader.target.result;
        let result = JSON.parse(fileData) || {};
        let detail = result.detail;
        let component = result.component;
        if (!result.detail) {
          this.$message.elDialog.error('导入文件格式错误')
          return
        }
        let data = {
          category: this.category,
          title: detail.name,
          name: detail.name,
          width: detail.width,
          height: detail.height,
          component: JSON.stringify(component),
        }
        addObj(data).then(res => {
          this.loading = false
          const data = res.data.data;
          let id = data.id;
          this.$message.success('导入成功')
          this.box = false
          setTimeout(() => {
            let routeUrl = this.$router.resolve({
              path: '/build/' + id
            })
            window.open(routeUrl.href, '_blank');
          }, 300)
        }).catch(() => {
          this.loading = false
        })
      };
    },
  }
}
</script>
