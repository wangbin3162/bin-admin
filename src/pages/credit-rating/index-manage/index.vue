<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 树结构 -->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="指标性质">
            <b-select v-model="listQuery.nature" clearable>
              <b-option :value="1">优先指标</b-option>
              <b-option :value="2">普通指标</b-option>
              <b-option :value="3">降级指标</b-option>
              <b-option :value="4">关联降级指标</b-option>
            </b-select>
          </v-filter-item>
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              编辑
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除
            </b-button>
          </template>
        </b-table>
        <!-- 下方分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!-- 编辑 -->
    <Edit v-show="isEdit" :title="editTitle" @close="handleCancel"></Edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from '@/pages/credit-rating/index-manage/Edit'
  import { getIndexManageTree, getIndexManageList } from '../../../api/credit-rating/index-manage.api'

  export default {
    name: 'IndexManage',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        moduleName: '指标',
        treeData: [],
        listQuery: {
          indexName: '',
          bizType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '编码', key: 'code' },
          { title: '名称', slot: 'name' },
          { title: '指标性质', key: 'nature' },
          { title: '标度', key: 'scale' },
          { title: '有效期限', key: 'timeLimit' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    created () {
      this.initTree()
    },
    methods: {
      handTreeCurrentChange (data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.bizType = node.id
        this.handleFilter()
      },
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          indexName: '',
          bizType: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCurrentChange () {

      },
      handleSizeChange () {

      },
      handleModify () {
        this.openEditPage('modify')
      },
      handleRemove () {

      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getIndexManageTree().then(response => {
          const tree = response.data
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
            this.listQuery.bizType = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexManageList(this.listQuery).then(response => {
          if (res.status === 200) {
            this.setListData({
              list: res.rows,
              total: res.total
            })
          }
        })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      }
    }
  }
</script>
