<template>
  <div class="index-config">
    <page-header-wrap title="模型指标" show-close @on-close="$emit('close')">
      <v-edit-wrap class="cover">
        <div slot="full" flex>
          <!-- tree -->
          <div class="tree-con">
            <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
              @on-select-change="handTreeCurrentChange"></b-tree>
          </div>
          <div class="table-con">
            <!-- search -->
            <v-filter-bar>
              <v-filter-item title="名称">
                <b-input v-model.trim="listQuery.indexName" placeholder="请输入" clearable></b-input>
              </v-filter-item>
              <!-- search btn -->
              <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
            </v-filter-bar>

            <!-- 展示用table -->
            <b-table v-if="!editStatus" :columns="columns" :data="list" :loading="listLoading">
              <template v-slot:indexType="{ row }">
                {{ natureEnum[row.indexType] }}
              </template>
            </b-table>

            <!-- 编辑用table -->
            <b-table v-else :columns="columnsEdit" :data="list" :loading="listLoading">
              <template v-slot:indexName="{ row }">
                <b-input v-model="row.indexName"></b-input>
              </template>
              <template v-slot:indexType="{ row }">
                <b-select v-model="row.indexType">
                  <b-option v-for="(value, key) in natureEnum" :key="key" :value="key">
                    {{ value }}
                  </b-option>
                </b-select>
              </template>
              <template v-slot:weight="{ row }">
                <b-input v-model="row.weight"></b-input>
              </template>
              <template v-slot:indexDesc="{ row }">
                <b-input v-model="row.indexDesc"></b-input>
              </template>
              <template v-slot:action>
                <b-button type="text">删除</b-button>
                <b-button type="text">选择</b-button>
              </template>
            </b-table>
          </div>
        </div>

        <template slot="footer">
          <!-- <b-button @click="$emit('close')">取 消</b-button> -->
          <b-button v-if="!editStatus" type="primary" @click="handleEditBtn">编 辑</b-button>
          <b-button v-else @click="editStatus = false">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getIndexTree } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'IndexConfig',
    mixins: [commonMixin],
    props: ['modelId'],
    data () {
      return {
        editStatus: false, // 标识是否是编辑
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        treeData: [],
        listQuery: {
          modelId: this.modelId,
          indexId: '',
          indexType: 'Dimension'
        },
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'indexName', align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', key: 'weight', align: 'center' },
          { title: '描述', key: 'indexDesc', align: 'center' }
          // { title: '操作', slot: 'action', align: 'center' }
        ],
        columnsEdit: [ // 编辑用table
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'indexName', align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', slot: 'indexDesc', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    created () {
      this.initTree()
    },
    methods: {
      // 树节点选择改变回调
      handTreeCurrentChange (selectedNode, curNode) {
        this.listQuery.indexId = curNode.id
        this.handleFilter()
      },
      // 重置查询
      resetQuery () {
        let bizType
        if (!this.currentTreeNode || this.currentTreeNode.code === 'C') {
          bizType = ''
        } else {
          bizType = this.currentTreeNode.code
        }
        this.listQuery = {
          page: 1,
          size: 10,
          indexName: '',
          indexKind: '',
          bizType: bizType
        }
        this.searchList()
      },
      // 编辑按钮的回调
      handleEditBtn () {
        this.editStatus = true
      },
      // tree:初始化树结构
      async initTree() {
        this.listLoading = true
        this.treeData = []
        // 请求响应返回树结构
        try {
          const tree = await getIndexTree(this.listQuery)
          // 创建根节点
          const rootNode = {
            title: '维度指标',
            expand: true,
            selected: true,
            children: this.buildTree(tree)
          }
          this.treeData = [rootNode]
          this.list = tree
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },
      // 获取列表
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexTree(this.listQuery)
          // 按indexId查询拿到的是当前节点的数据，
          // 所以获取当前节点的自己点需要自己处理
          // 且根节点为手动构建，所以点击根节点发起的查询不需取children
          if (this.listQuery.indexId) {
            this.list = res[0].children || []
          } else {
            this.list = res
          }
        } catch (error) {
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },
      // 构建树
      buildTree (tree) {
        const list = []
        for (const item of tree) {
          // 构建tree组件用数据
          const obj = {
            title: item.indexName,
            expand: false,
            selected: false,
            children: [],
            ...item
          }
          // 如果有子节点则递归
          if (item.children && item.children.length > 0) {
            obj.children = this.buildTree(item.children)
          }
          list.push(obj)
        }
        return list
      }
    }
  }
</script>

<style lang="stylus" scoped>
.index-config {
  width: 100%;
  .cover {
    padding: 0;
  }
  .tree-con {
    width: 224px;
    border-right: 1px solid #eee;
    padding: 16px 10px;
    overflow: auto;
    max-height: 648px;
  }
  .table-con {
    padding: 16px;
    width: calc(100% - 224px);
  }
}
</style>
