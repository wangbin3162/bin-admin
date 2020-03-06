<template>
  <!--树结构-->
  <v-table-wrap>
    <b-tree :data="treeData" slot="tree"
            @on-select-change="handMessengerTreeCurrentChange">
    </b-tree>
    <v-filter-bar>
      <v-filter-item title="资源名称">
        <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称(中文名)" clearable size="small"></b-input>
      </v-filter-item>
      <v-filter-item @on-search="handleFilter" @on-reset="handleReset"></v-filter-item>
    </v-filter-bar>
    <!--操作栏-->
    <v-table-tool-bar>
      <b-button v-if="canCreate" type="primary"
                v-waves size="small" icon="ios-add"
                @click="handleCreate">新 增
      </b-button>
    </v-table-tool-bar>
    <b-table :columns="resColumns" :data="list" :loading="listLoading">
      <!--操作栏-->
      <template v-slot:relate="scope">
        <b-button type="text" @click="cancelRelate(scope.row)">取消关联</b-button>
      </template>
    </b-table>
    <!--下方分页器-->
    <b-page :total="total" show-sizer
            @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
  </v-table-wrap>
</template>

<script>
  import * as api from '../../../../../api/sys/depart.api'
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { postDisassociate, getRelateResInfoList } from '../../../../../api/data-manage/res-dir.api'
  // 枚举
  import { getFieldCtrl } from '../../../../../api/enum.api'
  import { getPersonClassTree } from '../../../../../api/data-manage/metadata.api'
  import { getResPropertyTree } from '../../../../../api/data-manage/res-info.api'

  export default {
    name: 'ResMessenger',
    mixins: [commonMixin, permission],
    data() {
      return {
        treeData: [],
        resColumns: [
          { title: '资源名称', key: 'resName' },
          { title: '主体类别', key: 'personClass' },
          { title: '更新周期', key: 'updatePeriod', width: 100 },
          { title: '发布时间', key: 'publishDate' },
          { title: '操作', slot: 'relate', width: 100, align: 'center' }
        ],
        listLoading: false,
        personClassMap: {}, // 主体类别映射
        updateMap: {
          '0_IN_TIME_M': '实时',
          '1_IN_DAY_M': '每天',
          '2_IN_WEEK_M': '每周',
          '3_IN_MONTH_M': '每月',
          '4_IN_QUARTER_Q': '每季',
          '5_IN_YEAR_Y': '每年'
        }, // 更新周期#static
        dialogFormVisible: false,
        resPropertyOptions: {},
        resPropertyMap: {}
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
      handleReset() {
        this.listQuery.resourceName = ''
        this.searchList()
      },
      // 数源单位取消关联资源
      cancelRelate(param) {
        postDisassociate(param.departId, param.resId).then(res => {
          if (res.data.successful) {
            this.searchList()
          }
        })
      },
      handMessengerTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.departId = node.id
        this.handleFilter()
      },
      // 初始打开
      refresh() {
        this.searchList()
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
      },
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
          let data = tree[0] && tree[0].code === '10000' ? mapper(tree[0]) : []
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0].children[0]
            this.listQuery.departId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0].children[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.resetQuery()
          }
        })
      },
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          departName: '',
          status: this.ENUM.ENABLE,
          departId: this.currentTreeNode ? this.currentTreeNode.id : '',
          resourceName: ''
        }
        this.handleFilter()
      },
      searchList() {
        this.setListData()
        getRelateResInfoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 新增按钮事件
      handleCreate() {
        this.$emit('on-choose-res', this.listQuery.departId)
      }
    }
  }
</script>
