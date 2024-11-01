<template>
  <div>
    <template v-if="item.type=='params'">
      <el-form-item label="操作对象">
        <avue-select multiple
                     filterable
                     v-model="item.index"
                     :dic="childrenDic"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
      </el-form-item>
      <el-form-item label=""
                    label-width="0">
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="item.child.push({})">新增参数</el-button>
      </el-form-item>
      <template v-for="(citem,cindex) in item.child">
        <div :key="cindex">
          <el-form-item label="参数名称">
            <el-input v-model="citem.name"
                      placeholder="参数名称">
              <el-button type="danger"
                         slot="append"
                         icon="el-icon-delete"
                         @click="item.child.splice(cindex,1)"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="映射字段">
            <avue-input v-model="citem.value"
                        placeholder="映射字段"></avue-input>
          </el-form-item>
          <br />
        </div>
      </template>
    </template>
    <template v-else-if="item.type=='group'">
      <el-form-item label="跳转屏幕">
        <avue-select :dic="contain.config.group"
                     size="mini"
                     v-model="item.group"
                     placeholder="请选择组态对象"
                     :props="{label:'name',value:'id'}">
        </avue-select>
      </el-form-item>
    </template>
    <template v-else-if="item.type=='href'">
      <el-form-item label="新窗口">
        <avue-switch v-model="item.target"></avue-switch>
      </el-form-item>
      <el-form-item label="跳转地址">
        <avue-input v-model="item.src"
                    placeholder="请输入跳转地址">
        </avue-input>
      </el-form-item>
      <el-form-item label=""
                    label-width="0">
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="item.child.push({})">新增参数</el-button>
      </el-form-item>
      <template v-for="(citem,cindex) in item.child">
        <div :key="cindex">
          <el-form-item label="参数名称">
            <el-input v-model="citem.name"
                      placeholder="参数名称">
              <el-button type="danger"
                         slot="append"
                         icon="el-icon-delete"
                         @click="item.child.splice(cindex,1)"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="映射字段">
            <avue-input v-model="citem.value"
                        placeholder="映射字段"></avue-input>
          </el-form-item>
          <br />
        </div>
      </template>
    </template>
    <template v-else-if="item.type=='display'">
      <el-form-item label="操作对象">
        <avue-select multiple
                     filterable
                     v-model="item.index"
                     :dic="childrenDic"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
      </el-form-item>
      <el-form-item label="操作">
        <avue-select v-model="item.displayType"
                     :dic="dicOption.displayType">
        </avue-select>
      </el-form-item>
    </template>
    <template v-else-if="item.type=='data'">
      <el-form-item label="操作对象">
        <avue-select multiple
                     filterable
                     v-model="item.index"
                     :dic="childrenDic"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
      </el-form-item>
    </template>
    <template v-else-if="item.type=='attribute'">
      <el-form-item label="操作对象">
        <avue-select multiple
                     filterable
                     placeholder="默认自己"
                     @change="handleChange(item)"
                     v-model="item.index"
                     :dic="childrenDic"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
      </el-form-item>
      <el-form-item class="属性值">
        <el-link size="mini"
                 icon="el-icon-plus"
                 @click="item.paramsList.push({label:'',value:''})"
                 type="primary">新增属性值</el-link>
        <ul class="menu__ul"
            style="width:100%">
          <li class="menu__item"
              style="padding:3px 5px;"
              v-for="(citem,cindex) in item.paramsList"
              :key="cindex">
            <span class="menu__label">
              <span class="menu__name avue-flex">
                <avue-select type="text"
                             :dic="item.dic"
                             allowCreate
                             filterable
                             placeholder="请选择属性"
                             v-model="citem.label"></avue-select>
                <input type="text"
                       placeholder="请输入属性值"
                       v-model="citem.value">
              </span>
            </span>
            <span class="menu__menu">
              <i class="el-icon-delete"
                 @click.stop="item.paramsList.splice(cindex,1)"></i>
            </span>
          </li>
        </ul>
      </el-form-item>
    </template>
    <template v-else-if="item.type=='dialog'">
      <el-form-item label="弹窗标题">
        <avue-input v-model="item.title"
                    placeholder="请输入弹窗标题">
        </avue-input>
      </el-form-item>
      <el-form-item label="操作对象">
        <avue-select multiple
                     filterable
                     v-model="item.index"
                     :dic="childrenDic"
                     :props="{label: 'name',value: 'index'}">
        </avue-select>
      </el-form-item>
      <el-form-item label="大屏">
        <avue-select :dic="contain.config.group"
                     v-model="item.group"
                     placeholder="请选择大屏对象"
                     :props="{label:'name',value:'id'}">
        </avue-select>
      </el-form-item>
    </template>
    <template v-else-if="item.type=='fun'">
      <event-fun v-model="item.fun"></event-fun>
    </template>
  </div>
</template>

<script>

import { dicOption } from '@avue/avue-data/option/config'
import eventFun from '@avue/avue-data/page/setup/event-fun'
export default {
  inject: ["contain"],
  props: {
    item: Object
  },
  components: { eventFun },
  data () {
    return {
      dicOption
    }
  },
  created () {
    this.item.dic = this.contain.activeObj.dataBind;
  },
  computed: {
    childrenDic () {
      return this.contain.list
    }
  },
  methods: {
    handleChange (row) {
      this.$nextTick(() => {
        if (row.index.length == 0) {
          row.dic = this.contain.activeObj.dataBind
        } else {
          row.dic = []
          row.index.forEach(index => {
            let { item } = this.contain.findnav(index)
            row.dic = row.dic.concat(item.dataBind)
          })
          row.dic = Array.from(new Map(row.dic.map(item => [item.value, item])).values());
        }
      })
    }
  }
}
</script>

<style>
</style>