<template>
  <b-modal v-model="dialogFormVisible" title="选择用户" width="1020"
           class="layout-inner" :mask-closable="false"
           :body-styles="{padding:0}"
           @on-cancel="$emit('on-change',null)">
    <v-table-wrap>
      <!--树结构-->
      <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
              @on-select-change="handTreeCurrentChange"></b-tree>
      <!--查询条件-->
      <v-filter-bar @keyup-enter="handleFilter">
        <v-filter-item title="登录名称">
          <b-input v-model.trim="listQuery.username" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="真实名称">
          <b-input v-model.trim="listQuery.realName" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="禁用状态" width="160px">
          <b-switch size="large" v-model="listQuery.status" :true-value="ENUM.DISABLE" :false-value="ENUM.ENABLE"
                    @on-change="handleFilter">
            <span slot="open">显示</span>
            <span slot="close">隐藏</span>
          </b-switch>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <!--状态-->
        <template v-slot:status="scope">{{ statusMap[scope.row.status] }}</template>
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="text" @click="chooseOne(scope.row)">选择</b-button>
        </template>
      </b-table>
    </v-table-wrap>
    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/sys/user.api'
  import { getUserStatus } from '../../../../../api/enum.api'
  import { getDeptTree } from '../../../../../api/sys/depart.api'

  export default {
    name: 'UserChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          departName: '',
          parentId: '',
          status: 'D'
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '登录名称', key: 'username' },
          { title: '真实名称', key: 'realName' },
          { title: '用户状态', slot: 'status', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        statusMap: { 'I': '初始', 'Y': '启用', 'D': '禁用' }
      }
    },
    computed: {
      ENUM() {
        return { INIT: 'I', ENABLE: 'Y', DISABLE: 'D' } // 常量比对键值对 初始状态不可启用禁用和删除
      }
    },
    created() {
      this.getUserStatusEnum()
    },
    methods: {
      open() {
        this.initTree()
        this.dialogFormVisible = true
      },
      // 选择一个
      chooseOne(item) {
        this.$emit('on-change', {
          id: item.id,
          value: item.realName
        })
        this.dialogFormVisible = false
      },
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.departId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          username: '',
          realName: '',
          status: this.ENUM.DISABLE,
          departId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 通用枚举
      getUserStatusEnum() {
        getUserStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getDeptTree().then(response => {
          const tree = response.data.data || []
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = tree[0] ? mapper(tree[0]) : []
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
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getUserList(this.listQuery).then(response => {
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
