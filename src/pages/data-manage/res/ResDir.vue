<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <b-tabs v-model="activeTab" :data="tabs" type="card"></b-tabs>
      <v-table-wrap v-show="activeTab==='tab1'">
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称(中文名)" clearable size="small"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="handleReset"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--主体类别-->
          <template v-slot:personClass="scope">{{ personClassMap[scope.row.personClass] }}</template>
          <!--更新周期-->
          <template v-slot:updatePeriod="scope">{{ updateMap[scope.row.updatePeriod] }}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleDivideDept(scope.row)">
              分配部门
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
      <!--信源单位-->
      <ResMessenger v-show="activeTab==='tab2'" @on-choose-res="handleChooseRes"
                    ref="resMessenger"></ResMessenger>
    </page-header-wrap>
    <!--分配部门-->
    <page-header-wrap v-show="dialogStatus==='divideDept'" title="分配部门" show-close @on-close="handleCancel">
      <dept-choose ref="deptChoose" @on-add-success="handleChooseDeptOK"></dept-choose>
    </page-header-wrap>
    <!--给部门添加资源-->
    <page-header-wrap v-show="dialogStatus==='chooseRes'" title="部门添加资源" show-close @on-close="handleCancel">
      <res-choose ref="resChoose" @on-add-success="handleChooseResOK"></res-choose>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getClassifyTree } from '../../../api/data-manage/classify.api'
  import { getPersonClassTree, getResInfoList } from '../../../api/data-manage/res-dir.api'
  import { getFieldCtrl } from '../../../api/enum.api'
  import * as api from '../../../api/data-manage/res-info.api'
  import DeptChoose from './components/ResDir/DeptChoose'
  import ResChoose from './components/ResDir/ResChoose'
  import ResMessenger from './components/ResDir/ResMessenger'

  export default {
    name: 'ResDir',
    components: { DeptChoose, ResChoose, ResMessenger },
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '资源目录',
        listQuery: {
          resourceName: '', // 资源名称(中文名)
          status: 'audited', // 状态
          availableStatus: 'available', // 可用状态
          resProperty: '', // 资源性质
          resourceCode: '', // 所属分类
          id: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '更新周期', slot: 'updatePeriod', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 180 }
        ],
        personClassMap: {}, // 主体类别映射
        resPropertyMap: {}, // 资源性质映射
        shareMap: { PUBLIC: '共享', PRIVATE: '不共享', DEPART_RANGE: '有条件共享' }, // 共享属性 #static
        updateMap: {
          '0_IN_TIME_M': '实时',
          '1_IN_DAY_M': '每天',
          '2_IN_WEEK_M': '每周',
          '3_IN_MONTH_M': '每月',
          '4_IN_QUARTER_Q': '每季',
          '5_IN_YEAR_Y': '每年'
        }, // 更新周期#static
        dialogFormVisible: false,
        toggle: false,
        modalFlag: false,
        currentDeptTreeNode: '',
        tabs: [
          { key: 'tab1', title: '资源目录' },
          { key: 'tab2', title: '信源单位' }
        ],
        activeTab: 'tab1'
      }
    },
    created() {
      this.initTree()
      this.getEnum()
    },
    methods: {
      handleReset() {
        this.listQuery.resourceName = ''
        this.searchList()
      },
      // 打开分配部门页面
      handleDivideDept(row) {
        this.dialogStatus = 'divideDept'
        this.$refs.deptChoose.open(row.resourceKey)
      },
      handleChooseDeptOK() {
        this.dialogStatus = ''
        this.searchList()
      },
      // 打开部门添加资源页面
      handleChooseRes(departId) {
        this.dialogStatus = 'chooseRes'
        this.$refs.resChoose.open(departId)
      },
      handleChooseResOK() {
        this.dialogStatus = ''
        this.$refs.resMessenger.refresh()
      },
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.handleFilter()
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getClassifyTree('C').then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.resourceCode = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      },
      // 树节点格式化mapper
      treeMapper(node, parentId) {
        // 当前id
        const currentId = node.id
        let parents = parentId ? parentId.split(',') : []
        parents.push(currentId)
        let child = []
        if (node.children) {
          node.children.forEach(item => {
            child.push(this.treeMapper(item, parents.join(',')))
          })
        }
        // 是否是选中状态
        let isSelect = this.currentTreeNode ? this.currentTreeNode.id === currentId : false
        // 是否是展开状态，根据当前选择的节点中的parents数组来判定自身和父级的展开状态
        let isExpand = this.currentTreeNode ? this.currentTreeNode.parents.includes(currentId) : false
        return {
          id: node.id,
          title: node.text,
          code: node.code,
          parents: parents, // 配合级联展开时使用
          selected: isSelect,
          expand: isExpand, // 先全部打开,后再进行比对关闭
          children: child
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        getResInfoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 通用枚举
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
        api.getResPropertyTree().then(res => {
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
