<template>
  <el-dialog append-to-body
             class="avue-dialog"
             title="智能解析excl"
             @close="handleClose"
             :close-on-click-modal="false"
             :visible.sync="show"
             width="60%">
    <div class="excel">
      <el-steps :active="active"
                align-center
                finish-status="success">
        <el-step title="上传excel"
                 description="上传小于10M的excel文件"></el-step>
        <el-step title="解析excel"
                 description="确认上传的解析数据"></el-step>
        <el-step title="选择图表"
                 description="选择转化的图表和字段"></el-step>
      </el-steps>
      <div v-if="active==0"
           class="excel__upload">
        <el-upload :on-change="handleChange"
                   :auto-upload="false"
                   :show-file-list="false"
                   drag>
          <div>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </div>
          <div slot="tip"
               class="el-upload__tip"><a href="/temp.xlsx"><em>点击下载测试文件</em></a></div>
        </el-upload>
      </div>
      <template v-else-if="active==1">
        <avue-crud :option="option"
                   :data="data"></avue-crud>
      </template>
      <div class="excel__result"
           v-else-if="active==2">
        <div class="excel__left">
          <div class="excel__box">
            <div class="excel__title">点击选择分类</div>
            <div class="excel__list">
              <el-button :type="isActive(item)?'info':'primary'"
                         size="mini"
                         @click="handleAppend(item,1)"
                         v-for="(item,index) in list1"
                         :key="index">{{ item }}</el-button>
            </div>
          </div>
          <div class="excel__box">
            <div class="excel__title">点击选择数值</div>
            <div class="excel__list">
              <el-button :type="isActive(item)?'info':'success'"
                         size="mini"
                         @click="handleAppend(item,2)"
                         v-for="(item,index) in list2"
                         :key="index">{{ item }}</el-button>
            </div>
          </div>
          <div class="excel__box">
            <div class="excel__title">选中字段</div>
            <div class="excel__list">
              <el-button :type="item.type==1?'primary':'success'"
                         size="mini"
                         v-for="(item,index) in list"
                         :key="index">
                {{ item.name }}
                <i class="el-icon-close"
                   @click="handleDel(index)"></i>
              </el-button>
            </div>
          </div>
        </div>
        <div class="excel__right">
          <el-tabs class="menu__tabs"
                   stretch
                   v-model="tabsActive">
            <el-tab-pane :name="index"
                         :key="index"
                         v-for="(item,index) in tabs">
              <span slot="label">{{ item.label }}</span>
            </el-tab-pane>
          </el-tabs>
          <component :is="componentName"
                     :data="result"
                     v-if="isFinish"
                     width="400"
                     :option="echartOption"
                     height="230"></component>
        </div>
      </div>
    </div>
    <span class="avue-dialog__footer avue-dialog__footer--center"
          v-if="active!=0">
      <el-button size="small"
                 v-if="[1,2].includes(active)"
                 @click="handleBreak()"
                 type="info">上一步</el-button>
      <el-button size="small"
                 v-if="active==1"
                 @click="handleNext()"
                 type="primary">下一步</el-button>
      <el-button size="small"
                 v-else-if="active==2"
                 @click="handleFinish()"
                 type="success"> 完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { website } from '@avue/avue-data/config.js'
export default {
  inject: ["contain"],
  data () {
    return {
      active: 0,
      show: false,
      option: {
        size: 'mini',
        index: true,
        menu: false,
        header: false,
        column: []
      },
      first: {},
      data: [],
      list: [],
      selectList1: [],
      selectList2: [],
      list1: [],
      list2: [],
      tabsActive: 0,
      tabs: [{
        label: '柱状图'
      }, {
        label: '折线图'
      }, {
        label: '饼图'
      }, {
        label: '表格'
      }]
    }
  },
  computed: {
    isFinish () {
      return this.selectList1.length > 0 && this.selectList2.length > 0
    },
    componentName () {
      let result = {
        0: 'bar',
        1: 'line',
        2: 'pie',
        3: 'table'
      }
      return 'avue-echart-' + result[this.tabsActive]
    },
    echartOption () {
      let result = {
        headerBackground: "#050e18",
        headerColor: "#69bfe7",
        headerTextAlign: "center",
        nthColor: "#09192c",
        bodyBackground: "rgba(0, 0, 0, 0.01)",
        bodyColor: "#69bfe7",
        fontSize: 12,
        index: true,
        othColor: "#142a40",
        headerFontSize: 12,
        bodyFontSize: 12,
        legend: true,
        labelShow: true,
        column: []
      };
      this.list.forEach(item => {
        result.column.push({
          label: item.name,
          prop: item.name
        })
      })
      return result;
    },
    result () {
      let result;

      if (this.tabsActive == 0 || this.tabsActive == 1) {
        let first = this.selectList1[this.selectList1.length - 1];
        result = {
          categories: [],
          series: []
        };

        let categories = this.data.map(ele => ele[first])

        let uniqueArray = [...new Set(categories)];
        result.categories = uniqueArray

        this.selectList2.forEach(column => {
          let obj = {
            name: column,
            data: []
          };
          uniqueArray.forEach(ele => {
            let all = this.data.filter(item => item[first] == ele).map(item => item[column]).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
            obj.data.push(all)
          })
          result.series.push(obj)
        });
      } else if (this.tabsActive == 2) {
        result = []
        this.selectList2.forEach(item => {
          let all = 0
          this.data.forEach(ele => {
            all = all + Number(ele[item])
          })
          result.push({
            name: item,
            value: all
          })
        })
      } else {
        result = this.data;
      }
      return result;
    }
  },
  methods: {
    handleOpen () {
      this.show = true
    },
    handleChange (file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          let list = data.results || []
          this.option.column = []
          this.data = []
          this.data = list
          this.first = list[0] || {}
          Object.keys(this.first).forEach(key => {
            this.option.column.push({
              label: key,
              prop: key
            })
          })

          this.active = this.active + 1;
        })

    },
    handleClose () {
      this.active = 0
      this.tabsActive = 0
    },
    handleFinish () {
      let result;
      let list = {
        0: [0, 2],
        1: [0, 3],
        2: [0, 4],
        3: [4, 0]
      }
      let obj = list[this.tabsActive]
      result = website.baseList[obj[0]].children[obj[1]].option
      result.data = this.result;
      this.contain.$refs.top.handleAdd(result);
      this.show = false;
      this.active = 0;
    },
    isActive (item) {
      let index = this.list.findIndex(ele => ele.name == item)
      return index != -1
    },
    handleDel (index) {
      this.list.splice(index, 1)
    },
    handleAppend (item, type) {
      let index = this.list.findIndex(ele => ele.name == item)
      let key = 'selectList';
      if (index != -1) {
        this.list.splice(index, 1)
        index = this[key + type].findIndex(ele => ele == item)
        this[key + type].splice(index, 1)
      } else {
        this[key + type].push(item)
        this.list.push({
          name: item,
          type,
        })
      }
    },
    handleBreak () {
      this.active = this.active - 1;
    },
    handleNext () {
      this.list = []
      this.list1 = []
      this.list2 = []
      Object.keys(this.first).forEach(key => {
        if (isNaN(Number(this.first[key]))) {
          this.list1.push(key)
        } else {
          this.list2.push(key)
        }
      })
      this.active = this.active + 1;
    }
  }
}
</script>

<style lang="scss">
.excel {
  .el-step__title.is-process,
  .el-step__description.is-process {
    color: #409eff;
  }
  &__upload {
    padding-top: 50px;
    display: flex;
    justify-content: center;
  }
  &__box {
    padding: 10px;
    box-sizing: border-box;
    border: 1px dashed #999;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  &__title {
    margin-bottom: 20px;
    font-size: 12px;
    color: var(--text-color);
    font-weight: bold;
  }
  &__list {
    .el-button {
      margin: 0 5px 8px 0;
    }
  }
  &__result {
    display: flex;
  }
  &__left,
  &__right {
    margin: 8px;
  }
  &__left {
    flex: 1;
  }
  &__right {
    width: 400px;
  }
}
</style>