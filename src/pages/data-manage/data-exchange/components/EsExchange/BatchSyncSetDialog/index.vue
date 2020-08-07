<template>
  <div class="batch-async-set-dialog">
    <b-modal v-model="open" title="批量设置同步条件"
      footer-hide
      width="75%"
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">

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

        <b-row :gutter="15">
          <b-col span="15">
            <!-- 查询条件 -->
            <v-filter-bar @keyup-enter="handleFilter">
              <v-filter-item title="资源名称" :span="8">
                <b-input v-model.trim="listQuery.resName" placeholder="请输入" clearable></b-input>
              </v-filter-item>
              <v-filter-item title="资源性质" :span="8">
                <b-select v-model="listQuery.status" clearable>
                  <!-- <b-option v-for="(value, key) in runStatusEmun" :key="key" :value="key">
                    {{ value }}
                  </b-option> -->
                </b-select>
              </v-filter-item>
              <!-- 添加查询按钮位置 -->
              <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
            </v-filter-bar>

            <!-- 中央表格 -->
            <b-table :columns="columns" :data="[{a: 1}, {a: 1}, {a: 1}, {a: 1}]" :loading="listLoading" size="small">
              <!-- 操作栏 -->
              <template v-slot:action="{ row }">
                <b-button type="primary" plain size="small" :disabled="isAllRes"
                  @click="handleSelectedBtn(row)">
                    选择
                </b-button>
              </template>
            </b-table>

            <!-- 下方分页器 -->
            <b-page :total="total" :current.sync="listQuery.page" size="small"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange">
            </b-page>
          </b-col>

          <b-col span="9" class="card-con">
            <set-con :initResources="selectedRows"
              @res-change="handleResChange"
              @select-status-change="status => isAllRes = status">
            </set-con>
          </b-col>
        </b-row>

      </v-table-wrap>

    </b-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import commonMixin from '@/common/mixins/mixin'
  import permission from '@/common/mixins/permission'
  import { getClassifyTree } from '@/api/data-manage/es-exchange.api'
  import SetCon from '@/pages/data-manage/data-exchange/components/EsExchange/BatchSyncSetDialog/SetCon'

  export default {
    name: 'BatchSyncSetDialog',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: Boolean,
        required: true
      },
      id: {
        type: String
      }
    },
    components: {
      SetCon
    },
    data () {
      return {
        open: this.value,
        treeLoading: false,
        treeData: [],
        listQuery: {
          resName: '',
          resNature: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: '', ellipsis: true, tooltip: true },
          { title: '主体类别', key: '' },
          { title: '资源性质', key: '' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        selectedRows: [], // 存储已选择的行数据
        isAllRes: false
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {Boolean} visible 显示状态
       */
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.currentTreeNode = null
          this.treeData = []
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @descriptiong 一些初始化处理
       */
      init () {
        this.getClassifyTree()
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

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       */
      handleSelectedBtn (row) {
        this.selectedRows.push(row)
      },

      /**
       * @author haodongdong
       * @description set-con组件res-change事件回调
       * @param {Array} resList 改变后的数组
       */
      handleResChange (resList) {
        console.log(resList)
        this.selectedRows = resList
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
