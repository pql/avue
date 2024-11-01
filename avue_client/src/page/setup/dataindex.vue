<template>
  <div class="databind">
    <el-tabs class="menu__tabs"
             stretch
             v-model="tabs">
      <el-tab-pane name="0">
        <span slot="label"><i class="el-icon-setting"></i>配置</span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-document-add"></i>变量</span>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label"><i class="el-icon-s-check"></i>状态</span>
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="120px"
             v-if="tabs==0"
             label-position="left"
             size="small">
      <el-form-item label="数据类型">
        <avue-select v-model="contain.activeObj.dataType"
                     placeholder="请选择数据类型"
                     :dic="dicOption.dataType"></avue-select>
      </el-form-item>
      <template v-if="isStatic">
        <el-form-item label="数据值"
                      label-position="top">
          <el-button size="small"
                     type="primary"
                     icon="el-icon-edit"
                     @click="contain.openCode('data','数据值')">编辑</el-button>
        </el-form-item>
      </template>
      <template v-if="isSql">
        <el-form-item label="数据源选择">
          <avue-select :dic="DIC.sql"
                       v-model="db"></avue-select>
        </el-form-item>
        <el-form-item label="SQL语句"
                      label-position="top">
          <monaco-editor v-model="sql"
                         language="sql"
                         height="100"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="isApi || isNode">
        <el-form-item label="开启跨域"
                      v-if="isApi">
          <avue-switch v-model="contain.activeObj.proxy"
                       @click="contain.handleRefresh"></avue-switch>
        </el-form-item>
        <el-form-item label="请求方式"
                      v-if="isApi">
          <avue-select v-model="contain.activeObj.dataMethod"
                       placeholder="请选择请求方式"
                       :dic="dicOption.dataMethod"></avue-select>
        </el-form-item>
        <el-form-item label="地址">
          <avue-input v-model="contain.activeObj.url"
                      placeholder="请输入地址"></avue-input>
        </el-form-item>
      </template>
      <template v-else-if="isWs">
        <el-form-item label="WS地址">
          <el-input v-model="contain.activeObj.wsUrl">
          </el-input>
        </el-form-item>
      </template>
      <template v-else-if="isRecord">
        <el-form-item label="分类">
          <avue-select :dic="DIC.recordType"
                       placeholder="请选择分类"
                       :props="{label:'categoryKey',value:'categoryValue'}"
                       v-model="contain.activeObj.recordType"></avue-select>
        </el-form-item>
        <el-form-item label="数据集">
          <avue-select :dic="DIC.record"
                       filterable
                       placeholder="请选择数据集"
                       v-model="contain.activeObj.record"></avue-select>
        </el-form-item>
      </template>
      <template v-else-if="isPublic">
        <el-form-item label="公共数据集选择">
          <avue-select :dic="DIC.public"
                       filterable
                       v-model="contain.activeObj.public"></avue-select>
        </el-form-item>
      </template>
      <template v-else-if="isMqtt">
        <el-form-item label="MQTT地址">
          <el-input v-model="contain.activeObj.mqttUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT配置">
          <monaco-editor v-model="contain.activeObj.mqttConfig"
                         height="250"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="isIot">
        <el-form-item label="产品">
          <avue-select v-model="contain.activeObj.iot.projectId"
                       placeholder="请选择产品"
                       :dic="DIC.project"
                       @change="handleProjectChange"
                       allowCreate
                       filterable>
          </avue-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-input placeholder="请输入设备号"
                    v-model="contain.activeObj.iot.deviceId"
                    class="input-with-select">
            <el-button slot="append"
                       @click="handleOpenDevice()"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="认证类型">
          <el-radio-group class="header-menu"
                          v-model="contain.activeObj.iot.type"
                          size="mini">
            <el-radio :label="0">密钥</el-radio>
            <el-radio :label="1">用户密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备密钥"
                      v-if="contain.activeObj.iot.type==0">
          <el-input v-model="contain.activeObj.iot.deviceSecret"
                    placeholder="设备密钥">
          </el-input>
        </el-form-item>
        <template v-if="contain.activeObj.iot.type==1">
          <el-form-item label="用户名">
            <el-input v-model="contain.activeObj.iot.username"
                      placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="contain.activeObj.iot.password"
                      placeholder="密码">
            </el-input>
          </el-form-item>
        </template>
      </template>
      <el-form-item label="刷新时间"
                    v-if="isTime">
        <el-input v-model="contain.activeObj.time"
                  placeholder="0">
          <span slot="append">毫秒</span>
        </el-input>
      </el-form-item>

      <el-form-item label="过滤器">
        <div class="avue-flex">
          <avue-select v-model="contain.activeObj.dataFormatterId"
                       :dic="DIC.filter"
                       :props="{label:'name',value:'id'}"></avue-select>
          <el-button size="small"
                     v-if="!contain.activeObj.dataFormatterId"
                     type="primary"
                     icon="el-icon-edit"
                     @click="contain.openCode('dataFormatter','编辑过滤器')">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label-width="0">
        <el-button size="small"
                   type="primary"
                   class="block"
                   @click="handleSetting">更多设置</el-button>
      </el-form-item>

      <el-form-item label="返回数据"
                    label-width="100">
        <div class="avue-flex"
             style="justify-content: flex-end;">
          <el-button size="small"
                     type="primary"
                     @click="handleRes">请求数据</el-button>
        </div>
      </el-form-item>
      <el-tabs class="menu__tabs"
               style="padding:0 10px;"
               v-model="resTabs">
        <el-tab-pane label="处理后数据"
                     name="0">
          <json-viewer v-loading="dataLoading"
                       v-bind="$loadingParams"
                       :value="dataRes"
                       copyable
                       theme="avue-json-theme"
                       boxed></json-viewer>
        </el-tab-pane>
        <el-tab-pane label="原始数据"
                     name="1">
          <json-viewer v-loading="dataLoading"
                       v-bind="$loadingParams"
                       :value="dataOldRes"
                       copyable
                       theme="avue-json-theme"
                       boxed></json-viewer>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <databind v-else-if="tabs==1"></databind>
    <datastate v-else-if="tabs==2"></datastate>
    <database ref="database"></database>
    <devices ref="devices"
             @select-change="handleDevicesChange"
             :product-key="contain.activeObj.iot.projectId"></devices>
  </div>
</template>

<script>
import { getModel, getProjectList } from '@avue/avue-data/api/iot'
import { getList as getCategoryList } from '@avue/avue-data/api/category'
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import crypto from '@avue/avue-data/utils/crypto'
import database from '@avue/avue-data/page/setup/database'
import datastate from '@avue/avue-data/page/setup/datastate'
import databind from '@avue/avue-data/page/setup/databind'
import devices from '@avue/avue-data/iot/devices'
import { dicOption } from '@avue/avue-data/option/config'
export default {
  inject: ["contain"],
  provide () {
    return {
      contain: this.contain,
      dataParent: this
    };
  },
  components: {
    databind,
    database,
    datastate,
    devices,
    MonacoEditor
  },
  data () {
    return {
      resTabs: 0,
      dataLoading: false,
      dataRes: '',
      dataOldRes: '',
      DIC: {
        filter: [],
        sql: [],
        record: [],
        recordType: [],
        public: [],
        project: []
      },
      iotList: [],
      db: '',
      sql: '',
      dicOption,
      tabs: 0,
    }
  },
  computed: {
    isTime () {
      return !this.isStatic && !this.isPublic && !this.isWs && !this.isMqtt
    },
    isStatic () {
      return this.contain.activeObj.dataType == 0
    },
    isApi () {
      return this.contain.activeObj.dataType == 1
    },
    isSql () {
      return this.contain.activeObj.dataType == 2
    },
    isWs () {
      return this.contain.activeObj.dataType === 3
    },
    isRecord () {
      return this.contain.activeObj.dataType == 4
    },
    isPublic () {
      return this.contain.activeObj.dataType == 5
    },
    isMqtt () {
      return this.contain.activeObj.dataType == 6
    },
    isNode () {
      return this.contain.activeObj.dataType == 7
    },
    isIot () {
      return this.contain.activeObj.dataType == 8
    },
  },
  created () {
    this.initDataList();
    this.handleRes(false);
  },
  methods: {
    handleOpenDevice () {
      if (!this.contain.activeObj.iot.projectId) {
        this.$message.warning('请先选择产品')
        return
      }
      this.$refs.devices.box = true
    },
    handleProjectChange ({ value }) {
      getModel({ productKey: value }).then(res => {
        const data = res.data.data.properties
        this.iotList = data.map(ele => {
          return {
            label: ele.name,
            value: ele.identifier,
            // dataType: ele.dataType,
            system: true,
            iot: true
          }
        })
      })
    },
    handleDevicesChange (item = {}) {
      this.$set(this.contain.activeObj.iot, 'deviceId', item.deviceName)
      this.$set(this.contain.activeObj.iot, 'deviceSecret', item.deviceSecret)
    },
    handleRes (tip = true) {
      this.dataRes = ''
      this.dataOldRes = ''
      if (this.isSql) {
        this.$set(this.contain.activeObj, 'sql', crypto.encrypt(JSON.stringify({
          id: this.db,
          sql: this.sql
        })))
      }
      this.dataLoading = true
      this.contain.handleRefresh().then(({ news, old }) => {
        this.dataLoading = false
        this.dataRes = news
        this.dataOldRes = old
        if (tip) this.$message.success('请求数据成功')
      }).catch(() => {
        this.dataLoading = false
      }).finally(() => {
        this.dataLoading = false
      })
    },
    handleSetting () {
      this.resTabs = '0'
      this.dataRes = '';
      this.dataOldRes = ''
      this.handleRes(false)
      this.$refs.database.box = true;
    },
    initDataList () {
      if (!this.contain.activeObj.iot) this.$set(this.contain.activeObj, 'iot', {})
      if (!this.contain.activeObj.dataBind) this.$set(this.contain.activeObj, 'dataBind', [])
      if (this.contain.activeObj.sql && this.isSql) {
        let mode = JSON.parse(crypto.decrypt(this.contain.activeObj.sql));
        this.db = mode.id;
        this.sql = mode.sql;
      } else {
        this.db = '';
        this.sql = '';
      }
      this.DIC.public = this.contain.list.filter(ele => {
        return (ele.component || {}).prop == 'data'
      }).map(ele => {
        return {
          label: ele.name,
          value: ele.index
        }
      })
      this.DIC.filter = Object.keys(this.contain.config.filters).map(key => this.contain.config.filters[key])
      getProjectList({ size: 99, current: 1 }).then(res => {
        const data = res.data.data;
        this.DIC.project = data.records.map(ele => {
          return {
            label: ele.productName,
            value: ele.productKey,
            desc: ele.categoryName
          }
        })
      })
      getCategoryList({
        categoryModule: 'record',
        current: 1,
        size: 99,
      }).then(res => {
        this.loading = false
        const data = res.data.data;
        this.DIC.recordType = [{ categoryKey: '全部', categoryValue: '' }].concat(data);
      })
    }
  }
}
</script>

<style lang="scss">
</style>