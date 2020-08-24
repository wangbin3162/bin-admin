<template>
  <div class="index-config">
    <page-header-wrap title="模型指标" show-close @on-close="$emit('close')">
      <main-tabs @tab-change="mainSubKey => { mainTab = mainSubKey }">
      </main-tabs>

      <v-edit-wrap class="cover">
        <div flex v-show="mainTab === 'editWeight'">
          <div class="tree-con">
            <b-tree :data="treeData" slot="tree" :lock-select="false"
              @on-select-change="handTreeCurrentChange">
            </b-tree>
          </div>

          <div class="table-con">
            <sub-tabs class="mb-20" @tab-change="subTabKey => { subTab = subTabKey }">
            </sub-tabs>

            <model-manage ref="modelManage" v-show="subTab === 'modelManage'"
              :initList="list"
              :editStatus="editStatus"
              :curNode="curNode"
              @quit-edit="handleCancelBtn"
              @update-node="subNode => { curNode.children = subNode }">
            </model-manage>

            <decision-matrix v-show="subTab === 'decisionMatrix'">
            </decision-matrix>
          </div>
        </div>

        <global-weight v-show="mainTab === 'globalWeight'">
        </global-weight>

        <template slot="footer">
          <b-button v-if="!editStatus" type="primary" @click="handleEditBtn">编 辑</b-button>
          <b-button v-else @click="handleCancelBtn">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getIndexModleTree } from '../../../api/credit-rating/rating-model.api'
  import MainTabs from '@/pages/credit-rating/rating-model/components/index-config/MainTabs'
  import SubTabs from '@/pages/credit-rating/rating-model/components/index-config/SubTabs'
  import GlobalWeight from '@/pages/credit-rating/rating-model/components/index-config/GlobalWeight'
  import ModelManage from '@/pages/credit-rating/rating-model/components/index-config/ModelManage'
  import DecisionMatrix from '@/pages/credit-rating/rating-model/components/index-config/DecisionMatrix'

  export default {
    name: 'IndexConfig',
    mixins: [commonMixin],
    props: ['modelId'],
    components: {
      MainTabs,
      SubTabs,
      GlobalWeight,
      ModelManage,
      DecisionMatrix
    },
    data () {
      return {
        mainTab: 'editWeight',
        subTab: 'modelManage',
        isInit: true, // 是否初始化过tree组件数据
        editStatus: false, // 标识是否是编辑
        curNode: null, // 用于缓存选中的当前节点
        treeData: [], // 左侧树
        listQuery: {
          modelId: this.modelId,
          indexId: '',
          indexName: '',
          indexType: 'Index'
        },
        list: []
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      // 树节点选择改变回调
      async handTreeCurrentChange (selectedNode, curNode) {
        console.log(curNode)
        if (this.curNode.id === curNode.id) { // 点击已选择的
          curNode.selected = true
        } else {
          if (this.editStatus) {
            const ok = await this.confirm({
              title: '提示！',
              content: '切换会丢弃当前未保存的操作，确认切换吗？',
              okType: 'warning'
            })
            if (ok) {
              this.editStatus = false // 关闭当前编辑
            } else {
              curNode.selected = false
              this.curNode.selected = true
            }
          }
          if (!this.editStatus) {
            this.curNode = curNode
            this.listQuery.indexId = curNode.id // 设置右侧table查询条件为当前节点id
            this.handleFilter()
          }
        }
      },

      // 获取列表
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexModleTree(this.listQuery)
          if (this.isInit) { // 第一次载入时做相关初始化
            this.treeData = this.initTree(res) // 构建左侧树
            this.curNode = this.treeData[0] // 把根节点存储至当前节点
            this.list = this.treeData[0].children
            this.isInit = false
          } else {
            /**
             * 按indexId查询拿到的是当前节点的数据
             * 且根节点为手动构建，所以点击根节点发起的查询不需取children
             * 所以获取当前节点的子节点需要自己处理
             */
            if (!this.curNode.root) { // 表示不是根节点
              this.list = res[0].children || []
            } else {
              this.list = res
            }
            // 每次请求都需要构建tree组件使用的数据结构，传入当前选中节点的层级，便于准确构建子节点层级
            this.list = this.buildTree(this.list, this.curNode.level)
          }
        } catch (error) {
          console.error(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },

      // tree:初始化树组件用数据结构
      initTree(tree) {
        // 创建根节点
        const rootNode = {
          title: '维度指标',
          root: true,
          expand: true,
          selected: true,
          level: 0,
          children: this.buildTree(tree, 0)
        }
        return [rootNode]
      },

      /**
       * @author haodongdong
       * @description 构建树，用于把后端树形数据处理成b-tree组件可用的结构。扩展了一些树组件需要的字段。
       */
      buildTree (tree, level = 0) {
        const list = []
        for (const item of tree) {
          // 构建tree组件用数据
          const obj = {
            title: `${item.indexName} (${item.weight}%)`,
            expand: false,
            selected: false,
            level: level + 1,
            children: [],
            ...item
          }
          if (item.children && item.children.length > 0) {
            obj.children = this.buildTree(item.children, obj.level)
          } else {
            obj.children = []
          }
          list.push(obj)
        }
        return list
      },

      // 编辑按钮的回调
      handleEditBtn () {
        this.$refs.modelManage.deepCopyListToListEdit() // 复制ModelManage组件内用于数据绑定的副本
        this.editStatus = true
      },

      // 取消与返回按钮的回调
      handleCancelBtn () {
        this.$refs.modelManage.clearData() // 清除ModelManageu组件内未保存的数据
        this.editStatus = false
      }

    }
  }
</script>

<style lang="stylus" scoped>
.index-config {
  width: 100%;
  .cover {
    padding: 0;
    border: 1px solid #e4e7ed;
    border-top: 0px solid #e4e7ed;
  }
  .tree-con {
    width: 340px;
    border-right: 1px solid #eee;
    padding: 16px 10px;
    overflow: auto;
    max-height: 648px;
  }
  .table-con {
    padding: 16px;
    width: calc(100% - 370px);
  }
}
</style>
