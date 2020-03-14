<template>
  <!--选择资源 for SwitchingMission.vue -->
  <div>
    <div flex="box:last">
      <b-input v-model="current" placeholder="选择填充" readonly clearable
               @on-clear="handleClear"></b-input>
      <b-button type="primary"  @click="handleShowModal"
                style="padding: 10px;margin-left: 0;font-size: 12px;">
        选择
      </b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择资源" width="1020" class="layout-inner" :mask-closable="false">
      <v-table-wrap style="padding: 0;">
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="资源名称" :span="12">
            <b-input v-model.trim="listQuery.resourceName"  placeholder="资源名称(中文名)" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" >
          <template v-slot:sharedType="scope">{{ shareMap[scope.row.sharedType] }}</template>
          <template v-slot:status="scope">{{ resStatusMap[scope.row.status] }}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="primary" plain @click="chooseOne(scope.row)">
              选择
            </b-button>
          </template>
        </b-table>
      </v-table-wrap>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getFields, getResInfoList } from '../../../../../api/data-manage/res-info.api'
  import { getClassifyTree } from '../../../../../api/data-manage/classify.api'

  export default {
    name: 'ResChoose',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: String,
        default: ''
      },
      defaultName: {
        type: String,
        default: ''
      },
      dsId: {
        type: String,
        required: true
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
        dialogFormVisible: false,
        listQuery: {
          resourceCode: '', // 所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: 'available', // 可用状态
          status: 'audited'// 状态
        },
        treeData: [],
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '共享属性', slot: 'sharedType', width: 100, align: 'center' },
          { title: '资源状态', slot: 'status', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        current: '',
        resStatusMap: { edit: '草稿', audited: '已发布', closed: '已删除' }, // 资源状态映射 #static
        shareMap: { PUBLIC: '共享', PRIVATE: '不共享', DEPART_RANGE: '有条件共享' } // 共享属性 #static
      }
    },
    created() {
      this.initTree()
    },
    methods: {
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: 'available', // 可用状态
          status: 'audited'// 状态
        }
        this.handleFilter()
      },
      handleShowModal() {
        if (!this.dsId || this.dsId.length === 0) {
          this.$message({ type: 'danger', content: '没有选择方案' })
          return
        }
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(item) {
        // 获取资源信息字段列表
        getFields(item.resourceKey).then(res => {
          this.$emit('input', item.resourceKey)
          this.$emit('on-change', {
            resourceKey: item.resourceKey,
            resourceName: item.resourceName,
            metadataKey: item.metadataKey,
            fields: res.data || []
          })
        })
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', { resourceKey: '', resourceName: '', metadataKey: '', fields: [] })
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getClassifyTree('C').then(response => {
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
            this.listQuery.resourceCode = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      },
      // 查询所有数据源信息
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
      }
    }
  }
</script>
