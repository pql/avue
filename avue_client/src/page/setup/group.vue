<template>
  <el-form label-position="left"
           label-width="90px"
           style="padding:0 10px;"
           size="small">
    <el-form-item label="默认屏幕">
      <avue-select :dic="contain.config.group"
                   v-model="contain.config.groupId"
                   :props="{label:'name',value:'id'}"
                   size="small"
                   placeholder="默认主屏幕"></avue-select>
    </el-form-item>
    <el-button size="small"
               type="primary"
               style="margin:10px 0 10px 0;"
               @click="handleAddGroup()">新增屏幕</el-button>
    <ul class="menu__ul">
      <li @click="contain.group=item.id"
          @dblclick="handleChangeName(item,index)"
          :class="['menu__item',{'is-active':contain.group==item.id}]"
          v-for="(item,index) in contain.config.group"
          :key="index">
        <el-tooltip class="item"
                    effect="dark"
                    :content="item.id"
                    placement="left">
          <span class="menu__icon">
            <svg-icon icon-class="screen" />
          </span>
        </el-tooltip>
        <span class="menu__label">
          <input type="text"
                 @keyup.enter="item.isname=false"
                 v-if="item.isname"
                 v-model="item.name">
          <span v-else
                class="menu__name">{{item.name}}</span>
        </span>
        <span class="menu__menu">
          <i class="el-icon-plus"
             @click.stop="handleAddGroup(index)"></i>
          <i class="el-icon-delete"
             v-if="index!=0"
             @click.stop="handleDelGroup(item,index)"></i>
        </span>
      </li>
    </ul>
    <!-- <monaco-editor v-model="contain.list"
                   disabled
                   @click.native="handleCopy(JSON.stringify(contain.list,null,4))"
                   language="javascript"
                   height="400"></monaco-editor> -->
    <div class="contentmenu"
         :id="menuId">
      <div class="contentmenu__item"
           @click="handleAddGroup(index)">新增 </div>
      <template v-if="index!=0">
        <div class="contentmenu__item"
             @click="handleChangeName(item,index)">{{item.isname?'完成':'重命名'}} </div>
        <div class="contentmenu__item"
             @click="handleDelGroup(item,index)">删除 </div>
        <div class="contentmenu__item"
             @click="handleCopy(item)">复制ID</div>
      </template>
    </div>
  </el-form>
</template>

<script>

import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import { uuid } from '@avue/avue-data/utils/utils'
export default {
  inject: ["contain"],
  components: {
    MonacoEditor
  },
  data () {
    return {
      obj: {},
      item: {},
      index: '',
      menuId: 'avue-group-menu'
    }
  },
  methods: {
    handleContextMenu (item = {}, done) {
      let index = this.contain.config.group.findIndex(ele => ele.id == item.id)
      this.item = item;
      this.index = index;
      done()
    },
    handleCopy (item) {
      this.$Clipboard({
        text: item.id
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });
    },
    handleChangeName (item, index) {
      if (index !== 0) {
        item.isname = !item.isname
      }
    },
    handleAddGroup (index) {
      if (!this.contain.config.group) {
        this.contain.config.group = []
      }
      let id = uuid();
      let item = this.contain.config.group[index] || {};
      let obj = {
        name: '新增屏幕',
        id: id,
        isname: true
      }
      const callback = () => {
        if (!this.validatenull(index)) {
          this.contain.config.group.splice(index + 1, 0, obj)
        } else {
          this.contain.config.group.push(obj)
        }
      }
      if (!index) {
        callback();
        return
      }
      this.$confirm('是否复制当前内容?', '提示', {
        confirmButtonText: '复制',
        cancelButtonText: '不复制',
        type: 'warning'
      }).then(() => {
        let list = this.deepClone(this.contain.nav.filter(ele => ele.group == item.id))
        const findEle = (result) => {
          result.forEach(ele => {
            ele.id = uuid()
            ele.group = id;
            if (ele.children) findEle(ele.children)
          })
        }
        findEle(list);
        this.contain.nav = this.contain.nav.concat(list);
        callback()
      }).catch(() => {
        callback()
      });

    },
    handleDelGroup (item, index) {
      this.$confirm(`是否删除【${item.name}】屏幕?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.contain.nav.length; i++) {
          const ele = this.contain.nav[i], index = i;
          if (ele.group == this.contain.group) {
            this.contain.nav.splice(index, 1);
            i--
          }
        }
        this.contain.config.group.splice(index, 1)
        if (this.contain.group == item.id) {
          this.contain.group = index != 0 ? this.contain.config.group[index - 1].id : ''
        }
      })
    },
  }
}
</script>

<style>
</style>