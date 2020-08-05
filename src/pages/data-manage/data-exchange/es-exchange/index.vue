<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 树结构 -->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>

        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="运行状态">
            <b-select v-model="listQuery.status" clearable>

            </b-select>
          </v-filter-item>
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary"
            @click="handleBatchAsyncBtn">
            + 批量同步
          </b-button>
        </v-table-tool-bar>

        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!-- 操作栏 -->
          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleViewTaskBtn">
              查看任务
            </b-button>

            <b-divider type="vertical"></b-divider>

            <b-button type="text" text-color="danger" @click="handleAsyncBtn">
                同步
            </b-button>
          </template>
        </b-table>

        <!-- 下方分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getPersonClassTree } from '../../../../api/data-manage/metadata.api'
  import { getResPropertyTree } from '../../../../api/data-manage/res-info.api'

  export default {
    name: 'EsExchange',
    mixins: [commonMixin, permission],
    components: {

    },
    data () {
      return {
        treeData: [],
        listQuery: {
          resName: '',
          status: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: '', ellipsis: true, tooltip: true },
          { title: '执行次数', key: '' },
          { title: '执行时间(最近)', key: '' },
          { title: '运行状态(最近)', key: '' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ]
      }
    },
    created () {

    },
    methods: {
      // 树节点选择改变回调
      handTreeCurrentChange (data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node

        this.handleFilter()
      },

      // 重置查询
      resetQuery () {

      },

      handleBatchAsyncBtn () {

      },

      handleViewTaskBtn () {

      },

      handleAsyncBtn () {

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
        try {
          // const res = await getIndexManageList(this.listQuery)
          // this.setListData({
          //   list: res.rows,
          //   total: res.total
          // })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },

      // 获取所需枚举值
      async getEnum () {
        try {

        } catch (error) {
          console.error(error)
        }
      },

      // tree:初始化树结构
      initTree() {

      }

    }
  }
</script>
