<template>
  <v-table-wrap>
    <b-tree :data="treeData" slot="tree"
            @on-select-change="handDeptTreeCurrentChange">
    </b-tree>
    <b-row :gutter="15">
      <b-col span="16">
        <b-table :columns="deptColumns" :loading="deptListLoading" :data="list">
          <!--类型-->
          <template v-slot:departKind="scope">{{ deptMap[scope.row.departKind] }}</template>
          <!--操作-->
          <template v-slot:isSelect="scope">
            <b-button :type="checkRowSelected(scope.row)?'danger':'primary'" plain
                      @click="chooseOne(scope.row)">
              {{ checkRowSelected(scope.row)?'取消':'选择' }}
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange">
        </b-page>
      </b-col>
      <b-col span="8">
        <b-card class="box-card" head-tip header="已选部门">
          <b-tag :key="index"
                 closable type="primary"
                 v-for="(tag,index) in selectedList"
                 @on-close="handleCloseTag(index)">
            {{ tag.departName }}
          </b-tag>
          <b-button type="dashed"  style="width: 100%;margin: 10px 0;"
                    v-if="selectedList.length" @click="postSelectedList">
            确定分配
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </v-table-wrap>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getSelectedDeptList, postAddDept } from '../../../../../api/data-manage/res-dir.api'
  import { getDeptStatus, getDeptType } from '../../../../../api/enum.api'
  import * as api from '../../../../../api/sys/depart.api'

  export default {
    name: 'DeptChoose',
    mixins: [commonMixin, permission],
    data: function () {
      return {
        deptColumns: [
          { title: '组织名称', key: 'departName' },
          { title: '组织级别', slot: 'departKind' },
          { title: '选择', slot: 'isSelect', align: 'center' }
        ],
        list: [],
        treeData: [],
        currentTreeNode: {},
        listQuery: {
          departName: '',
          parentId: '',
          delFlag: ''
        },
        deptListLoading: false,
        deptMap: { 'DOMAIN': '机构', 'NORMAL': '一般组织' },
        selectedList: [],
        resId: ''
      }
    },
    created() {
      this.initTree()
    },
    computed: {
      ENUM() {
        return { DISABLE: 'D', ENABLE: 'Y', ORG: 'DOMAIN', NORMAL: 'NORMAL' } // 常量比对键值对
      }
    },
    methods: {
      postSelectedList() {
        let arr = []
        this.selectedList.forEach(item => arr.push(item.departId))
        const str = arr.join(',')
        postAddDept(this.resId, str).then(res => {
          this.searchSelected(this.resId)
          this.$message({ type: 'success', content: '操作成功' })
          this.$emit('on-add-success')
        })
      },
      handleCloseTag(index) {
        this.selectedList.splice(index, 1)
      },
      searchSelected(key) {
        getSelectedDeptList(key).then(
          res => {
            //  每次查询先清空当前data数据
            this.selectedList = []
            const list = res.data.data
            list.forEach(item => {
              this.selectedList.push({
                departName: item.departName,
                departId: item.departId
              })
            })
          }
        )
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
            this.listQuery.parentId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      checkRowSelected(row) {
        const dept = this.selectedList.find(item => {
          return item.departId === row.id
        })
        return !!dept
      },
      chooseOne(row) {
        let index = this.selectedList.findIndex(item => {
          return item.departId === row.id
        })
        if (index === -1) {
          this.selectedList.push({
            departId: row.id,
            departName: row.departName
          })
        } else {
          this.selectedList.splice(index, 1)
        }
      },
      open(key) {
        this.selectedList = []
        this.resId = key
        this.searchList(key)
        this.searchSelected(key)
      },
      /* [事件响应] */
      handDeptTreeCurrentChange(data, node) {
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
          status: this.ENUM.ENABLE,
          parentId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetDept()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetDept()
        this.depart = { ...this.depart, ...row }
        this.openEditPage('modify')
      },
      // 查看按钮事件
      handleCheck(row) {
        this.depart = { ...row }
        this.openEditPage('check')
      },
      // 单个启用禁用
      handleChangeStatusFlag(row) {
        let depart = { ...row }
        api.changeStatus(depart).then(res => {
          if (res.data.code === '0') {
            this.$message({ type: 'success', content: '操作成功' })
            this.initTree()
          } else {
            this.$message({ type: 'danger', content: '操作失败' })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let depart = { ...row }
        this.$confirm({
          title: '确实要删除当前部门吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeDepart(depart).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createDept : api.modifyDept
            fun(this.depart).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.initTree()
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
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
      // 重置对象
      resetDept() {
        this.depart = {
          id: '',
          parentId: this.currentTreeNode ? this.currentTreeNode.id : '',
          departName: '',
          departCode: '',
          departKind: '',
          regionId: '',
          sortNum: 0,
          unifiedCode: '',
          fullName: '',
          remark: ''
        }
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
