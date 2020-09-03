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
            <b-input v-model.trim="listQuery.jobName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!-- <v-filter-item title="运行状态">
            <b-select v-model="listQuery.esSyncStatus" clearable>
              <b-option v-for="(value, key) in esSyncStatusEnum" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item> -->
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button v-if="havePermission('batchSync')" type="primary"
            @click="handleBatchAsyncBtn">
            + 批量同步
          </b-button>
        </v-table-tool-bar>

        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:latestExeTime="{ row }">
            <span v-if="row.exeCount === 0" style="color: #bfbfbf;">
              暂未同步
            </span>
            <span v-else>
              {{ $util.parseTime(new Date(row.latestExeTime), '{y}-{m}-{d} {h}:{m}:{s}') }}
            </span>
          </template>

          <template v-slot:exeStatus="{ row }">
            <b-tag v-if="row.exeCount === 0" type="info" dot no-border
              :key="row.exeStatus">
              <span style="color: #bfbfbf;">
                暂未同步
              </span>
            </b-tag>
            <b-tag v-else :type="{
              COMPLETED: 'success',
              STARTED: 'primary',
              FAILED: 'danger'
            }[row.exeStatus]" dot no-border :key="row.exeStatus">
              {{ esSyncStatusEnum[row.exeStatus] }}
            </b-tag>
          </template>

          <!-- 操作栏 -->
          <template v-slot:action="{ row }">
            <b-button type="text" :disabled="!havePermission('viewTask') || row.exeCount === 0"
              @click="handleViewTaskBtn(row)">
              查看任务
            </b-button>

            <b-divider type="vertical"></b-divider>

            <b-button type="text"
              :disabled="!havePermission('sync')"
              @click="handleAsyncBtn(row)">
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

    <sync-record v-if="dialogStatus === 'syncRecord'"
      :resourceKey="curRow !== null ? curRow.resourceKey : null"
      @close="handleCancel">
    </sync-record>

    <sync-set-dialog v-model="openSyncSetDialog"
      :resourceKey="curRow !== null ? curRow.resourceKey : null"
      @success="searchList">
    </sync-set-dialog>

    <batch-sync-set-dialog v-model="openBatchSyncSetDialog"
      @success="searchList">
    </batch-sync-set-dialog>

  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import commonMixin from '@/common/mixins/mixin'
  import permission from '@/common/mixins/permission'
  import {
    getClassifyTree, getResourcesSyncResult
  } from '@/api/data-manage/es-exchange.api'
  import SyncRecord from '@/pages/data-manage/data-exchange/es-exchange/SyncRecord'
  import SyncSetDialog from '@/pages/data-manage/data-exchange/components/EsExchange/SyncSetDialog'
  import BatchSyncSetDialog from '@/pages/data-manage/data-exchange/components/EsExchange/BatchSyncSetDialog/index'

  export default {
    name: 'EsExchange',
    mixins: [commonMixin, permission],
    components: {
      SyncRecord,
      SyncSetDialog,
      BatchSyncSetDialog
    },
    data () {
      return {
        treeLoading: false,
        openSyncSetDialog: false,
        openBatchSyncSetDialog: false,
        treeData: [],
        listQuery: {
          jobName: '',
          esSyncStatus: '',
          resourceCode: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName', ellipsis: true, tooltip: true },
          { title: '执行次数', key: 'exeCount', align: 'center' },
          { title: '执行时间(最近)', slot: 'latestExeTime', align: 'center' },
          { title: '运行状态(最近)', slot: 'exeStatus', align: 'left' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        curRow: null // 当前行数据
      }
    },
    computed: {
      ...mapState({
        esSyncStatusEnum: state => state.esExchange.esSycnStatus,
        personClassEnum: state => state.esExchange.personClass,
        resPropertyEnum: state => state.esExchange.resProperty
      })
    },
    created () {
      this.init()
    },
    methods: {
      ...mapMutations({
        setPersonClass: 'SET_PERSON_CLASS',
        setResProperty: 'SET_RES_PROPERTY',
        setResPropertyOptions: 'SET_RES_PROPERTY_OPTIONS'
      }),
      /**
       * @author haodongdong
       * @descriptiong 一些初始化处理
       */
      async init () {
        this.getResPropertyEnum()
        this.getPersonClassEnum()
        await this.getClassifyTree()
        this.searchList()
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
          this.listQuery.resourceCode = this.currentTreeNode.code
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
            this.setPersonClass(keyValue)
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
            this.setResProperty(keyValue)
            this.setResPropertyOptions(data.children || [])
            resolve(keyValue)
          } catch (error) {
            reject(error)
          }
        })
      },

      /**
       * @author haodongdong
       * @description 获取右侧列表信息
       */
      async searchList() {
        this.listLoading = true
        try {
          const res = await getResourcesSyncResult(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
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
        } else {
          this.listQuery.resourceCode = node.code
          this.handleFilter()
        }
        this.currentTreeNode = node
      },

      // 重置查询
      resetQuery () {
        this.listQuery.jobName = ''
        this.listQuery.esSyncStatus = ''
        this.listQuery.size = 10
        this.listQuery.page = 1
        this.handleFilter()
      },

      /**
       * @author haodongdong
       * @description 批量同步按钮回调
       */
      handleBatchAsyncBtn () {
        this.openBatchSyncSetDialog = true
      },

      /**
       * @author haodongdong
       * @description 查看任务按钮回调
       * @param {Object} row 当前行数据
       */
      handleViewTaskBtn (row) {
        this.curRow = row
        this.dialogStatus = 'syncRecord'
      },

      /**
       * @author haodongdong
       * @description 同步按钮回调
       * @param {Object} row 当前行数据
       */
      handleAsyncBtn (row) {
        this.curRow = row
        this.openSyncSetDialog = true
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
