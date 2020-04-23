<template>
  <div>
    <page-header-wrap v-show="isNormal || isEdit">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="主题名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="主题编码">
            <b-input v-model.trim="listQuery.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary" v-if="canCreate"
                    icon="ios-add-circle-outline"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:url="scope">
            <b-button type="text" @click="handlePreview(scope.row.url)"
                      :disabled="!havePermission('preview')">预览
            </b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)" :disabled="!canModify">修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" text-color="danger" :disabled="!canRemove"
                      @click="handleRemove(scope.row)">删除
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="dialogFormVisible" :title="editTitle" append-to-body :mask-closable="false" width="550px">
      <div class="p15">
        <b-form :model="theme" ref="form" :rules="ruleValidate" :label-width="90">
          <b-row>
            <b-col span="12">
              <b-form-item label="主题名称" prop="name">
                <b-input v-model="theme.name" placeholder="请输入" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="主题编码" prop="code">
                <b-input v-model="theme.code" placeholder="请输入" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="预览地址" prop="url">
            <b-input v-model="theme.url" placeholder="请输入" clearable></b-input>
          </b-form-item>
          <b-form-item label="主题描述" prop="describe">
            <b-input v-model="theme.describe" type="textarea" placeholder="这里输入描述..." clearable></b-input>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button @click="handleCancel">取 消</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-theme.api'
  import { requiredRule } from '../../common/utils/validate'

  export default {
    name: 'DaTheme',
    mixins: [commonMixin, permission],
    data() {
      const validateCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneCode(this.theme).then(response => {
            if (response.data.code === '0') {
              callback()
            } else {
              callback(new Error('编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '主题',
        dialogFormVisible: false,
        listQuery: {
          name: '',
          code: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'name' },
          { title: '编码', key: 'code' },
          { title: '描述', key: 'describe' },
          { title: '预览', slot: 'url', width: 130, align: 'center' },
          { title: '操作', slot: 'action', width: 130, align: 'center' }
        ],
        theme: null,
        ruleValidate: {
          name: [requiredRule],
          code: [requiredRule, { validator: validateCode, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.searchList()
      this.resetTheme()
    },
    methods: {
      // 弹窗提示是否删除
      handleRemove(row) {
        let theme = { ...row }
        this.$confirm({
          title: '确实要删除当前主题吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeTheme(theme).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 新增按钮事件
      handleCreate() {
        this.resetTheme()
        this.dialogFormVisible = true
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetTheme()
        this.theme = { ...this.theme, ...row }
        this.dialogFormVisible = true
        this.openEditPage('modify')
      },
      // 弹窗取消
      handleCancel() {
        this.dialogStatus = ''
        this.dialogFormVisible = false
      },
      // 重置
      resetTheme() {
        this.theme = {
          id: '',
          name: '',
          describe: '',
          code: '',
          url: ''
        }
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          code: ''
        }
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createTheme : api.modifyTheme
            fun(this.theme).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.dialogFormVisible = false
                this.searchList()
              } else {
                this.submitDone(false)
                this.dialogFormVisible = false
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 预览事件
      handlePreview(path) {
        this.$router.push(path)
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getThemeList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
