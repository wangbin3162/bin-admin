<template>
  <div class="source-select">
    <b-modal v-model="showDialog"
      title="选择资源" width="70%"
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap>
        <!-- tree -->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
        <!-- 查询 -->
        <v-filter-bar>
          <v-filter-item title="资源名称" :span="8">
            <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称(中文名)" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="资源性质" :span="8">
            <v-cascade :data="resPropertyOptions" v-model="listQuery.resProperty" style="width: 100%;"></v-cascade>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- table -->
        <div class="table">
          <b-table :columns="columns" :data="list" :loading="listLoading">
            <template v-slot:personClass="{row}">{{ personClassMap[row.personClass] }}</template>
            <template v-slot:resProperty="{row}">{{ resPropertyMap[row.resProperty] }}</template>
            <template v-slot:action="{ row }">
              <b-button type="text" @click="handleModify(row)">
                选择
              </b-button>
            </template>
          </b-table>
        </div>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
          :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getClassifyTree } from '../../../api/data-manage/classify.api'
  import { getPersonClassTree } from '../../../api/data-manage/metadata.api'
  import { getResInfoList, getResPropertyTree } from '../../../api/data-manage/res-info.api'

  export default {
    name: 'IndexManageEditSourceInfoSelect',
    mixins: [commonMixin, permission],
    props: {
      open: {
        type: Boolean
      },
      radio: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        personClassMap: {},
        resPropertyMap: {},
        resPropertyOptions: [],
        listQuery: {
          resourceCode: '', // 所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: '', // 可用状态
          status: '' // 状态
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '资源性质', slot: 'resProperty', align: 'center' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ]
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created () {
      // this.getEnum()
      // this.initTree()
    },
    methods: {
      // b-modal组件的可视状态事件回调
      handleVisibleChange (visible) {
        if (visible) {
          this.getEnum()
          this.initTree()
        } else {

        }
      },
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.handleFilter()
      },
      // 重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '' // 资源性质
        }
        this.handleFilter()
      },
      // 通用枚举
      getEnum() {
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
            // this.personClassOptions = data.children || []
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              this.personClassMap[item.key] = item.value
            })
            console.log(this.personClassMap)
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
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .source-select {
    .table {
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
