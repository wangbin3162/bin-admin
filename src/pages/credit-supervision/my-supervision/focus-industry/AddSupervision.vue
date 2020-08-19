<template>
  <b-modal v-model="open" title="添加监管" width="1000"
    :append-to-body="false" :body-styles="{ padding: 0 }"
    @on-visible-change="handleVisibleChange">
    <v-table-wrap>
      <div slot="tree" class="tree">
        <b-tree v-if="!treeLoading" :data="treeData"
          @on-select-change="handleTreeNodeSelect">
        </b-tree>
        <b-loading showText="加载中..." v-if="treeLoading"></b-loading>
      </div>

      <v-filter-bar @keyup-enter="handleSearchBtn">
        <v-filter-item title="类别名称" :span="8">
          <b-input v-model="query.typeName" placeholder="输入名称" clearable></b-input>
        </v-filter-item>

        <!-- <v-filter-item title="类别编码" :span="8">
          <b-input v-model="query.typeCode" placeholder="输入编码"></b-input>
        </v-filter-item> -->

        <v-filter-item @on-search="handleSearchBtn" @on-reset="resetBtn">
        </v-filter-item>
      </v-filter-bar>

      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <template v-slot:typeName="{ row }">
          <span class="t-ellipsis" :title="row.typeName">{{ row.typeName }}</span>
        </template>

        <template v-slot:action="{ row }">
          <b-button type="text" @click.stop="handleAddSupervisionBtn(row)">
            加入监管
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>

    <div slot="footer">
      <b-page :total="total"
        :current.sync="query.page"
        @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import {
    getConTypeTree, getConTypeList,
    addSupervision
  } from '@/api/credit-supervision/my-supervision.api'

  export default {
    name: 'MSAddsupervision',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        treeLoading: false,
        curTreeNode: null,
        treeData: [],
        total: 0,
        query: {
          parentId: '',
          typeName: '',
          typeCode: '',
          size: 10,
          page: 1
        },
        listLoading: false,
        list: [],
        columns: [
          { type: 'index', width: 50 },
          { title: '类别名称', slot: 'typeName' },
          { title: '类别编码', key: 'typeCode' },
          { title: '操作', slot: 'action', width: 70 }
        ]
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
    methods: {
      /**
       * @author haodongdong
       * @description 获取左侧行政区域类别树
       */
      async getConTypeTree () {
        this.treeLoading = true
        try {
          const res = await getConTypeTree('hydm')
          const tree = this.buildTree(res)
          this.curTreeNode = tree[0]
          this.curTreeNode.expand = true
          this.curTreeNode.selected = true
          this.query.parentId = this.curTreeNode.id
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
      async getList() {
        this.listLoading = true
        try {
          const res = await getConTypeList(this.query)
          this.total = res.total
          this.list = res.rows
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.query.typeName = ''
          this.query.typeCode = ''
          this.query.size = 10
          this.query.page = 1
          this.curTreeNode = null
          this.treeData = []
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @description 一些初始化操作
       */
      async init () {
        await this.getConTypeTree()
        this.getList()
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
          this.query.parentId = curNode.id
          this.resetBtn()
        }
        this.curTreeNode = curNode
      },

      /**
       * @author haodongdong
       * @description 搜索按钮回调
       */
      handleSearchBtn () {
        this.query.page = 1
        this.getList()
      },

      /**
       * @author haodongdong
       * @description 重置按钮回调
       */
      resetBtn () {
        this.query.typeName = ''
        this.query.typeCode = ''
        this.query.size = 10
        this.query.page = 1
        this.handleSearchBtn()
      },

      /**
       * @author haodongdong
       * @description 加入监管按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.id 行业id
       * @param {string} row.typeName 行业名称
       */
      async handleAddSupervisionBtn (row) {
        try {
          await addSupervision({
            objectId: row.id,
            objectName: row.typeName,
            jgType: 'KI'
          })
          this.$message({
            type: 'success',
            content: '操作成功'
          })
          this.$emit('success')
          this.open = false
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @descriptoin 分页组件页面切换回调
       * @param {number} page 当前页
       */
      handleCurrentChange (page) {
        this.query.page = page
        this.getList()
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
