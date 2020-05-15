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
          <template v-slot:indexName="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">{{ row.indexName }}</b-button>
          </template>
          <template v-slot:indexKind="{ row }">
            {{ natureEnum[row.indexKind] }}
          </template>
          <template v-slot:indexScale="{ row }">
            {{ scaleEnum[row.indexScale] }}
          </template>
          <template v-slot:validMonth="{ row }">
            {{ row.validMonth }} 月
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
    <edit v-if="isEdit" @close="handleClose" @success="searchList"
      :title="editTitle"
      :natureOptions="natureOptions"
      :dataTypeOptions="dataTypeOptions"
      :calcTypeOptions="calcTypeOptions"
      :scaleOptions="scaleOptions"
      :scaleEnum="scaleEnum"
      :personClassEnum="personClassEnum"
      :resPropertyEnum="resPropertyEnum"
      :paramTypeEnum="paramTypeEnum"
      :treeData="treeData"
      :editData="editData"></edit>
      <!-- 详情 -->
    <detail v-if="isCheck" @close="handleCancel"
      :title="editTitle" :id="id"
      :natureEnum="natureEnum"
      :dataTypeEnum="dataTypeEnum"
      :calcTypeEnum="calcTypeEnum"
      :scaleEnum="scaleEnum"
      :personClassEnum="personClassEnum"
      :resPropertyEnum="resPropertyEnum"
      :paramTypeEnum="paramTypeEnum"></detail>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import Detail from './Detail'
  import { getIndexManageTree, getIndexManageList, deleteIndexManage } from '../../../api/credit-rating/index-manage.api'
  import { getEvalNature, getEvalDataType, getEvalCalcType, getEvalScale, getEvalParamType } from '../../../api/enum.api'
  import { getPersonClassTree } from '../../../api/data-manage/metadata.api'
  import { getResPropertyTree } from '../../../api/data-manage/res-info.api'
  import { enumToOptions } from '../../../common/utils/util'

  export default {
    name: 'IndexManage',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail
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
          { title: '编码', key: 'indexCode', align: 'center' },
          { title: '名称', slot: 'indexName', align: 'center' },
          { title: '指标性质', slot: 'indexKind', align: 'center' },
          // { title: '描述', slot: 'indexDesc' },
          // { title: '指标分类', slot: 'bizType' },
          { title: '标度', slot: 'indexScale', align: 'center' },
          { title: '有效期限', slot: 'validMonth', align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        id: null, // 详情组件使用的获取详情的id
        editData: null, // 待编辑数据
        natureEnum: {}, // 指标性质枚举
        dataTypeEnum: {}, // 数据类型枚举
        calcTypeEnum: {}, // 计算类型枚举
        scaleEnum: {}, // 标度枚举
        personClassEnum: {}, // 主体类别枚举
        resPropertyEnum: {}, // 资源性质枚举
        paramTypeEnum: {}, // 参数类型枚举
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
      // 树节点选择改变回调
      handTreeCurrentChange (data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.bizType = node.code
        this.handleFilter()
      },
      // 重置查询
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          indexName: '',
          bizType: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
      },
      // 新增按钮回调
      handleCreate () {
        this.openEditPage('create')
      },
      // 修改按钮回调
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      // 删除按钮回调
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
      // 查看详情回调
      handleCheck (id) {
        this.id = id
        this.openEditPage('check')
      },
      // 编辑组件关闭回调
      handleClose () {
        this.editData = null // 关闭编辑框的时候情况编辑数据
        this.handleCancel()
      },
      // 获取主体类别枚举
      async getPersonClassEnum() {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getPersonClassTree()
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
            // 转换类型映射值（扁平化）
            const keyValue = {}
            personClasses.forEach(item => {
              keyValue[item.key] = item.value
            })
            resolve(keyValue)
          } catch (error) {
            reject(error)
          }
        })
      },
      // 获取资源性质枚举
      async getResPropertyEnum () {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getResPropertyTree()
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
            // 转换类型映射值（扁平化）
            const keyValue = {}
            temp.forEach(item => {
              keyValue[item.key] = item.value
            })
            resolve(keyValue)
          } catch (error) {
            reject(error)
          }
        })
      },
      // 获取列表
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
          const [
            natureEnum, dataTypeEnum, calcTypeEnum, scaleEnum,
            paramTypeEnum, personClassEnum, resPropertyEnum
          ] = await Promise.all([
            getEvalNature(), getEvalDataType(), getEvalCalcType(), getEvalScale(),
            getEvalParamType(), this.getPersonClassEnum(), this.getResPropertyEnum()
          ])
          this.natureEnum = natureEnum
          this.dataTypeEnum = dataTypeEnum
          this.calcTypeEnum = calcTypeEnum
          this.scaleEnum = scaleEnum
          this.paramTypeEnum = paramTypeEnum
          this.personClassEnum = personClassEnum
          this.resPropertyEnum = resPropertyEnum
          // 后续改成直接v-for对象
          this.natureOptions = enumToOptions(natureEnum)
          this.dataTypeOptions = enumToOptions(dataTypeEnum)
          this.calcTypeOptions = enumToOptions(calcTypeEnum)
          this.scaleOptions = enumToOptions(scaleEnum)
        } catch (error) {
          console.error(error)
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
            this.listQuery.bizType = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      }
    }
  }
</script>
