<template>
  <b-modal v-model="open" title="选择行政区域" width="860"
    append-to-body :mask-closable="false"
    @on-visible-change="handleVisibleChange">
    <v-table-wrap>
      <div slot="tree" class="tree">
        <b-tree v-if="!treeLoading" :data="treeData"
          @on-select-change="handleTreeNodeSelect">
        </b-tree>
        <b-loading showText="加载中..." v-if="treeLoading"></b-loading>
      </div>

      <v-filter-bar @keyup-enter="handleFilter">
        <v-filter-item title="类别名称" :span="8">
          <b-input v-model="listQuery.typeName" placeholder="输入名称" clearable></b-input>
        </v-filter-item>

        <v-filter-item title="类别编码" :span="8">
          <b-input v-model="listQuery.typeCode" placeholder="输入编码"></b-input>
        </v-filter-item>

        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery">
        </v-filter-item>
      </v-filter-bar>

      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <template v-slot:action="{ row }">
          <b-button type="text" @click.stop="handleSelectBtn(row)">
            选择
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>

    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getConTypeTree, getConTypeList } from '../../../api/data-manage/res-info.api'

  export default {
    name: 'RegionModal',
    mixins: [commonMixin],
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      value (newVal) {
        this.open = newVal
      },
      open (newVal) {
        this.$emit('input', newVal)
      }
    },
    data () {
      return {
        open: this.value,
        treeLoading: false,
        curTreeNode: null,
        treeData: [],
        listQuery: {
          parentId: '',
          typeName: '',
          typeCode: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '类别名称', key: 'typeName', ellipsis: true, tooltip: true },
          { title: '类别编码', key: 'typeCode' },
          { title: '操作', slot: 'action', width: 70 }
        ]
      }
    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.listQuery.typeName = ''
          this.listQuery.typeCode = ''
          this.listQuery.size = 10
          this.listQuery.page = 1
          this.curTreeNode = null
          this.treeData = []
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @description b-tree组件节点选中状态改变的回调，用于更新全局唯一选中的节点curNode与父节点parentNode，并发送栏目改变事件。
       * @param {Array} nodes 多选时，已选择的节点数组
       * @param {Object} curNode 当前点击的节点
       */
      handleTreeNodeSelect (nodes, curNode) {
        if (this.curTreeNode.id === curNode.id) {
          curNode.selected = true
        } else {
          this.listQuery.parentId = curNode.id
          this.resetQuery()
        }
        this.curTreeNode = curNode
      },

      /**
       * @author haodongdong
       * @description 重置按钮回调
       */
      resetQuery () {
        this.listQuery.typeName = ''
        this.listQuery.typeCode = ''
        this.listQuery.size = 10
        this.listQuery.page = 1
        this.handleFilter()
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.typeName 类别名称
       * @param {string} row.typeCode 类别编码
       */
      handleSelectBtn (row) {
        this.$emit('selected', row.typeCode)
        this.open = false
      },

      /**
       * @author haodongdong
       * @description 获取左侧行政区域类别树
       */
      async getConTypeTree () {
        this.treeLoading = true
        try {
          const res = await getConTypeTree('region')
          const tree = this.buildTree(res)
          this.curTreeNode = tree[0]
          this.curTreeNode.expand = true
          this.curTreeNode.selected = true
          this.listQuery.parentId = this.curTreeNode.id
          this.treeData = tree
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
        this.treeLoading = false
      },

      /**
       * @author haodongdong
       * @description 查询列表
       */
      async searchList() {
        this.setListData()
        try {
          const res = await getConTypeList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 构建b-tree组件使用的数据结构
       * @param {Array} tree
       * @returns {Array} 返回处理后的tree结构
       */
      buildTree (tree) {
        let recFun = tree => {
          tree.forEach((node, index) => {
            node.title = node.text
            node.expand = false
            node.selected = false
            if (node.children && node.children.length) {
              recFun(node.children)
            }
          })
        }
        recFun(tree)
        recFun = null
        return tree
      },

      async init () {
        await this.getConTypeTree()
        this.searchList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .tree {
   position: relative;
   max-height: 500px;
 }
</style>
