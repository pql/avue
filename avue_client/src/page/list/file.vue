<template>
  <el-container class="list file">
    <avue-crud ref="crud"
               style="display:none"
               :option="option"
               v-model="form"
               :page.sync="page"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               v-loading="loading"
               v-bind="$loadingParams"
               :before-open="beforeOpen"
               :data="data"
               @on-load="onLoad">
      <template #fileForm="{}">
        <el-upload :on-change="onChange"
                   :show-file-list="false"
                   :http-request="httpRequest"
                   drag>
          <div v-loading="loading"
               v-bind="$loadingParams">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </div>
        </el-upload>
      </template>
    </avue-crud>
    <el-aside :style="{width:aside?'220px':'80px'}">
      <tree-menu type="assets"
                 :menu="menu"
                 @node-click="handleNodeClick"></tree-menu>
    </el-aside>
    <el-container>
      <el-header class="content__header"
                 v-if="header">
        <div class="content__box content__nav">
          <div class="content__add"
               @click="$refs.crud.rowAdd()">
            <img :src="`${$router.options.base}img/file.png`"
                 height="40px"
                 alt="">
            <div>
              <p>上传文件</p>
              <span>可用字体、组件依赖等静态资源</span>
            </div>
          </div>
          <div class="content__page">

            <div class="list-search">
              <el-input v-model="search.name"
                        size="small"
                        @keyup.enter.native="onLoad"
                        placeholder="请输入名称">
                <i slot="suffix"
                   @click="onLoad"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <el-pagination v-if="page.total>0"
                           layout="total, prev, pager, next"
                           background
                           size="small"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :page-size="page.pageSize"
                           :current-page.sync="page.currentPage"
                           :total="page.total">
            </el-pagination>
          </div>
        </div>
      </el-header>
      <el-main class="content"
               v-loading="loading"
               v-bind="$loadingParams">
        <div class="content__box">
          <template v-if="data.length>0">
            <div class="content__item"
                 @mouseenter="item._menu=true"
                 @mouseleave="item._menu=false"
                 @click="select(item,index)"
                 v-for="(item,index) in data"
                 :key="index">
              <div class="content__main">
                <div class="content__logo"
                     @click.stop="openImg(item)">
                  <img style="width:40px;height:40px;"
                       :src="`${isImage(item.assetsName)?item.assetsUrl:$router.options.base+'img/files.png'}`"
                       alt="">
                </div>
                <span class="content__name">{{item.assetsName}}</span>
                <span class="content__size">{{ item.assetsSize }}</span>
                <span class="content__type">{{ item.assetsType }}</span>
                <span class="content__time">{{ item.assetsTime }}</span>
              </div>

              <div class="content__menu">
                <div class="content__start">
                  <el-tooltip content="复制链接">
                    <div class="content__btn"
                         @click.stop="handleCopy(item,index)">
                      <i class="el-icon-paperclip"></i>
                    </div>
                  </el-tooltip>
                  <div class="content__btn"
                       @click.stop="handleEdit(item,index)">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                  <div class="content__btn"
                       @click.stop="rowDel(item,index)">
                    <i class="el-icon-delete"></i>
                  </div>
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
</template>

<script>
import { getList, getObj, addObj, delObj, updateObj } from '@avue/avue-data/api/file'
import { url } from '@avue/avue-data/config';
import treeMenu from '@avue/avue-data/page/components/tree'
import dayjs from 'dayjs'
import { uploadImg } from '@avue/avue-data/api/visual'
export default {
  props: {
    header: {
      type: Boolean,
      default: true
    },
    aside: {
      type: Boolean,
      default: true
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  components: {
    treeMenu
  },
  data () {
    return {
      treeId: '',
      search: {},
      url,
      loading: false,
      form: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      option: {
        dialogWidth: '600',
        dialogMenuPosition: 'center',
        height: 'auto',
        calcHeight: 330,
        header: false,
        index: true,
        align: 'center',
        headerAlign: 'center',
        column: [
          {
            label: '文件名称',
            prop: 'assetsName',
            addDisplay: false,
            span: 24,
            rules: [{
              required: true,
              message: "请输入文件名称",
              trigger: "blur"
            }]
          },
          {
            label: '文件分类',
            span: 24,
            prop: 'assetsModule',
            type: 'select',
            dicUrl: '/api/category/list?categoryModule=assets&current=1&size=99',
            props: {
              label: 'categoryKey',
              value: 'categoryValue'
            }
          },
          {
            label: '文件上传',
            prop: 'file',
            span: 24,
            editDisplay: false,
          },
          {
            label: '文件类型',
            addDisplay: false,
            prop: 'assetsType',
            span: 24,
            rules: [{
              required: true,
              message: "请输入文件类型",
              trigger: "blur"
            }]
          },
          {
            label: '文件地址',
            addDisplay: false,
            prop: 'assetsUrl',
            span: 24
          },
          {
            label: '文件大小',
            addDisplay: false,
            prop: 'assetsSize',
            disabled: true,
            span: 24
          },
          {
            label: '上传时间',
            addDisplay: false,
            prop: 'assetsTime',
            disabled: true,
            span: 24
          }
        ]
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      this.treeId = data.categoryValue;
      this.onLoad()
    },
    select (item) {
      this.$emit('submit', item.assetsUrl)
    },
    openImg (item) {
      if (this.aside) {
        this.$ImagePreview([{
          url: item.assetsUrl
        }], 0, {});
      } else {
        this.$emit('submit', item)
      }
    },
    isImage (filename) {
      var imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
      return imageExtensions.test(filename);
    },
    onChange (file) {
      this.form.assetsName = file.name;
      this.form.assetsType = file.name.match(/\.(\w+)$/)[1];
      this.form.assetsTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      this.form.assetsSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
    },
    httpRequest (config) {
      this.loading = true;
      var formdata = new FormData();
      formdata.append('file', config.file)
      uploadImg(formdata).then(res => {
        const url = res.data.data.link;
        this.loading = false;
        this.form.assetsUrl = url;
        this.$refs.crud.rowSave();
      })
    },
    vaildData (id) {
      return [0, 1, 2].includes(id)
    },
    beforeOpen (done, type) {
      if (type == 'edit') {
        getObj(this.form.id).then(res => {
          const data = res.data.data;
          this.form = data
          done()
        })
      } else {
        this.form.assetsModule = this.treeId
        done()
      }
    },
    rowDel (row, index) {
      if (this.vaildData(index) && this.$website.isDemo) {
        this.$message.error(this.$website.isDemoTip)
        return false;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$message.success('删除成功');
          this.onLoad()
        })
      }).catch(() => {

      });

    },
    rowUpdate (row, index, done, loading) {
      if (this.vaildData(index) && this.$website.isDemo) {
        done();
        this.$message.error(this.$website.isDemoTip)
        return false;
      }
      updateObj(row).then(() => {
        done();
        this.$message.success('修改成功');
        this.onLoad()
      }).catch(err => {
        loading()
      })
    },
    handleCopy (row, index) {
      this.$Clipboard({
        text: row.assetsUrl
      }).then(() => {
        this.$message.success('链接复制成功')
      })
    },
    handleEdit (row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    rowSave (row, done, loading) {
      addObj(row).then(() => {
        this.$message.success('新增成功');
        this.onLoad()
        done();
      }).catch(err => {
        loading()
      })
    },

    handleCurrentChange (val) {
      this.page.currentPage = val;
      this.onLoad();
    },
    handleSizeChange (val) {
      this.page.pageSize = val;
      this.onLoad();
    },
    onLoad () {
      this.loading = true
      let params = {}
      if (this.treeId) params.assetsModule = this.treeId;
      getList(Object.assign({
        assetsName: this.search.name,
        current: this.page.currentPage,
        size: this.page.pageSize,
      }, params)).then(res => {
        this.loading = false
        const data = res.data.data;
        let records = data.records
        records.forEach(ele => ele._menu = false);
        this.page.total = data.total;
        this.data = records;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.file {
  .content {
    &__info {
      height: auto;
    }
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