<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"
                :lock-select="lockTreeSelect"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="模板名称">
            <b-input v-model.trim="listQuery.tempName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码">
            <b-input v-model.trim="listQuery.tempCode" size="small" placeholder="请输入" clearable></b-input>
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
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">修改</b-button>
            <b-divider type="vertical"/>
            <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/da-inner-temp.api.js'

  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'DaBusinessTemplate',
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '业务模板',
        listQuery: {
          tempName: '',
          tempCode: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', key: 'tempName', align: 'center' },
          { title: '模板编码', key: 'tempCode', align: 'center' },
          { title: '模板说明', key: 'tempDesc', align: 'center' },
          { title: '模板操作', slot: 'action', width: 130, align: 'center' }
        ],
        current: null,
        ruleValidate: {
          tempName: [requiredRule],
          tempCode: [requiredRule],
          tempType: [requiredRule],
          tempSource: [requiredRule]
        },
        dataTypeMap: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        }
      }
    },
    created() {
      this.searchList()
      this.initTree()
      this.resetCurrent()
    },
    methods: {
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.tempCode = node.id
        this.listQuery.page = 1
        this.current = 1
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.content.tempCode = node.id
        } else {
          this.handleFilter()
        }
      },
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
      handleShowTempType() {
        this.$refs.templateTypeChoose && this.$refs.templateTypeChoose.open()
      },
      handleChooseTempType(item) {
        this.current.tempType = item.tempType
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getInnerTemplateList(this.listQuery).then(response => {
          const list = response.data.rows || []
          let root = {
            tempCode: '',
            tempType: '模板类型',
            children: list
          }
          let mapper = node => {
            return {
              id: node.tempCode,
              title: node.tempType,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = mapper(root)
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
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
        console.log(row)
        console.log(this.current)
        this.current = { ...this.current, ...row }
        this.openEditPage('modify')
      },
      // 重置
      resetCurrent() {
        this.current = {
          id: '',
          tempName: '',
          tempCode: '',
          tempType: '',
          tempSource: '',
          tempDesc: '',
          fields: [{
            'paramName': '',
            'paramCode': '',
            'paramType': '',
            'isRequired': '',
            'defaultVal': '',
            'paramDesc': ''
          }]
        }
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          tempName: '',
          tempCode: ''
        }
      },
      // 表单提交
      handleSubmit() {
        let tmp = { ...this.current }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createInnerTemp : api.modifyInnerTemplate
            fun(tmp).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.btnLoading = false
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getInnerTemplateList(this.listQuery).then(response => {
          if (response.status === 200) {
            console.log(response)
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
