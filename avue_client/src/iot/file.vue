<template>
  <div class="iot-file">
    <el-tabs class="menu__tabs"
             stretch
             v-model="dataTabs">
      <el-tab-pane label="本地"
                   name="0">
        <img-list @submit="handleSubmit"></img-list>
      </el-tab-pane>

      <el-tab-pane label="云端"
                   name="1">
        <file :menu="false"
              @submit="handleSubmit"
              :aside="false"></file>
      </el-tab-pane>
    </el-tabs>

  </div>

</template>

<script>
import file from '@avue/avue-data/page/list/file.vue';
import imgList from '@avue/avue-data/iot/img.vue';
export default {
  inject: ["contain"],
  data () {
    return {
      dataTabs: 0
    }
  },
  created () {
    console.log(this.data)
  },
  components: {
    imgList,
    file
  },
  methods: {
    handleSubmit (item) {
      this.contain.$refs.top.handleAdd({
        title: "组态",
        name: "组态",
        icon: 'icon-zutai',
        img: 'img/assets/img.png',
        top: 0,
        left: 0,
        dataType: 8,
        dataBind: [
          {
            label: "值",
            value: "value",
            type: "any",
            parent: "dataChart",
            system: true
          },
          {
            label: "状态",
            value: "state",
            type: "int",
            system: true
          }
        ],
        state: "0",
        stateList: [
          {
            name: "初始化",
            state: "0",
            value: item.assetsUrl
          }
        ],
        data: {
          value: item.assetsUrl
        },
        dataFormatter: "",
        dataHeader: "",
        dataQuery: "",
        stylesFormatter: "",
        component: {
          width: 120,
          height: 120,
          name: 'img',
          prop: 'img',
        },
        option: {
          isIot: true
        }
      })
    }
  }
}
</script>

<style lang="scss">
.iot-file {
  height: 100%;
  .avue-tree__filter {
    display: none;
  }
  .tree-menu {
    padding: 5px 2px;
  }
  .el-main {
    padding: 8px 3px;
  }
  .list-search {
    display: none;
  }
  .content {
    &__name,
    &__size,
    &__type,
    &__time,
    &__btn,
    &__add,
    &__menu {
      display: none !important;
    }
    &__main {
      padding: 5px 5px !important;
    }
    &__item {
      width: 48% !important;
      margin: 0 1%;
      margin-right: 0 !important;
      display: inline-block !important;
    }
    &__logo {
      margin: 0 auto !important;
      img {
        width: 60px !important;
        height: 60px !important;
        margin: 0 auto;
      }
    }
  }
}
</style>