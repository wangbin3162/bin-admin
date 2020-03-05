<template>
  <v-table-wrap>
    <b-tree :data="treeData" slot="tree"
            @on-select-change="handResTreeCurrentChange">
    </b-tree>
    <b-row :gutter="15">
      <b-col span="16">
        <b-table :columns="columns" :data="list" :loading="deptListLoading">
          <!--主体类别-->
          <template v-slot:personClass="scope">{{ personClassMap[scope.row.personClass] }}</template>
          <!--资源性质-->
          <template v-slot:resProperty="scope">{{ resPropertyMap[scope.row.resProperty] }}</template>
          <!--操作-->
          <template v-slot:isSelect="scope">
            <b-button size="mini" :type="checkRowSelected(scope.row)?'danger':'primary'" plain
                      @click="chooseOne(scope.row)">
              {{checkRowSelected(scope.row)?'取消':'选择'}}
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange">
        </b-page>
      </b-col>
      <b-col span="8">
        <b-card class="box-card" head-tip header="已选资源信息">
          <b-tag
            :key="index"
            v-for="(tag,index) in selectedList"
            closable
            @on-close="handleCloseTag(index)">
            {{tag.resName}}
          </b-tag>
          <b-button type="warning" size="small" transparent style="width: 100%;margin: 10px 0;"
                    v-if="selectedList.length" @click="postSelectedList">
            确定添加
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </v-table-wrap>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import {
    getResClassifyTree,
    getSelectedResList,
    getNoRelateResInfoList,
    postAddResources
  } from '../../../../../api/data-manage/res-dir.api'
  import { getPersonClassTree } from '../../../../../api/data-manage/metadata.api'
  import { getResPropertyTree } from '../../../../../api/data-manage/res-info.api'
  import { getDeptStatus, getDeptType, getFieldCtrl } from '../../../../../api/enum.api'
  import * as api from '../../../../../api/sys/depart.api'

  export default {
    name: 'ResChoose',
    mixins: [commonMixin, permission],
    data: function () {
      return {
        // 表格行列设置
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '主体类别', slot: 'personClass' },
          { title: '资源性质', slot: 'resProperty' },
          { title: '选择', slot: 'isSelect', align: 'center', width: 88 }
        ],
        treeData: [],
        listQuery: {
          resourceCode: '', // 所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: 'available', // 可用状态
          status: 'audited' // 状态
        },
        deptListLoading: false,
        deptMap: { 'DOMAIN': '机构', 'NORMAL': '一般组织' },
        selectedList: [],
        personClassMap: {},
        personClassOptions: {},
        shareMap: { PUBLIC: '共享', PRIVATE: '不共享', DEPART_RANGE: '有条件共享' }, // 共享属性 #static
        openMap: { '1': '是', '0': '否' }, // 开放属性#static
        updateMap: {
          '0_IN_TIME_M': '实时',
          '1_IN_DAY_M': '每天',
          '2_IN_WEEK_M': '每周',
          '3_IN_MONTH_M': '每月',
          '4_IN_QUARTER_Q': '每季',
          '5_IN_YEAR_Y': '每年'
        }, // 更新周期#static
        resPropertyMap: {}, // 资源性质映射
        departId: ''
      }
    },
    created() {
      this.getEnum()
      this.initTree()
    },
    computed: {
      ENUM() {
        return { DISABLE: 'D', ENABLE: 'Y', ORG: 'DOMAIN', NORMAL: 'NORMAL' } // 常量比对键值对
      }
    },
    methods: {
      handleCloseTag(index) {
        this.selectedList.splice(index, 1)
      },
      searchSelected(key) {
        getSelectedResList(key).then(res => {
          const list = res.data.rows
          this.selectedList = []
          list.forEach(
            item => {
              this.selectedList.push({
                resName: item.resName,
                resId: item.resId
              })
            }
          )
        })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getResClassifyTree().then(response => {
          const tree = response.data.data
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
            this.handleFilter()
          }
        })
      },
      // 树节点格式化mapper
      checkRowSelected(row) {
        const dept = this.selectedList.find(item => {
          return item.resId === row.resourceKey
        })
        return !!dept
      },
      chooseOne(row) {
        let index = this.selectedList.findIndex(item => {
          return item.resId === row.resourceKey
        })
        if (index === -1) {
          this.selectedList.push({
            resId: row.resourceKey,
            resName: row.resourceName
          })
        } else {
          this.selectedList.splice(index, 1)
        }
      },
      open(key) {
        this.getEnum()
        this.departId = key
        this.searchList()
      },
      cancelOutTreeLock() {
        this.$emit('cancelTreeLock')
      },
      postSelectedList() {
        let arr = []
        if (this.selectedList.length > 0) {
          this.selectedList.forEach(item => arr.push(item.resId))
          const str = arr.join(',')
          postAddResources(this.departId, str).then(res => {
            this.selectedList = []
            this.cancelOutTreeLock()
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('on-add-success')
          })
        }
      },
      /* [事件响应] */
      handResTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.listQuery.page = 1
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
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
                this.$message({ type: 'danger', content: res.data.message })
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
      // 查询所有资源列表
      searchList() {
        this.setListData()
        getNoRelateResInfoList(this.departId, this.currentTreeNode.code).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      getEnum() {
        // 资源信息项控件类型枚举
        getFieldCtrl().then(res => {
          if (res.status === 200) {
            this.fieldCtrlMap = res.data.data
          }
        })
        // 主体类别树信息 code=A
        getPersonClassTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let personClasses = []
            let mapper = (node, parentCode) => {
              personClasses.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            this.personClassOptions = data.children || []
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              this.personClassMap[item.key] = item.value
            })
          }
        })
        // 资源性质树信息 code=B
        getResPropertyTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let temp = []
            let mapper = (node, parentCode) => {
              temp.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            this.resPropertyOptions = data.children || []
            // 转换类型映射值（扁平化）
            temp.forEach(item => {
              this.resPropertyMap[item.key] = item.value
            })
          }
        })
      }
    }
  }
</script>
