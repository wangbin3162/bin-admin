<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="部门名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canRemove" type="text" text-color="danger" @click="handleRemove(scope.row)">
              移除
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange">
        </b-page>
      </v-table-wrap>
    </page-header-wrap>
    <urp-dept-select ref="deptChoose" multiple @on-choose="handleAddDeptList"/>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/urp/urp-depart.api'
  import UrpDeptSelect from './components/UrpDeptSelect'

  export default {
    name: 'Depart',
    components: { UrpDeptSelect },
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          name: '',
          parentId: '',
          page: 1,
          size: 10
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '部门名称', key: 'name' },
          { title: '部门全称', key: 'fullName' },
          { title: '等级', key: 'departLevel' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        depart: null
      }
    },
    created() {
      this.initTree()
    },
    methods: {
      // 树结构点击事件
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.parentId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          name: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          page: 1,
          size: 10
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        // 传入父级id和等级
        let params = {
          parentId: this.currentTreeNode.id,
          departLevel: this.currentTreeNode.departLevel,
          departMap: new Map(this.departMapData)
        }
        this.$refs.deptChoose && this.$refs.deptChoose.open(params)
      },
      // 批量增加部门列表至一级
      handleAddDeptList(departs) {
        let promiseAdd = []
        departs.forEach(dept => {
          promiseAdd.push(api.createDept(dept))
        })
        Promise.all(promiseAdd).then(resList => {
          // 所有的都成功
          this.result = resList.every(resp => resp.data.code === '0')
          if (this.result) {
            this.$message({ type: 'success', content: '操作成功' })
            this.$refs.deptChoose && this.$refs.deptChoose.close()
            this.initTree()
          } else {
            this.$notice.danger({ title: '操作错误', desc: '批量添加部门失败' })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        api.removeDepart(row).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.initTree()
          } else {
            this.$notice.danger({ title: '操作错误', desc: res.data.message })
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getDeptTree().then(response => {
          const tree = response.data.data || []
          let data = tree[0] ? this.treeMapper(tree[0], null, ['departLevel', 'departId']) : {}
          this.treeData.push(data)
          this.departMapData = this.treeDataToMap(data)// 扁平化所有部门
          if (this.treeData.length > 0 && !this.currentTreeNode) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.parentId = this.currentTreeNode.id
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
          }
          this.resetQuery()
        })
      },
      // 树节点数据根据id平铺，用于判断弹窗多选时是否可以进行选择
      treeDataToMap(tree) {
        let all = []
        const mapper = (node) => {
          all.push([node.departId, { id: node.departId, title: node.title }])
          if (node.children) {
            node.children.forEach(item => {
              mapper(item)
            })
          }
        }
        mapper(tree)
        return all
      },
      // 查询所有部门列表
      searchList() {
        this.setListData()
        api.getDeptList(this.listQuery).then(response => {
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
