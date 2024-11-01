<!-- 组合配置 -->
<template>
  <div>
    <el-form-item label="缩放">
      <avue-slider :min="0.1"
                   :step="0.1"
                   :max="10"
                   v-model="main.activeComponent.scale"></avue-slider>
    </el-form-item>
    <el-form-item label="其他组态">
      <avue-switch v-model="main.activeOption.remote"></avue-switch>
    </el-form-item>
    <el-form-item label="组态ID"
                  v-if="main.activeOption.remote">
      <el-input v-model="main.activeOption.id"
                placeholder="请输入组态ID">
      </el-input>
    </el-form-item>
    <el-form-item label="组态分组ID"
                  v-if="main.activeOption.remote">
      <el-input v-model="main.activeOption.group"
                placeholder="请输入组态分组ID">
      </el-input>
    </el-form-item>
    <template v-if="!main.activeOption.remote">
      <el-form-item label="配置">
        <el-button size="small"
                   type="primary"
                   @click="openCode">编辑</el-button>
        <el-button type="primary"
                   size="small"
                   @click="api.box=true"
                   icon="el-icon-search"></el-button>
      </el-form-item>
      <el-form-item label-width="0">
        <avue-highlight :height="500"
                        v-model="main.activeOption.content"></avue-highlight>
      </el-form-item>
    </template>
    <codeedit @submit="codeClose"
              title="组件代码"
              :rules="false"
              v-model="code.obj"
              v-if="code.box"
              :type="code.type"
              language="javascript"
              :visible.sync="code.box"></codeedit>
    <el-dialog title="组件库"
               class="avue-dialog"
               :visible.sync="api.box"
               width="70%">
      <component-list v-if="api.box"
                      :activeName="3"
                      @change="handleApiChange"
                      :menu="false"></component-list>
    </el-dialog>

  </div>
</template>

<script>
import codeedit from '../../page/group/code';
import componentList from '@avue/avue-data/page/list/components'
import { getObj } from '@avue/avue-data/api/components'
export default {
  name: 'group',
  inject: ["main"],
  components: {
    codeedit,
    componentList
  },
  data () {
    return {
      loading: false,
      api: {
        box: false,
        item: {}
      },
      code: {
        type: 'content',
        box: false,
        obj: {},
      }
    }
  },
  methods: {
    handleApiChange (val) {
      this.api.item = val
      getObj(this.api.item.id).then(res => {
        const data = res.data.data;
        this.main.activeOption[this.code.type] = data.content
        this.api.box = false;
        this.api.item = {}
        this.$message.success('导入成功')
      })
    },
    codeClose (value) {
      this.main.activeOption[this.code.type] = value;
    },
    openCode () {
      this.code.obj = this.main.activeOption[this.code.type];
      this.code.box = true;
    },
  }
}
</script>

<style>
</style>