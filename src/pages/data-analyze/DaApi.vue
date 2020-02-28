<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="接口名称">
            <b-input v-model.trim="listQuery.name" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="接口编码">
            <b-input v-model.trim="listQuery.code" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" style="color:orange;">测试</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-api.api'
  import { requiredRule } from '../../common/utils/validate'

  export default {
    name: 'DaTheme',
    mixins: [commonMixin, permission],
    data() {
      const validateCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneCode(this.current).then(response => {
            console.log(response)
            if (response.data.code === '0') {
              callback()
            } else {
              callback(new Error('字典项编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: 'API',
        listQuery: {
          name: '',
          code: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '接口名称', key: 'name' },
          { title: '接口类型', key: 'type' },
          { title: '创建人', key: 'createBy' },
          { title: '操作时间', key: 'createDate' },
          { title: '操作', slot: 'action', width: 180, align: 'center' }
        ],
        current: null,
        ruleValidate: {
          code: [requiredRule, { validator: validateCode, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.searchList()
      this.resetCurrent()
    },
    methods: {
      // 弹窗提示是否删除
      handleRemove(row) {
        let theme = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前主题吗？`,
          loading: true,
          onOk: () => {
            api.handleRemove(theme).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 新增按钮事件
      handleCreate() {
        this.resetCurrent()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetCurrent()
        this.current = { ...this.current, ...row }
        this.openEditPage('modify')
      },
      // 重置
      resetCurrent() {
        this.current = {
          id: '',
          name: '',
          describe: '',
          code: '',
          createBy: ''
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
            fun(this.current).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getApiList(this.listQuery).then(response => {
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
