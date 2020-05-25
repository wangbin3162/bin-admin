<template>
  <div style="width: 100%;">
    <div v-if="showBtn" flex="box:last cross:center">
      <b-input v-model="current" placeholder="请选择" readonly clearable @on-clear="handleClear"/>
      <b-button type="primary" @click="handleShowModal" plain>选择</b-button>
    </div>
    <b-input v-else v-model="current" placeholder="请选择" readonly clearable
             style="vertical-align: -1px;" @on-clear="handleClear">
      <b-icon name="ios-business" style="cursor: pointer;" slot="suffix" @click.native="handleShowModal"/>
    </b-input>
    <b-modal v-model="dialogFormVisible" title="选择部门" width="1020" append-to-body
             class="layout-inner" :mask-closable="false"
             :body-styles="{padding:0}">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"/>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="部门名称" :span="8">
            <b-input v-model.trim="listQuery.departName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--类型-->
          <template v-slot:departKind="scope">{{ deptMap[scope.row.departKind] }}</template>
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
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/depart.api'
  import { getDeptStatus, getDeptType } from '../../../api/enum.api'

  export default {
    name: 'UrpDeptSelect',
    mixins: [commonMixin, permission],
    props: {
      value: { // 存储id
        type: String,
        default: ''
      },
      defaultName: { // 显示名称
        type: String,
        default: ''
      },
      showBtn: {
        type: Boolean
      }
    },
    watch: {
      defaultName: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    data() {
      return {
        current: '', // 显示名称
        dialogFormVisible: false,
        listQuery: {
          departName: '',
          parentId: '',
          status: 'D'
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '部门名称', key: 'departName' },
          { title: '部门全称', key: 'fullName' },
          { title: '部门类型', slot: 'departKind', align: 'center' },
          { title: '状态', slot: 'status', width: 90, align: 'center' },
          { title: '操作', slot: 'action', width: 90 }
        ],
        statusMap: { 'D': '禁用', 'Y': '启用' },
        deptMap: { 'DOMAIN': '机构', 'NORMAL': '一般组织' }
      }
    },
    created() {
      this.getDeptStatusEnum()
      this.getDeptTypeEnum()
    },
    methods: {
      /* [事件响应] */
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
          page: 1,
          size: 10,
          departName: '',
          status: 'D',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 通用枚举
      getDeptStatusEnum() {
        getDeptStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
          }
        })
      },
      // 部门类型枚举
      getDeptTypeEnum() {
        getDeptType().then(res => {
          if (res.status === 200) {
            this.deptMap = res.data.data
          }
        })
      },
      // 打开弹窗
      handleShowModal() {
        this.dialogFormVisible = true
        this.initTree()
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-choose', { id: '', departName: '' })
      },
      // 选择一个
      chooseOne(item) {
        this.current = item.departName
        this.$emit('input', item.id)
        this.$emit('on-choose', { id: item.id, departName: item.departName })
        this.dialogFormVisible = false
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getDeptTree().then(response => {
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
            this.topNode = this.treeData[0]
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

<style scoped>

</style>
