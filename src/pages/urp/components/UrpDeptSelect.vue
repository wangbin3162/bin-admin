<template>
  <div style="width: 100%;">
    <template v-if="!multiple">
      <div v-if="showBtn" flex="box:last cross:center">
        <b-input v-model="current" placeholder="请选择" readonly clearable @on-clear="handleClear"/>
        <b-button type="primary" @click="handleShowModal" plain>选择</b-button>
      </div>
      <b-input v-else v-model="current" placeholder="请选择" readonly clearable
               style="vertical-align: -1px;" @on-clear="handleClear">
        <b-icon name="ios-business" style="cursor: pointer;" slot="suffix" @click.native="handleShowModal"/>
      </b-input>
    </template>
    <b-modal v-model="dialogFormVisible" title="选择部门" width="1020" append-to-body
             class="layout-inner" :mask-closable="false"
             :body-styles="{padding:0}">
      <v-table-wrap>
        <!--多选部门-->
        <template v-if="multiple">
          <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"/>
          <b-row :gutter="15">
            <b-col span="16">
              <!--查询条件-->
              <v-filter-bar>
                <v-filter-item title="部门名称" :span="12">
                  <b-input v-model.trim="listQuery.departName" placeholder="请输入" clearable></b-input>
                </v-filter-item>
                <!--添加查询按钮位置-->
                <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
              </v-filter-bar>
              <!--中央表格-->
              <b-table :columns="columns2" :data="list" :loading="listLoading" size="small">
                <!--操作栏-->
                <template v-slot:action="{row}">
                  <b-button type="text"
                            :text-color="disableRowBtn(row)?'#999':checkRowSelected(row)?'danger':'primary'"
                            :disabled="disableRowBtn(row)"
                            @click="chooseOne(row)">
                    {{ checkRowSelected(row)?'取消':'选择' }}
                  </b-button>
                </template>
              </b-table>
              <!--下方分页器-->
              <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange">
              </b-page>
            </b-col>
            <b-col span="8">
              <b-card class="box-card" head-tip header="已选部门">
                <b-empty v-show="selectedList.length===0">未选择部门</b-empty>
                <b-tag :key="tag.id||index"
                       closable type="info"
                       v-for="(tag,index) in selectedList"
                       @on-close="handleCloseTag(index)">
                  {{ tag.departName }}
                </b-tag>
                <b-button type="primary" transparent style="width: 100%;margin: 10px 0;"
                          :disabled="selectedList.length===0" @click="postSelectedList">
                  新增部门
                </b-button>
              </b-card>
            </b-col>
          </b-row>
        </template>
        <!--单选部门-->
        <template v-else>
          <b-tree :data="treeData" check-strictly slot="tree" show-checkbox
                  @on-select-change="handTreeCurrentChange"
                  @on-check-change="handleTreeCheck"/>
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
        </template>
      </v-table-wrap>
      <div slot="footer">
        <!--下方分页器-->
        <b-page v-if="!multiple" :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
        <b-button v-else @click="dialogFormVisible = false">关闭</b-button>
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
      },
      multiple: { // 多选模式
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
        columns2: [
          { type: 'index', width: 50, align: 'center' },
          { title: '部门名称', key: 'departName' },
          { title: '部门全称', key: 'fullName' },
          { title: '操作', slot: 'action', width: 90 }
        ],
        statusMap: { 'D': '禁用', 'Y': '启用' },
        deptMap: { 'DOMAIN': '机构', 'NORMAL': '一般组织' },
        selectedList: [] // 已选中列表内容
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
      open(params) {
        // 接收参数
        this.parentId = params.parentId
        this.departLevel = params.departLevel + 1
        this.departMap = params.departMap // 已存在的所有部门平铺
        this.selectedList = [] // 清空已选择部门
        this.initTree()
        this.dialogFormVisible = true
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
      chooseOne(row) {
        if (this.multiple) {
          let index = this.selectedList.findIndex(item => item.id === row.id)
          if (index === -1) {
            this.selectedList.push({
              id: row.id,
              departName: row.departName,
              parentId: this.parentId,
              departLevel: this.departLevel,
              fullName: row.fullName
            })
          } else {
            this.selectedList.splice(index, 1)
          }
          return
        }
        this.current = row.departName
        this.$emit('input', row.id)
        this.$emit('on-choose', { id: row.id, departName: row.departName })
        this.dialogFormVisible = false
      },
      // 选择根节点
      handleTreeCheck(list, node) {
        this.current = node.title
        this.$emit('input', node.id)
        this.$emit('on-choose', { id: node.id, departName: node.title })
        this.dialogFormVisible = false
      },
      close() {
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
      },
      // 多选内容
      handleCloseTag(index) {
        this.selectedList.splice(index, 1)
      },
      postSelectedList() {
        this.$emit('on-choose', this.selectedList)
      },
      // 当前行是否被选择
      checkRowSelected(row) {
        return !!this.selectedList.find(item => item.id === row.id)
      },
      // 当前行是否应该被禁用
      disableRowBtn(row) {
        return this.departMap ? this.departMap.has(row.id) : false
      }
    }
  }
</script>
