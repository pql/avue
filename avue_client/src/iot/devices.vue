<template>
  <el-dialog title="选择设备"
             class="avue-dialog"
             :visible.sync="box"
             width="70%">
    <avue-crud ref="crud"
               :option="option"
               v-model="form"
               v-if="box"
               :page.sync="page"
               v-loading="loading"
               v-bind="$loadingParams"
               @search-change="searchChange"
               @current-row-change="handleCurrentRowChange"
               :data="data"
               :search.sync="search"
               @on-load="onLoad">
    </avue-crud>
    <span class="avue-dialog__footer avue-dialog__footer--center">
      <el-button size="small"
                 type="primary"
                 icon="el-icon-check"
                 @click="handleSubmit">确认</el-button>
      <el-button type="danger"
                 @click="box=false"
                 icon="el-icon-position"
                 size="small">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeviceList } from '@avue/avue-data/api/iot'
export default {
  props: {
    productKey: String
  },
  data () {
    return {
      row: {},
      box: false,
      search: {},
      form: {},
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      data: [],
      option: {
        highlightCurrentRow: true,
        dialogWidth: '600',
        height: 'auto',
        calcHeight: 330,
        header: false,
        index: true,
        align: 'center',
        headerAlign: 'center',
        menu: false,
        column: [
          {
            label: '名称',
            prop: 'deviceNoteName',
          }, {
            label: '设备名称',
            prop: 'deviceName',
            search: true
          },
          {
            label: '密钥',
            prop: 'deviceSecret',
            overHidden: true
          },
          {
            label: '状态',
            prop: 'deviceStatus',
            type: 'select',
            dicData: [
              {
                label: '未激活',
                value: 0
              }, {
                label: '在线',
                value: 1
              }, {
                label: '离线',
                value: 2
              }, {
                label: '禁用',
                value: 3
              }
            ],
            search: true,
            span: 24
          }, {
            label: '时间',
            prop: 'createTime'
          }
        ]
      }
    }
  },
  methods: {
    handleCurrentRowChange (val) {
      this.row = val

    },
    handleSubmit () {
      this.box = false
      this.$emit('select-change', this.row)
    },
    searchChange (form, done) {
      this.onLoad()
      done()
    },
    onLoad () {
      this.loading = true
      getDeviceList({
        deviceName: this.search.deviceName,
        deviceStatus: this.search.deviceStatus,
        productKey: this.productKey,
        current: this.page.currentPage,
        size: this.page.pageSize,
      }).then(res => {
        this.loading = false
        const data = res.data.data;
        let records = data.records
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
        width: 40px !important;
        height: 40px !important;
      }
    }
    &__main {
      flex: 1;
      justify-content: flex-start;
    }
    &__menu {
      width: 130px !important;
      margin-right: 10px;
      position: relative;
      width: 100px;
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
      width: 200px;
      margin-right: 100px;
    }
    &__type {
      width: 200px;
      margin-right: 100px;
    }
    &__time {
      width: 200px;
    }
  }
}
</style>