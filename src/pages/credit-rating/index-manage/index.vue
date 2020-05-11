<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 树结构 -->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="指标性质">
            <b-select v-model="listQuery.nature" clearable>
              <b-option v-for="item in natureOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </v-filter-item>
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="{ row }">
            <b-button type="text" @click="handleCheck(row)">{{ row.name }}</b-button>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              编辑
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" text-color="danger" @click="handleRemove(row.id)">
                删除
            </b-button>
          </template>
        </b-table>
        <!-- 下方分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!-- 编辑 -->
    <Edit v-if="isEdit" :title="editTitle" @close="handleClose"
      :natureOptions="natureOptions" :dataTypeOptions="dataTypeOptions"
      :calcTypeOptions="calcTypeOptions" :scaleOptions="scaleOptions"
      :treeData="treeData" :editData="editData"></Edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from '@/pages/credit-rating/index-manage/Edit'
  import { getIndexManageTree, getIndexManageList, deleteIndexManage } from '../../../api/credit-rating/index-manage.api'
  import { getEvalNature, getEvalDataType, getEvalCalcType, getEvalScale } from '../../../api/enum.api'
  import { enumToOptions } from '../../../common/utils/util'

  export default {
    name: 'IndexManage',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        moduleName: '指标',
        treeData: [],
        listQuery: {
          indexName: '',
          bizType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '编码', key: 'indexCode' },
          { title: '名称', slot: 'indexName' },
          { title: '指标性质', key: 'indexKind' },
          // { title: '描述', slot: 'indexDesc' },
          // { title: '指标分类', slot: 'bizType' },
          { title: '标度', key: 'scale' },
          { title: '有效期限', key: 'validMonth' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        editData: null, // 待编辑数据
        natureEnum: {}, // 指标性质枚举
        dataTypeEnum: {}, // 数据类型枚举
        calcTypeEnum: {}, // 计算类型枚举
        scaleEnum: {}, // 标度枚举
        natureOptions: [],
        dataTypeOptions: [],
        calcTypeOptions: [],
        scaleOptions: []
      }
    },
    created () {
      this.getEnum()
      this.initTree()
    },
    methods: {
      handTreeCurrentChange (data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.bizType = node.id
        this.handleFilter()
      },
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          indexName: '',
          bizType: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      handleRemove (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前指标吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const [success, errorMsg] = await deleteIndexManage(id)
              if (success) {
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$notice.danger({ title: '操作错误', desc: errorMsg })
              }
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      handleClose () {
        this.editData = null // 关闭编辑框的时候情况编辑数据
        this.handleCancel()
      },
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexManageList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },
      // 获取所需枚举值
      async getEnum () {
        try {
          const [natureEnum, dataTypeEnum, calcTypeEnum, scaleEnum] = await Promise.all([
            getEvalNature(), getEvalDataType(), getEvalCalcType(), getEvalScale()
          ])
          this.natureOptions = enumToOptions(natureEnum)
          this.dataTypeOptions = enumToOptions(dataTypeEnum)
          this.calcTypeOptions = enumToOptions(calcTypeEnum)
          this.scaleOptions = enumToOptions(scaleEnum)
        } catch (error) {
          this.$log.pretty('getEnum Error', error, 'danger')
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getIndexManageTree().then(response => {
          const tree = response.data
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
            this.listQuery.bizType = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      }
    }
  }
</script>
