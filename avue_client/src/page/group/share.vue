<template>
  <el-dialog title="发布"
             append-to-body
             class="avue-dialog"
             :visible.sync="box"
             width="50%">
    <div class="avue-flex"
         style="align-items: flex-start;">
      <avue-form :option="option"
                 ref="form"
                 v-model="form"
                 @submit="handleSubmit">
        <template slot="href"
                  slot-scope="{}">
          <el-input v-model="form.href"
                    type="textarea"
                    row="3">
          </el-input>
          <a @click="handleView">查看组态</a>
          &nbsp;&nbsp;
          <a @click="handleCopy">复制链接</a>
        </template>
      </avue-form>
      <version ref="version"
               v-if="box"></version>
    </div>
    <span class="avue-dialog__footer avue-dialog__footer--center">
      <el-button size="small"
                 type="primary"
                 icon="el-icon-check"
                 @click="$refs.form.submit()">保存组态</el-button>
      <el-button type="danger"
                 @click="handleVersion()"
                 icon="el-icon-position"
                 size="small">发布版本</el-button>
    </span>
  </el-dialog>
</template>

<script>
import version from '@avue/avue-data/page/group/version';
import { updateObj } from '@avue/avue-data/api/visual';
export default {
  inject: ["contain"],
  provide () {
    return {
      parent: this,
      contain: this.contain,
    };
  },
  components: {
    version
  },
  data () {
    return {
      box: false,
      form: {},
      visual: {},
      option: {
        emptyBtn: false,
        submitBtn: false,
        size: 'small',
        span: 24,
        column: [{
          label: '组态名称',
          prop: 'title',
        }, {
          label: '发布',
          prop: 'status',
          type: 'switch',
          dicData: [{
            label: '',
            value: 0
          }, {
            label: '',
            value: 1
          }]
        }, {
          label: '链接',
          type: 'textarea',
          prop: 'href'
        }, {
          label: '密码',
          type: 'password',
          prop: 'password'
        }]
      }
    }
  },
  methods: {
    handleVersion () {
      this.$confirm('是否发布当前版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.version.handleAdd()
      })
    },
    handleShow () {
      this.box = true
      let visual = this.contain.visual
      this.visual = visual
      this.form.title = visual.title
      this.form.status = visual.status
      this.form.href = location.origin + '/view/' + this.visual.id
      this.form.password = visual.password
    },
    handleView () {
      let routeUrl = this.$router.resolve({
        path: '/view/' + this.visual.id
      })
      window.open(routeUrl.href, '_blank');
    },
    handleCopy () {
      this.$Clipboard({
        text: this.form.href
      }).then(() => {
        this.$message.success('链接复制成功')
      })

    },
    handleSubmit (form, done) {
      updateObj({
        id: this.visual.id,
        category: this.visual.category,
        password: this.form.password,
        status: this.form.status,
        title: this.form.title,
        version: this.visual.version
      }).then(() => {
        this.contain.visual = Object.assign(this.contain.visual, this.form)
        this.$parent.handleBuild(undefined, false);
        done();
        this.box = false
        this.$message.success('组态保存成功');
      })
    }
  }
}
</script>

<style>
</style>