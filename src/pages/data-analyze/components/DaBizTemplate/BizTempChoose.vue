<template>
  <b-modal v-model="dialogFormVisible" title="选择业务模板" width="1020" class="layout-inner"
           :body-styles="{padding:0}" :mask-closable="false">
    <v-table-wrap style="padding: 0;">
      <!--树结构-->
      <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
              @on-select-change="handTreeCurrentChange"></b-tree>
      <!--查询条件-->
      <v-filter-bar>
        <v-filter-item title="模板名称">
          <b-input v-model.trim="listQuery.tempName" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="模板编码">
          <b-input v-model.trim="listQuery.tempCode" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading">
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="primary" plain @click="chooseOne(scope.row)">
            选择
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>
    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" show-sizer :current.sync="listQuery.page"
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"/>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import * as api from '../../../../api/data-analyze/da-business-temp.api.js'

  export default {
    name: 'BizTempChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '内置模板',
        listQuery: {
          tempCode: '',
          tempName: '',
          tempType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', key: 'tempName' },
          { title: '模板编码', key: 'tempCode' },
          { title: '模板说明', key: 'tempDesc' },
          { title: '模板操作', slot: 'action', width: 130, align: 'center' }
        ],
        treeData: [],
        template: null,
        dialogFormVisible: false
      }
    },
    created() {
      this.resetTemplate()
      this.initTree()
    },
    methods: {
      open() {
        this.dialogFormVisible = true
        this.listQuery.name = ''
        this.searchList()
      },
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.tempType = node.code
        this.handleFilter()
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
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getTemplateTree().then(response => {
          if (response.data.code === '0') {
            const tree = response.data.data[0]
            // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
            let data = tree ? this.treeMapper(tree, null, ['code']) : {}
            this.treeData.push(data)
            if (this.treeData.length > 0) {
              // 如果没有当前选中节点则初始化为第一个选中
              if (!this.currentTreeNode) {
                this.currentTreeNode = this.treeData[0]
                // 这里要注意，扩展响应式属性需要这么写
                this.$set(this.treeData[0], 'selected', true)
                this.$set(this.treeData[0], 'expand', true)
              }
              this.listQuery.tempType = this.currentTreeNode.code
              this.handleFilter()
            }
          }
        })
      },
      chooseOne(temp) {
        this.$emit('on-choose', temp)
        this.dialogFormVisible = false
      },
      // 重置对象
      resetTemplate() {
        this.template = {
          id: '',
          tempName: '',
          tempCode: '',
          tempType: this.currentTreeNode ? this.currentTreeNode.code : '',
          tempSource: '',
          tempDesc: ''
        }
        this.params = []
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getBusinessTemplateList(this.listQuery).then(response => {
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
