<template>
  <el-form class="event"
           label-position="left"
           size="small">
    <el-form-item label-width="0px"
                  v-if="isList">
      <el-button size="small"
                 type="primary"
                 icon="el-icon-plus"
                 @click="open()">新增事件</el-button>
    </el-form-item>
    <draggable ghost-class="ghost"
               class="event__menu menu__ul"
               :group="{ name: 'event' }"
               v-if="isList"
               :list="contain.activeObj.child.paramList"
               :animation="300">
      <div class="menu__item"
           v-contextmenu="{id:menuId,event:handleContextMenu,value:item}"
           @click.self="open(index)"
           v-for="(item,index) in contain.activeObj.child.paramList"
           :key="index">
        <div class="menu__label">
          {{ index+1 }}.
          <el-checkbox v-model="item.switch"
                       size="small"></el-checkbox>
          <input type="text"
                 style="width:60px;flex:0"
                 v-model="item.name">|&nbsp;&nbsp;
          <span @click.stop="open(index)"> {{ getEventLabel(item.event)}}</span>
        </div>
        <div class="menu__menu">
          <i class="el-icon-edit"
             @click.stop="open(index)"></i>
          <i class="el-icon-close"
             @click.stop="delParamsList(index)"></i>
        </div>
      </div>
    </draggable>
    <el-empty v-else
              description="暂无事件">
      <el-button size="small"
                 type="primary"
                 icon="el-icon-plus"
                 @click="open()">新增事件</el-button>
      <template #image>
        <svg-icon icon-class="empty" />
      </template>
    </el-empty>
    <el-drawer :visible.sync="box"
               :close-on-click-modal="false"
               class="avue-dialog"
               title="事件编辑器"
               size="45%">
      <template v-if="list&&list.length!=0&&box">
        <div class="event__add">
          <el-button size="small"
                     type="primary"
                     @click="addParamsList"
                     icon="el-icon-plus">
            新增事件
          </el-button>
        </div>
        <el-collapse v-model="tabs">
          <el-collapse-item :name="index"
                            v-for="(item,index) in list"
                            :key="index">
            <template slot="title">
              <div class="avue-flex"
                   @click="stopCollapse">
                {{ index+1 }}.<avue-input v-model="item.name"
                            size="mini"></avue-input>
                <avue-select :dic="dicOption.transferEvent"
                             v-model="item.event"
                             size="mini"
                             placeholder="请选择事件，默认为click事件"></avue-select>
                <el-checkbox v-model="item.switch"
                             size="small"></el-checkbox>
              </div>
              <i class="event__close el-icon-delete"
                 @click.stop="delParamsList(index,true)"></i>

            </template>
            <div class="event__list">
              <el-form-item label-width="0">
                <div class="avue-collapse event__box">
                  <div class="header">
                    满足条件
                    <el-radio-group class="header-menu"
                                    v-model="item.conditionType"
                                    size="mini">
                      <el-radio :label="1">所有</el-radio>
                      <el-radio :label="0">任意</el-radio>
                    </el-radio-group>
                  </div>
                  <el-link size="small"
                           icon="el-icon-plus"
                           @click="conditionAdd(item,index)"
                           type="primary">新增触发条件</el-link>
                  <el-collapse v-model="conditionName[index]">
                    <el-collapse-item class="item"
                                      :name="cindex"
                                      v-for="(citem,cindex) in item.condition"
                                      :key="cindex">
                      <template slot="title">
                        <div class="item-header"
                             @click="stopCollapse">
                          <span>
                            条件 {{ cindex+1 }}
                            <input v-model="citem.name">
                          </span>
                          <i class="close el-icon-close"
                             @click="conditionDel(item,cindex)"></i>
                        </div>
                      </template>
                      <event-condition :item="citem"></event-condition>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-form-item>
              <el-form-item label-width="0">
                <div class="avue-collapse event__box">
                  <div class="header">执行动作</div>

                  <el-link size="small"
                           icon="el-icon-plus"
                           @click="actionAdd(item,index)"
                           type="primary">新增动作</el-link>
                  <el-collapse v-model="actionName[index]">
                    <el-collapse-item class="item"
                                      :name="cindex"
                                      v-for="(citem,cindex) in item.action"
                                      :key="cindex">
                      <template slot="title">
                        <div class="item-header"
                             @click="stopCollapse">
                          <span>
                            动作 {{ cindex+1 }}
                            <input v-model="citem.name">
                          </span>
                          <i class="close el-icon-delete"
                             @click="actionDel(item,cindex)"></i>
                        </div>
                      </template>
                      <div class="item-content">
                        <el-form-item label="动作类型">
                          <avue-select :dic="actionOption"
                                       size="small"
                                       v-model="citem.type"></avue-select>
                        </el-form-item>
                        <event-temp :item="citem"></event-temp>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
      </template>
      <el-empty v-else
                description="暂无事件">
        <el-button size="small"
                   type="primary"
                   @click="addParamsList"
                   icon="el-icon-plus">
          新增事件
        </el-button>
        <template #image>
          <svg-icon icon-class="empty" />
        </template>
      </el-empty>

      <span class="avue-dialog__footer avue-dialog__footer--right">
        <el-button size="small"
                   @click="close()">取 消</el-button>
        <el-button type="primary"
                   @click="submit()"
                   size="small">确 定</el-button>
      </span>
    </el-drawer>
    <div class="contentmenu"
         :id="menuId">
      <div class="contentmenu__item"
           @click="handleCopy()"><i class="iconfont icon-copy"></i>
        复制
      </div>
      <div class="contentmenu__item"
           v-if="contain.cacheList.event"
           @click="handlePaste()"><i class="iconfont icon-paste"></i>
        粘贴
      </div>
    </div>
  </el-form>
</template>

<script>
import eventTemp from '@avue/avue-data/page/setup/event-temp'
import eventCondition from '@avue/avue-data/page/setup/event-condition'
import { dicOption, actionOption } from '@avue/avue-data/option/config'
export default {
  inject: ["contain"],
  provide () {
    return {
      contain: this.contain,
    };
  },
  components: { eventTemp, eventCondition },
  data () {
    return {
      item: {},
      menuId: 'event-menu',
      conditionName: [],
      actionName: [],
      list: [],
      dicOption,
      tabs: 0,
      box: false,
      actionOption,
    }
  },
  computed: {
    isList () {
      return this.contain.activeObj.child.paramList && this.contain.activeObj.child.paramList.length !== 0
    }
  },
  methods: {
    handleCopy () {
      this.contain.cacheList.event = this.item;
      this.$message.success('复制成功')
    },
    handlePaste () {
      const item = this.contain.cacheList.event || {}
      this.contain.activeObj.child.paramList.push({
        name: '事件' + (this.list.length + 1),
        event: 'clickFormatter',
        switch: true,
        condition: item.condition,
        conditionType: item.conditionType,
        action: item.action
      })
      this.contain.cacheList.event = null
      this.$message.success('粘贴成功')
    },
    handleContextMenu (item = {}, done) {
      this.item = item;
      done()
    },
    stopCollapse (e) {
      return e.stopPropagation()
    },
    actionAdd (item, index) {
      item.action.push({
        name: '',
        index: [],
        paramsList: [],
        dic: [],
        type: 'params',
        child: []
      })
      this.actionName[index] = []
      this.actionName[index].push(item.action.length - 1)
    },
    actionDel (item, index) {
      item.action.splice(index, 1)
    },
    conditionDel (item, index) {
      item.condition.splice(index, 1)
    },
    conditionAdd (item, index) {
      item.condition.push({
        name: '',
        condition: '=',
        type: 0,
        typeIf: 1,
        dic: [],
        fun: `(params,refs)=>{
   return true
}`,
        index: '',
        value: ''
      })
      this.conditionName[index] = []
      this.conditionName[index].push(item.condition.length - 1)
    },
    open (index) {
      this.list = this.deepClone(this.contain.activeObj.child.paramList)
      this.tabs = index
      this.box = true;

    },
    submit () {
      this.$set(this.contain.activeObj.child, 'paramList', this.list)
      this.close()
    },
    close () {
      this.box = false;
    },
    getTitle (item, index) {
      return `${index + 1}.${this.getEventLabel(item.event)}__${this.getTypeLabel(item.type)}`
    },
    getEventLabel (event) {
      return (dicOption.transferEvent.find(ele => ele.value == event) || {}).label
    },
    getTypeLabel (value) {
      return (this.actionOption.find(ele => ele.value == value) || {}).label
    },
    handleTabsAdd () {
      this.addParamsList()
      this.tabs = this.list.length - 1
    },
    delParamsList (index, flag) {
      if (flag) {
        this.list.splice(index, 1)
      } else {
        this.contain.activeObj.child.paramList.splice(index, 1)
      }

    },
    addParamsList () {
      if (!this.list) {
        this.list = []
      }
      this.list.push({
        name: '事件' + (this.list.length + 1),
        event: 'clickFormatter',
        switch: true,
        condition: [],
        conditionType: 1,
        action: []
      })
    },
  }
}
</script>

<style lang="scss">
.event {
  .el-checkbox {
    margin: 0 2px 0 5px;
  }
}

.event__add {
  padding: 10px 10px 5px 10px;
}
.event__close {
  z-index: 1;
  position: absolute;
  right: 20px;
  top: 15px;
  font-size: 14px;
}
.event__menu {
  padding: 0 10px;
}
</style>