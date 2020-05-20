<template>
  <div class="index-config">
    <page-header-wrap title="模型指标" show-close @on-close="$emit('close')">
      <v-edit-wrap class="cover">
        <div slot="full" flex>
          <!-- tree -->
          <div class="tree-con">
            <b-tree :data="treeData" slot="tree" :lock-select="editStatus"
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
            <b-table v-if="!editStatus" :key="editStatus"
              :columns="columns"
              :data="list"
              :loading="listLoading">
              <template v-slot:indexType="{ row }">
                {{ natureEnum[row.indexType] }}
              </template>

              <template v-slot:weight="{ row }">
                {{ row.weight }}%
              </template>
            </b-table>

            <template v-else>
              <!-- 编辑用table -->
              <b-table :key="editStatus"
                :columns="columnsEdit"
                :data="list"
                :loading="listLoading">
                <template v-slot:indexName="{ index }">
                  <b-input v-model="listCopy[index].indexName"></b-input>
                </template>

                <template v-slot:indexType="{ index }">
                  <b-select v-model="listCopy[index].indexType" append-to-body>
                    <b-option v-for="(value, key) in natureEnum" :key="key" :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </template>

                <template v-slot:weight="{ index }">
                  <div flex>
                    <b-input-number style="width: 100%;"
                      v-model="listCopy[index].weight"
                      :max="100" :min="0">
                    </b-input-number>
                    <span style="line-height: 30px;">%</span>
                  </div>
                </template>

                <template v-slot:indexDesc="{ index }">
                  <b-input v-model="listCopy[index].indexDesc"></b-input>
                </template>

                <template v-slot:action="{ index, row }">
                  <b-button type="text" @click="handleRemove(index, row.id)">删除</b-button>
                  <b-button v-if="listCopy[index].indexType === 'Index'"
                    type="text"
                    @click="handleSelectBtn">
                      选择
                  </b-button>
                </template>
              </b-table>

              <div class="table-bottom">
                <b-button type="primary" plain style="width: 100%;"
                 @click="handleAdd">
                    + 添加
                </b-button>
                <p>注：此处权重总计100%；编辑时无法切换左侧树节点，保存或退出后方可。</p>
                <b-button type="primary" style="width: 10%;"
                  @click="handleSubmit">保 存</b-button>
              </div>
            </template>
          </div>
        </div>

        <template slot="footer">
          <b-button v-if="!editStatus" type="primary" @click="handleEditBtn">编 辑</b-button>
          <b-button v-else @click="editStatus = false">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <select-index :open="open"
      @close="open = false" @choose-mul="handleChooseMul"></select-index>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import SelectIndex from './SelectIndex'
  import {
    getIndexModleTree, updatedIndexModel, deleteIndexModel
  } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'IndexConfig',
    mixins: [commonMixin],
    props: ['modelId'],
    components: {
      SelectIndex
    },
    data () {
      return {
        open: false, // 控制选择指标组件打开关闭
        isInit: true, // 是否初始化过tree组件数据
        editStatus: false, // 标识是否是编辑
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        curNode: null, // 用于缓存选中的当前节点
        curLevel: [], // 缓存当前级别下的新增节点
        treeData: [], // 左侧树
        listQuery: {
          modelId: this.modelId,
          indexId: '',
          indexType: 'Dimension'
        },
        list: [],
        listCopy: [], // 用作数据绑定的副本，避免input等相关操作会重新刷新列表挂壁==关闭已展开列。
        columns: [
          {
            type: 'expand',
            width: 50,
            render: () => {
              return (
                <h4>Hello World</h4>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'indexName', align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', key: 'indexDesc', align: 'center' }
          // { title: '操作', slot: 'action', align: 'center' }
        ],
        columnsEdit: [ // 编辑用table
          {
            type: 'expand',
            width: 50,
            className: 'custome-expand-column',
            render: (h, scoped) => {
              return (
                <h4>Hello World</h4>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'indexName', align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', slot: 'indexDesc', align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ]
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      // 树节点选择改变回调
      handTreeCurrentChange (selectedNode, curNode) {
        this.curNode = curNode
        this.listQuery.indexId = curNode.id
        this.handleFilter()
      },
      // 编辑模式下添加按钮的回调
      handleAdd () {
        const obj = {
          title: '',
          expand: false,
          selected: false,
          children: [], // 不设置为null可少一步判断
          modelId: this.modelId,
          parentId: this.curNode.id || null, // 是顶级则null
          indexName: '',
          indexType: 'Dimension',
          calIndexId: '',
          weight: 0,
          indexDesc: ''
        }
        this.listCopy.push(obj) // 用于数据操作
        this.list.push(obj) // 用于显示
      },
      // 编辑模式下删除按钮回调
      handleRemove (index, id) {
        this.$confirm({
          title: '删除',
          content: '删除当前项目会删除其子项，确认删除吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const isSubmitted = this.listCopy[index].id !== undefined // 存在id说明提交过
              if (isSubmitted) {
                await deleteIndexModel(id)
              }
              this.list.splice(index, 1) // 同步显示
              this.listCopy.splice(index, 1) // 删除绑定数据
              this.curNode.children = this.listCopy // 同步到左侧树
              this.$message({ type: 'success', content: '操作成功' })
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 编辑模式下选择按钮回调
      handleSelectBtn () {
        this.open = true
      },
      // 选择指标组件的已选回调
      handleChooseMul (val) {
        console.log(val)
      },
      // 编辑模式下提交按钮的回调
      async handleSubmit () {
        try {
          for (const item of this.listCopy) {
            item.title = item.indexName // 构建树组件用的title
            item.weight = Number(Number(item.weight).toFixed(2)) // 保留两位小数
          }
          await updatedIndexModel(this.listCopy)
          await this.searchList()
          this.curNode.children = this.listCopy // 节点更新至树组件
          this.editStatus = false // 推出编辑模式
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
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
      // 获取列表
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexModleTree(this.listQuery)
          if (this.isInit) { // 第一次载入时做相关初始化
            this.treeData = this.initTree(res) // 构建左侧树
            this.list = this.treeData[0].children // 后面或copy list 所以此处list要取构建后的结构
            this.curNode = this.treeData[0] // 把根节点存储至当前节点
            this.isInit = false
          } else {
            // 按indexId查询拿到的是当前节点的数据，
            // 所以获取当前节点的子节点需要自己处理
            // 且根节点为手动构建，所以点击根节点发起的查询不需取children
            if (this.listQuery.indexId) { // 表示不是根节点
              this.list = res[0].children || []
            } else {
              this.list = res
            }
            this.list = this.buildTree(this.list) // 每次请求都需要构建tree组件使用的数据结构
          }
          this.listCopy = JSON.parse(JSON.stringify(this.list)) // 复制用于数据绑定的副本
        } catch (error) {
          console.log(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },
      // tree:初始化树组件用数据结构
      initTree(tree) {
        // 创建根节点
        const rootNode = {
          title: '维度指标',
          expand: true,
          selected: true,
          children: this.buildTree(tree)
        }
        return [rootNode]
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
          } else {
            item.children = [] // 把为null的置为[]
          }
          list.push(obj)
        }
        return list
      }
    }
  }
</script>

<style lang="stylus">
.index-config {
  .custome-expand-column {
    pointer-events: none;
    background-color: #F5F5F5;
    color:#ACA899;
  }
}
</style>

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

    .table-bottom {
      margin-top: 20px;
      text-align: center;
      p {
        margin: 10px 0;
        padding: 9px;
        height: 40px;
        text-align: left;
        background-color: #fafafa;
      }
    }
  }
}
</style>
