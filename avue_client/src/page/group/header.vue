<template>
  <div class="head">
    <div class="head_actions head_left">
      <span>
        <span class="logo">{{$website.title }}</span>

      </span>
    </div>
    <div class="head_info">
      <span> {{contain.visual.title}}</span>
    </div>
    <div class="head_actions">
      <div class="head_btn"
           @click="contain.$refs.excel.handleOpen()">
        <el-tooltip effect="dark"
                    content="excel解析"
                    placement="top">
          <svg-icon icon-class="excel" />
        </el-tooltip>
      </div>

      <div class="head_btn"
           @click="switchTheme">
        <el-tooltip effect="dark"
                    content="切换主题"
                    placement="top">
          <i class="iconfont icon-theme"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleBuild">
        <el-tooltip effect="dark"
                    content="保存"
                    placement="top">
          <i class="iconfont icon-save"></i>
        </el-tooltip>
      </div>

      <div class="head_btn"
           @click="handleClear">
        <el-tooltip effect="dark"
                    content="清空画布"
                    placement="top">
          <i class="el-icon-delete"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleKeys">
        <el-tooltip effect="dark"
                    content="快捷键"
                    placement="top">
          <i class="iconfont icon-ele"></i>
        </el-tooltip>
      </div>

      <div class="head_btn"
           @click="handleImg">
        <el-tooltip effect="dark"
                    content="导出图片"
                    placement="top">
          <i class="el-icon-camera"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleView"
           v-show="contain.menuFlag">
        <el-tooltip effect="dark"
                    content="预览"
                    placement="top">
          <i class="iconfont icon-view"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleReset"
           v-show="!contain.menuFlag">
        <el-tooltip effect="dark"
                    content="还原"
                    placement="top">
          <i class="iconfont icon-reset"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="$refs.result.show=true">
        <el-tooltip effect="dark"
                    content="导入导出"
                    placement="top">
          <i class="el-icon-download"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleShare">
        <el-tooltip effect="dark"
                    content="发布"
                    placement="top">
          <i class="el-icon-share"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           :disabled='!contain.canUndo'
           @click="contain.editorUndo">
        <el-tooltip effect="dark"
                    content="后退"
                    placement="top">
          <i class="nav__icon el-icon-arrow-left"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           :disabled='!contain.canRedo'
           @click="contain.editorRedo">
        <el-tooltip effect="dark"
                    content="前进"
                    placement="top">
          <i class="nav__icon el-icon-arrow-right"></i>
        </el-tooltip>
      </div>
      <div class="head_btn"
           @click="handleGoIndex">
        <el-tooltip effect="dark"
                    content="主页"
                    placement="top">
          <i class="el-icon-s-home"></i>
        </el-tooltip>
      </div>
    </div>
    <result ref="result"></result>
    <share ref="share"></share>
    <keys ref="keys"></keys>
  </div>
</template>

<script>
import { dataURLtoFile } from '@avue/avue-data/utils/utils'
import result from '@avue/avue-data/page/group/result';
import { uploadImg, updateComponent } from '@avue/avue-data/api/visual'
import share from '@avue/avue-data/page/group/share'
import keys from '@avue/avue-data/page/group/keys'
import { switchTheme } from '@avue/avue-data/utils/utils';
import { themeObj } from '@avue/avue-data/option/config'
export default {
  inject: ["contain"],
  provide () {
    return {
      contain: this.contain
    };
  },
  data () {
    return {
      minWidth: 0,
      maxWidth: 0
    }
  },
  components: {
    result,
    share,
    keys
  },
  created () {
    this.contain.palette = themeObj[localStorage.getItem('theme')].palette
    if (this.$website.autoSave) {
      setInterval(() => {
        this.handleBuild(undefined, false, false);
      }, this.$website.autoSaveTime)
    }

  },
  methods: {
    switchTheme () {
      const theme = switchTheme(undefined, this)
      this.contain.palette = themeObj[theme].palette
      this.contain.sketchReload = Math.random()
    },
    handleGoIndex () {
      this.$router.push({ path: this.$website.routers.mainPath })
    },
    handleClear () {
      this.$confirm('此操作将清空画布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.contain.nav = []
        this.$message.success('画布清空成功')
      })
    },
    handleKeys () {
      this.$refs.keys.show = true;
    },
    handleReset () {
      this.contain.menuFlag = true;
      this.handleSet()
    },
    handleView () {
      this.contain.menuFlag = false;
      this.handleSet()
    },
    handleSet (select) {
      this.contain.handleResetView(select)
    },
    handleBuild (fn, tip, first = false) {
      let isFun = typeof (fn) === 'function'
      if (!isFun && this.$route.params.id <= 100 && this.$website.isDemo) {
        this.$message.error(this.$website.isDemoTip)
        return
      }
      if (first) this.contain.handleInitActive();
      let loading
      if (tip !== false) {
        loading = this.$loading({
          lock: true,
          text: '正在保存配置，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      const save = (url) => {
        const formdata = {
          visual: {
            id: this.contain.visual.id,
            backgroundUrl: url || this.contain.backgroundUrl
          },
          config: {
            id: this.contain.obj.config.id,
            visualId: this.contain.visual.id,
            detail: JSON.stringify(this.contain.config),
            component: JSON.stringify(this.contain.nav),
          },
        }
        updateComponent(formdata).then(() => {
          loading && loading.close();
          if (isFun) {
            fn()
          } else if (tip !== false) {
            this.$message.success('组态配置保存成功');
          }
        }).catch(err => {
          this.$message.error('组态配置保存失败，请检查服务端配置')
          loading && loading.close();
        })
      }
      this.$nextTick(() => {
        this.exportImg().then(canvas => {
          if (canvas) {
            var file = dataURLtoFile(canvas.toDataURL('image/jpeg', 0.1), this.contain.visual.title + '.jpg');
            var formdata = new FormData();
            formdata.append('file', file)
            uploadImg(formdata).then(res => {
              const data = res.data.data;
              const url = data.link;
              save(url)
            })
          } else {
            save()
          }
        }).catch(err => {
          save()
          console.log(err);
          loading && loading.close();
        })
      })
    },
    handleFlag (name) {
      this.contain[name] = !this.contain[name]
      this.handleSet()
    },
    exportImg () {
      return new Promise((resolve, reject) => {
        html2canvas(document.querySelector('.canvas'), {
          useCORS: true,
          backgroundColor: null,
          logging: false,
          allowTaint: true
        }).then(canvas => {
          resolve(canvas)
        }).catch(err => {
          reject(error)
        })
      })
    },
    handleImg () {
      this.$confirm('是否导出组态图片？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.exportImg().then(canvas => {
          this.downFile(canvas.toDataURL("image/jpeg", 0.8), this.contain.visual.title + '.jpg');
          this.$message.success('图片导出成功')
        }).catch(() => {
          this.$message.error('图片导出失败')
        });
      })
    },
    handleShare () {
      this.$refs.share.handleShow()
    }
  }
}
</script>

<style lang="scss">
.head {
  position: relative;
  height: 41px;
  padding-right: 8px;
  display: flex;
  z-index: 100;
  align-items: center;
  user-select: none;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  &_actions {
    position: absolute;
    top: 0;
    right: 8px;
    width: 300px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
  }
  &_left {
    left: 8px;
    justify-content: flex-start;
    font-size: 12px;
    max-width: 500px;
    font-weight: bold;
    line-height: 40px;
    display: flex;
  }
  &_btn {
    margin-left: 4px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    width: 40px;
    height: 24px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
    i {
      color: var(--info-color);
      &:hover {
        color: var(--text-color);
      }
    }
    &--active {
      i {
        color: var(--primary-color);
      }
      border-color: var(--primary-color);
    }
  }
  &_info {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    text-align: center;
    cursor: default;
    font-size: 14px;
    max-width: 500px;
    font-weight: bold;
    color: var(--text-color);
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    i {
      margin-right: 8px;
      font-size: 20px;
    }
  }
}
</style>