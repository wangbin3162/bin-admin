<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 树结构 -->
        <div slot="tree" style="position: relative;">
          <b-tree :data="treeData"
            :lock-select="lockTreeSelect"
            @on-select-change="handTreeCurrentChange">
          </b-tree>
          <b-loading fix show-text="加载中...." v-if="treeLoading">
          </b-loading>
        </div>

        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="运行状态">
            <b-select v-model="listQuery.status" clearable>
              <b-option v-for="(value, key) in runStatusEmun" :key="key" :value="key">
                {{ value }}
              </b-option>
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
          <b-button @click="handleViewTaskBtn">test</b-button>
          <b-button @click="openAsyncSetDialog = true">test</b-button>
          <b-button @click="openBatchAsyncSetDialog = true">test</b-button>
        </v-table-tool-bar>

        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!-- 操作栏 -->
          <template v-slot:action>
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

    <async-record v-if="dialogStatus === 'asyncRecord'"
      @close="handleCancel">
    </async-record>

    <async-set-dialog v-model="openAsyncSetDialog">
    </async-set-dialog>

    <batch-async-set-dialog v-model="openBatchAsyncSetDialog">
    </batch-async-set-dialog>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import commonMixin from '@/common/mixins/mixin'
  import permission from '@/common/mixins/permission'
  import { getClassifyTree } from '@/api/data-manage/es-exchange.api'
  import AsyncRecord from '@/pages/data-manage/data-exchange/es-exchange/AsyncRecord'
  import AsyncSetDialog from '@/pages/data-manage/data-exchange/components/EsExchange/AsyncSetDialog'
  import BatchAsyncSetDialog from '@/pages/data-manage/data-exchange/components/EsExchange/BatchAsyncSetDialog/index'

  export default {
    name: 'EsExchange',
    mixins: [commonMixin, permission],
    components: {
      AsyncRecord,
      AsyncSetDialog,
      BatchAsyncSetDialog
    },
    data () {
      return {
        treeLoading: false,
        openAsyncSetDialog: false,
        openBatchAsyncSetDialog: false,
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
    computed: {
      ...mapState({
        runStatusEmun: state => state.esExchange.runStatus
      })
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @descriptiong 一些初始化处理
       */
      init () {
        this.getClassifyTree()
        this.getResPropertyEnum()
        this.getPersonClassEnum()
      },

      /**
       * @author haodongdong
       * @description 获取类目信息树
       */
      async getClassifyTree () {
        this.treeLoading = true
        try {
          const res = await getClassifyTree('C')
          this.treeData = this.buildTree(res)
          this.currentTreeNode = this.treeData[0]
        } catch (error) {
          console.error(error)
        }
        this.treeLoading = false
      },

      /**
       * @author haodongdong
       * @description 获取主体类别枚举
       */
      async getPersonClassEnum(code = 'A') {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getClassifyTree(code)
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res
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
            console.log(keyValue)
            resolve(keyValue)
          } catch (error) {
            reject(error)
          }
        })
      },

      /**
       * @author haodongdong
       * @description 获取资源性质枚举
       */
      async getResPropertyEnum (code = 'B') {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await getClassifyTree(code)
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res
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
            console.log(keyValue)
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

      /**
       * @author haodongdong
       * @description 树节点选择改变回调
       * @param {Array} nodes 选中的节点数组
       * @param {Object} node 当前节点
       */
      handTreeCurrentChange (nodes, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        // this.handleFilter()
      },

      // 重置查询
      resetQuery () {

      },

      handleBatchAsyncBtn () {

      },

      /**
       * @author haodongdong
       * @description 查看任务按钮回调
       */
      handleViewTaskBtn () {
        this.dialogStatus = 'asyncRecord'
      },

      handleAsyncBtn () {

      },

      /**
       * @author haodongdong
       * @description 构建左侧树，简单的过滤称需要的结构
       * @param {Object} treeNode 树节点
       */
      buildTree (treeNode) {
        treeNode.selected = true
        treeNode.expand = true
        treeNode.title = treeNode.text
        treeNode.children.forEach(node => {
          node.selected = false
          node.expand = false
          node.children = []
          node.title = node.text
        })
        return [treeNode]
      }

    }
  }
</script>
