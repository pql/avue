<template>
  <el-dialog append-to-body
             class="avue-dialog"
             title="更多设置"
             :close-on-click-modal="false"
             :visible.sync="box"
             width="70%">
    <el-form size="small"
             label-width="130px">
      <el-form-item label="数据类型">
        <avue-select v-model="contain.activeObj.dataType"
                     :dic="contain.dicOption.dataType"></avue-select>
        &nbsp;
        <template v-if="dataParent.isStatic">
          <el-button size="small"
                     type="primary"
                     icon="el-icon-edit"
                     @click="contain.openCode('data','数据值')">编辑</el-button>
          &nbsp;
          <el-upload :show-file-list="false"
                     :auto-upload="false"
                     style="display:inline-block"
                     accept=".xls,.xlsx"
                     :on-change="handleImport">
            <el-button size="small"
                       icon="el-icon-upload"
                       type="success">导入数据(Excel)</el-button>
          </el-upload>
        </template>
        <template v-else-if="dataParent.isApi">
          <avue-switch v-model="contain.activeObj.proxy"
                       :dic="[{label:'',value:false},{label:'开启跨域',value:true}]"
                       @click="contain.handleRefresh"></avue-switch>
        </template>
      </el-form-item>
      <template v-if="dataParent.isSql">
        <el-form-item label="数据源选择">
          <avue-select :dic="dataParent.DIC.sql"
                       v-model="dataParent.db"></avue-select>
        </el-form-item>

        <el-form-item label="SQL语句"
                      label-position="top">
          <el-tooltip effect="dark"
                      content="如果要获取变量，直接写成函数返回sql语句即可"
                      placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
          <monaco-editor v-model="dataParent.sql"
                         language="sql"
                         height="100"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="dataParent.isApi || dataParent.isNode">
        <el-form-item label="地址">
          <el-row>
            <el-col :span="4"
                    v-if="dataParent.isApi">
              <avue-select v-model="contain.activeObj.dataMethod"
                           placeholder="请选择请求方式"
                           :dic="contain.dicOption.dataMethod"></avue-select>
            </el-col>
            <el-col :span="20">
              <avue-input v-model="contain.activeObj.url"
                          placeholder="请输入地址"></avue-input>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-else-if="dataParent.isWs">
        <el-form-item label="WS地址">
          <el-input v-model="contain.activeObj.wsUrl">
          </el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataParent.isRecord">
        <el-form-item label="数据集">
          <avue-select :dic="dataParent.DIC.recordType"
                       placeholder="请选择分类"
                       @change="dataParent.handleRecordTypeChange"
                       :props="{label:'categoryKey',value:'categoryValue'}"
                       v-model="contain.activeObj.recordType"></avue-select>
          <avue-select :dic="dataParent.DIC.record"
                       filterable
                       placeholder="请选择数据集"
                       v-model="contain.activeObj.record"></avue-select>
        </el-form-item>

      </template>
      <template v-else-if="dataParent.isPublic">
        <el-form-item label="公共数据集选择">
          <avue-select filterable
                       :dic="dataParent.DIC.public"
                       v-model="contain.activeObj.public"></avue-select>
        </el-form-item>
      </template>
      <template v-else-if="dataParent.isMqtt">
        <el-form-item label="MQTT地址">
          <el-input v-model="contain.activeObj.mqttUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT配置">
          <monaco-editor v-model="contain.activeObj.mqttConfig"
                         height="250"></monaco-editor>
        </el-form-item>
      </template>
      <template v-else-if="dataParent.isIot">
        <el-form-item label="设备">
          <div class="avue-flex">
            <avue-select v-model="contain.activeObj.iot.projectId"
                         placeholder="请选择产品"
                         :dic="dataParent.DIC.project"
                         @change="dataParent.handleProjectChange"
                         allowCreate
                         filterable>
            </avue-select>
            <el-input placeholder="请输入设备号"
                      v-model="contain.activeObj.iot.deviceId"
                      class="input-with-select">
              <el-button slot="append"
                         @click="dataParent.handleOpenDevice()"
                         icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="认证类型">
          <el-radio-group v-model="contain.activeObj.iot.type"
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
          <el-form-item label="认证信息">
            <div class="avue-flex">
              <el-input v-model="contain.activeObj.iot.username"
                        placeholder="用户名">
              </el-input>
              <el-input v-model="contain.activeObj.iot.password"
                        placeholder="密码">
              </el-input>
            </div>
          </el-form-item>
        </template>
      </template>
      <el-form-item label="请求配置"
                    v-if="dataParent.isWs || dataParent.isApi">
        <el-tabs class="menu__tabs"
                 v-model="dataTabs">
          <el-tab-pane label="请求参数（Body）"
                       name="0">
            <template v-if="dataTabs==0">
              <el-radio-group v-if="['post','put'].includes(contain.activeObj.dataMethod)"
                              v-model="contain.activeObj.dataQueryType">
                <el-radio label="json">JSON数据</el-radio>
                <el-radio label="form">FORM表单</el-radio>
              </el-radio-group>
              <avue-highlight v-model="contain.activeObj.dataQuery"
                              height="200"></avue-highlight>
              <el-button class="el-button--edit"
                         size="small"
                         type="primary"
                         icon="el-icon-edit"
                         @click="contain.openCode('dataQuery','请求参数')">编辑</el-button>
            </template>

          </el-tab-pane>
          <el-tab-pane label="请求头（Headers）"
                       name="1"
                       v-if="dataParent.isApi">
            <template v-if="dataTabs==1">
              <avue-highlight v-model="contain.activeObj.dataHeader"
                              height="200"></avue-highlight>
              <el-button class="el-button--edit"
                         size="small"
                         type="primary"
                         icon="el-icon-edit"
                         @click="contain.openCode('dataHeader','请求头')">编辑</el-button>
            </template>

          </el-tab-pane>

        </el-tabs>
      </el-form-item>
      <el-form-item label="过滤器">
        <avue-select v-model="contain.activeObj.dataFormatterId"
                     :dic="dataParent.filter"
                     :props="{label:'name',value:'id'}"></avue-select>
        <avue-highlight :value="contain.activeObj.dataFormatterId?contain.config.filters[contain.activeObj.dataFormatterId].dataFormatter:contain.activeObj.dataFormatter"
                        height="200"></avue-highlight>
        <el-button class="el-button--edit"
                   style="top:44px"
                   v-if="!contain.activeObj.dataFormatterId"
                   size="small"
                   type="primary"
                   icon="el-icon-edit"
                   @click="contain.openCode('dataFormatter','编辑过滤器')">编辑</el-button>

      </el-form-item>
      <el-form-item label="响应数据">
        <el-tabs class="menu__tabs"
                 v-model="dataParent.resTabs">
          <el-tab-pane label="处理后数据"
                       name="0">
            <json-viewer v-loading="dataParent.dataLoading"
                         v-bind="$loadingParams"
                         :value="dataParent.dataRes"
                         copyable
                         theme="avue-json-theme"
                         boxed></json-viewer>
          </el-tab-pane>
          <el-tab-pane label="原始数据"
                       name="1">
            <json-viewer v-loading="dataParent.dataLoading"
                         v-bind="$loadingParams"
                         :value="dataParent.dataOldRes"
                         copyable
                         theme="avue-json-theme"
                         boxed></json-viewer>

          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <span class="avue-dialog__footer avue-dialog__footer--right">
      <el-button size="small"
                 icon="el-icon-edit"
                 type="danger"
                 @click="contain.openCode('stylesFormatter','编辑样式')">编辑样式</el-button>
      <el-button size="small"
                 type="primary"
                 icon="el-icon-refresh"
                 @click="dataParent.handleRes">请求数据</el-button>
      <el-button size="small"
                 type="danger"
                 icon="el-icon-close"
                 @click="box=false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
export default {
  inject: ["contain", "dataParent"],
  components: {
    MonacoEditor
  },
  data () {
    return {
      dataTabs: 0,
      box: false
    }
  },
  methods: {
    handleImport (file) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.contain.activeObj.data = data.results;
          this.$message.success('导入成功')
          this.contain.handleRes()
        })
    },
  }
}
</script>