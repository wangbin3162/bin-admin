<template>
  <!--角色授权-->
  <page-header-wrap v-show="visible" show-close @on-close="close" :title="pageTitle">
    <v-table-wrap>
      <!--树结构-->
      <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
      <!--查询条件-->
      <v-filter-bar>
        <v-filter-item title="权限名称">
          <b-input v-model.trim="listQuery.name" size="small" placeholder="请输入权限名称" clearable></b-input>
        </v-filter-item>
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <v-table-tool-bar>
        <b-button v-if="canCreate" type="primary" size="small" @click="batchAuth"
                  :icon="isAllGrant ? 'ios-remove':'ios-add'">
          {{ grantAllTitle }}
        </b-button>
      </v-table-tool-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading">
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-switch v-model="scope.row.authorized" @on-change="singleAuth(scope.row)"></b-switch>
        </template>
      </b-table>
      <b-page :total="total" show-sizer :current.sync="listQuery.page"
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/role.api'

  export default {
    name: 'RoleAuth',
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        treeData: [],
        listQuery: {
          roleId: '', // 角色id
          functionId: '', // 权限id
          name: '' // 权限名称
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '权限代码', key: 'path' },
          { title: '权限名称', key: 'name' },
          { title: '权限描述', key: 'desc' },
          { title: '访问地址', key: 'url' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        role: null
      }
    },
    created() {
      this.initTree()
    },
    computed: {
      pageTitle() {
        return `[${this.role ? this.role.name : ''}] 角色授权`
      },
      grantAllTitle() {
        return this.isAllGrant ? '全部取消' : '全部授权'
      },
      isAllGrant() {
        return this.list.reduce((total, item) => total && item.authorized, true)
      }
    },
    methods: {
      open(role) {
        this.role = { ...role }
        // 查询成功时打开
        this.visible = true
        this.setTopTree() // 需要默认选中顶级节点
        this.resetQuery()
      },
      close() {
        this.visible = false
        this.$emit('on-close')
      },
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.functionId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          roleId: this.role.id, // 角色id
          functionId: this.currentTreeNode ? this.currentTreeNode.id : '', // 权限id
          name: '' // 权限名称
        }
        this.handleFilter()
      },
      // 单个授权
      singleAuth(row) {
        let func = row.authorized ? api.createAuth : api.removeAuth
        let functionIds = [row.id]
        func && func(this.role.id, functionIds).then(res => {
          if (res.status === 200) {
            this.$message({ type: 'success', content: row.authorized ? '权限已添加' : '权限已删除' })
            this.updateRowAuth(row, row.authorized)
          }
        }).catch(() => {
          this.$message({ type: 'warning', content: row.authorized ? '添加授权失败' : '删除授权失败' })
          // 失败之后需要刷新一次列表
          this.handleFilter()
        })
      },
      // 批量授权
      batchAuth() {
        let isGrant = !this.isAllGrant
        let functionIds = []
        this.list.forEach(item => {
          if (item.authorized !== isGrant) {
            functionIds.push(item.id)
          }
          item.authorized = isGrant
        })
        let func = isGrant ? api.createAuth : api.removeAuth
        func(this.role.id, functionIds).then(resp => {
          if (resp.status === 200) {
            this.$message({ type: 'success', content: isGrant ? '权限已添加' : '权限已删除' })
          }
        }).catch(() => {
          this.$message({ type: 'warning', content: isGrant ? '添加授权失败' : '删除授权失败' })
          // 失败之后需要刷新一次列表
          this.handleFilter()
        })
      },
      /* [数据接口] */
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getFuncTree().then(response => {
          const tree = response.data.data || {}
          // 这里映射权限时，title显示为menuName
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = mapper(tree)
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.functionId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
          }
        })
      },
      // 查询所有字典项列表
      searchList() {
        this.setListData()
        api.getFuncList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 设置选中顶级树节点
      setTopTree() {
        // 取消当前节点的选中
        this.currentTreeNode.selected = false
        if (this.treeData.length > 0) {
          // 默认再次选中第一个
          this.currentTreeNode = this.treeData[0]
          this.listQuery.functionId = this.currentTreeNode.id
          this.treeData[0].selected = true
        }
      },
      // 更新当前list中的一行状态
      updateRowAuth(row, status) {
        let temp = this.list.find(item => item.id === row.id)
        if (temp) {
          temp.authorized = status
        }
      }
    }
  }
</script>
