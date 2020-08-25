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

            <div v-show="subTab === 'modelManage'">
              <!-- 展示用table -->
              <b-table id="customTable" v-if="!editStatus" size="small"
                :key="editStatus"
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
                <b-table id="customTable" size="small"
                  :key="editStatus"
                  :columns="columnsEdit"
                  :data="list"
                  :loading="listLoading">
                  <template v-slot:indexName="{ index }">
                    <b-input v-model="listEdit[index].indexName"
                      :disabled="listEdit[index].indexType === 'Index'"></b-input>
                  </template>

                  <template v-slot:indexType="{ row, index }">
                    <!-- 已提交的数据不允许修改性质 -->
                    <!-- Boolean(listEdit[index].id) 把id转为Boolean类型，提交过的数据id一定存在，未提交的则不存在 -->
                    <!-- Boolean(listEdit[index].uSelected) 用于新增时，如果已从指标选择组件选择指标，则不允许切换性质 -->
                    <b-select v-model="listEdit[index].indexType" append-to-body
                      @on-change="handleIndexTypeChange($event, index, row.level)"
                      :disabled="Boolean(listEdit[index].id)">
                      <b-option v-for="(value, key) in natureEnum" :key="key" :value="key">
                        {{ value }}
                      </b-option>
                    </b-select>
                  </template>

                  <template v-slot:weight="{ index }">
                    <div flex>
                      <b-input-number style="width: 100%;"
                        v-model="listEdit[index].weight"
                        :max="100" :min="0" :precision="2">
                      </b-input-number>
                      <span style="line-height: 30px;">%</span>
                    </div>
                  </template>

                  <template v-slot:indexDesc="{ index }">
                    <b-input v-model="listEdit[index].indexDesc"
                      :disabled="listEdit[index].indexType === 'Index'"></b-input>
                  </template>

                  <template v-slot:action="{ index, row }">
                    <b-button type="text" @click="handleRemove(index, row.id)">删除</b-button>
                    <!-- 为指标时显示 -->
                    <b-button v-if="listEdit[index].indexType === 'Index'"
                      type="text"
                      @click="handleSelectBtn(row.level, listEdit[index].indexType, index)">
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
                  <b-button type="primary" :loading="loadingBtn"
                    @click="handleSubmit">
                      保 存
                  </b-button>
                  <b-button @click="handleCancelBtn">取 消</b-button>
                </div>
              </template>
            </div>

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

    <select-index :open="open"
      :radio="radio"
      @close="open = false"
      @choose-sing="handleChooseSing"
      @choose-mul="handleChooseMul"></select-index>
  </div>
</template>

<script>
  import commonMixin from '@/common/mixins/mixin'
  import {
    getIndexModleTree, updatedIndexModel, deleteIndexModel
  } from '@/api/credit-rating/rating-model.api'
  import MainTabs from '@/pages/credit-rating/rating-model/components/index-config/MainTabs'
  import SubTabs from '@/pages/credit-rating/rating-model/components/index-config/SubTabs'
  import GlobalWeight from '@/pages/credit-rating/rating-model/components/index-config/GlobalWeight'
  import DecisionMatrix from '@/pages/credit-rating/rating-model/components/index-config/DecisionMatrix'
  import SelectIndex from './SelectIndex'

  export default {
    name: 'IndexConfig',
    mixins: [commonMixin],
    props: ['modelId'],
    components: {
      MainTabs,
      SubTabs,
      GlobalWeight,
      DecisionMatrix,
      SelectIndex
    },
    data () {
      return {
        mainTab: 'editWeight',
        subTab: 'modelManage',
        loadingBtn: false,
        open: false, // 控制选择指标组件打开关闭
        radio: true, // 选择指标组件单选还是多选
        isInit: true, // 是否初始化过tree组件数据
        editStatus: false, // 标识是否是编辑
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        curIndex: null, // 当前操作行的index
        curNode: null, // 用于缓存选中的当前节点
        treeData: [], // 左侧树
        listQuery: {
          modelId: this.modelId,
          indexId: '',
          indexName: '',
          indexType: 'Index'
        },
        list: [],
        listEdit: [], // 用作数据绑定的副本，避免input等相关操作会重新刷新列表挂壁==关闭已展开列。
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'indexName', ellipsis: true, tooltip: true, align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', key: 'indexDesc', ellipsis: true, tooltip: true, align: 'center' }
        ],
        columnsEdit: [ // 编辑用table
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'indexName', ellipsis: true, tooltip: true, align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', slot: 'indexDesc', ellipsis: true, tooltip: true, align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ]
      }
    },
    created () {
      this.searchList()
    },
    methods: {
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
          this.listEdit = JSON.parse(JSON.stringify(this.list)) // 复制用于编辑时的数据绑定的副本
        } catch (error) {
          console.error(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },

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

      // 编辑模式下添加按钮的回调
      handleAdd () {
        const obj = {
          title: '',
          expand: false,
          selected: false,
          level: this.curNode.level + 1,
          children: [], // 不设置为null可少一步判断
          modelId: this.modelId,
          parentIndex: this.curNode.id || null, // 是顶级则null
          indexName: '',
          indexType: 'Dimension',
          calIndexId: null,
          weight: 0,
          indexDesc: ''
        }
        this.listEdit.push(obj) // 用于数据操作
        this.list.push(JSON.parse(JSON.stringify(obj))) // 用于显示，深拷贝解除响应式依赖
      },

      // 性质下拉框change回调
      handleIndexTypeChange (indexType, index, level) {
        // 切换时清空之前类型的数据
        this.listEdit[index].indexName = ''
        this.listEdit[index].indexDesc = ''
        this.listEdit[index].weight = 0
        if (indexType === 'Index') {
          this.listEdit[index].children = []
          // 选择指标时自动打开选择指标弹框
          this.handleSelectBtn(level, indexType, index)
        } else {
          this.listEdit[index].calIndexId = null
        }
      },

      // 展开列下删除按钮回调
      async handleRemoveIndex(index, cIndex, id) {
        const curRowChildren = this.listEdit[index].children
        this.$confirm({
          title: '删除',
          content: '删除当前项后不可恢复，确认删除吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const isSubmitted = id !== undefined // 存在id说明提交过
              if (isSubmitted) {
                await deleteIndexModel(id)
              }
              curRowChildren.splice(cIndex, 1)
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
      handleSelectBtn (level, indexType, index) {
        this.curIndex = index // 缓存点击选择按钮所在行的index
        this.radio = true
        this.open = true
      },

      // 选择指标组件的多选回调
      handleChooseMul (mulVal) {
        const curRowObj = this.listEdit[this.curIndex]
        curRowObj.children = this.mergeFiveList(curRowObj.children, mulVal, curRowObj.id)
        this.$set(curRowObj, 'uSelected', true) // 用于选择后禁止切换性质下拉框, 与指标下拉框关联
      },

      // 选择指标组件的单选回调
      handleChooseSing (singVal) {
        const curRowObj = this.listEdit[this.curIndex]
        curRowObj.indexName = singVal.indexName
        curRowObj.indexDesc = singVal.indexDesc
        curRowObj.calIndexId = singVal.id
        this.$set(curRowObj, 'uSelected', true) // 用于选择后禁止切换性质下拉框, 与指标下拉框关联
      },

      // 编辑模式下删除按钮回调
      async handleRemove (index, id) {
        this.$confirm({
          title: '删除',
          content: '删除当前项目会删除其子项，确认删除吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const isSubmitted = id !== undefined // 存在id说明提交过
              if (isSubmitted) {
                const map = this.tileTreeToMap(this.curNode.children) // 保存当前节点下的展开状态为map

                await deleteIndexModel(id)
                this.list.splice(index, 1) // 同步显示
                this.listEdit.splice(index, 1) // 删除绑定数据

                // 准备需要更新的节点数据，排除后续添加但未提交的数据
                const newArr = this.listEdit.filter(item => item.id !== undefined)

                // 更新右侧table数据(子节点)至当前左侧树选中节点的children
                this.updateSubNodeToTreeCom(newArr, map)
              } else {
                this.list.splice(index, 1) // 同步显示
                this.listEdit.splice(index, 1) // 删除绑定数据
              }
              this.$message({ type: 'success', content: '操作成功' })
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },

      // 编辑模式下提交按钮的回调
      async handleSubmit () {
        try {
          await this.validate(this.listEdit)
          this.loadingBtn = true

          try {
            for (const item of this.listEdit) { // 由于table的数据来自于左侧树接口，因此可能包含有子节点数据，提交的时候并不需要，所以过滤掉。
              item.children = []
            }

            const map = this.tileTreeToMap(this.curNode.children) // 保存当前节点下的展开状态为map

            await updatedIndexModel(this.listEdit) // 请求接口更新数据
            await this.searchList() // 主要用于更新已选节点下数据后获取id，且这一步函数内会覆盖掉listEdit的展开状态

            // 更新右侧table数据(子节点)至当前左侧树选中节点的children
            this.updateSubNodeToTreeCom(this.listEdit, map) // 节点更新至树组件

            this.editStatus = false // 退出编辑模式
            this.$message({ type: 'success', content: '操作成功' })
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.loadingBtn = false
        } catch (error) {
          this.$message({ type: 'warning', content: error.message })
        }
      },

      /**
       * @author haodongdong
       * @description 编辑按钮的回调
       */
      handleEditBtn () {
        this.listEdit = this.$util.deepClone(this.list) // 复制用于数据绑定的副本
        this.editStatus = true
      },

      /**
       * @author haodongdong
       * @description 取消与返回按钮的回调
       */
      handleCancelBtn () {
        // 清除未保存的数据
        this.listEdit = this.listEdit.filter(item => item.id !== undefined)
        this.list = this.list.filter(item => item.id !== undefined)
        this.editStatus = false
      },

      /**
       * @author haodongdong
       * @description 更新右侧table的相关节点状态到左侧树
       * @param {Array} nodeData 节点数据
       * @param {Map} map 包含节点展开状态的map
       */
      updateSubNodeToTreeCom (nodeData, map) {
        const subNode = this.buildTree(nodeData, this.curNode.level)
        this.restoreExpandStatus(subNode, map) // 恢复当前节点下的展开状态
        this.curNode.children = this.$util.deepClone(subNode) // 节点更新至树组件
      },

      // 合并第五级的数据
      mergeFiveList (oldList, newList, pid) {
        const cacheList = [] // 用于存放不重复的元素
        newList.map(newItem => {
          const oldEl = oldList.find(oldItem => oldItem.calIndexId === newItem.calIndexId) // 返回已存在的新元素
          console.log(oldEl)
          if (oldEl) { // 如果存在重复元素, 则更新
            oldEl.indexName = newItem.indexName
            oldEl.indexDesc = newItem.indexDesc
          } else { // 如果不存在重复元素，则构建后缓存到cacheList
            const obj = {
              title: '',
              expand: false,
              selected: false,
              children: [], // 不设置为null可少一步判断
              modelId: this.modelId,
              parentIndex: pid,
              indexName: newItem.indexName,
              indexType: 'Index',
              calIndexId: newItem.calIndexId,
              weight: 0,
              indexDesc: newItem.IndexDesc
            }
            cacheList.push(obj)
          }
        })
        return [...oldList, ...cacheList] // 返回合并后的结果
      },

      /**
       * @author haodongdong
       * @description 初始化树组件用数据结构
       * @param {Array} tree
       */
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
       * @param {Array} tree
       * @param {number} [level]
       */
      buildTree (tree, level = 0) {
        const list = []
        for (const item of tree) {
          // 构建tree组件用数据
          const obj = {
            title: `${item.indexName} (${item.weight}%)`,
            disabled: item.indexType === 'Index', // 指标类型的节点禁止点击
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

      /**
       * @author haodongdong
       * @description 树结构平铺成map结构，保存展开状态、层级
       * @param {Array} tree
       */
      tileTreeToMap (tree) {
        const map = new Map()
        let recFun = tree => {
          for (const item of tree) {
            map.set(item.id, item.expand)
            if (item.children && item.children.length) {
              recFun(item.children)
            }
          }
        }
        recFun(tree)
        recFun = null // 清除闭包
        return map
      },

      /**
       * @author haodongdong
       * @description 用于恢复展开状态
       * @param {Array} tree
       * @param {Map} map 保存有展开状态的map
       */
      restoreExpandStatus (tree, map) {
        for (const item of tree) {
          const expandStatus = map.get(item.id)
          // map中没取到值说明之前存map时该树节点并未存在
          if (expandStatus !== undefined) item.expand = expandStatus
          if (item.children && item.children.length) {
            this.restoreExpandStatus(item.children, map)
          }
        }
      },

      /**
       * @author haodongdong
       * @description 封装为支持Promise的confirm
       * @param {Object} obj $confirm配置对象
       */
      async confirm (obj) {
        return new Promise((resolve, reject) => {
          this.$confirm({
            onOk: () => {
              resolve(true)
            },
            onCancel: () => {
              resolve(false)
            },
            ...obj
          })
        })
      },

      async isRequired (obj, key) {
        return new Promise((resolve, reject) => {
          const el = obj[key]
          if (el === '' || el === null) {
            reject(new Error(key + '字段不能为空'))
          } else {
            resolve()
          }
        })
      },

      async isCount100 (list) {
        return new Promise((resolve, reject) => {
          const num = list.reduce((total, curItem) => {
            return total + curItem.weight
          }, 0)
          if (num !== 100) {
            reject(new Error('每层权重之和必须为100%'))
          }
          resolve()
        })
      },

      async validate (listEdit) {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of listEdit) {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  if (key === 'indexName' || key === 'weight') {
                    try {
                      await this.isRequired(item, key)
                    } catch (error) {
                      reject(new Error('名称或权重不能为空！'))
                    }
                  }
                }
              }
            }
            try {
              // 验证当前层级的权重之和是否为100%
              await this.isCount100(listEdit)
              // 如果是第四层的话，则验证四层内的子节点权重之和是否为100%
              if (this.curNode.level >= 3) {
                listEdit.forEach(async (item, index) => {
                  try {
                    await this.isCount100(item.children)
                    resolve()
                  } catch (error) {
                    reject(new Error('第5层指标权重之和必须为100%！'))
                  }
                })
              } else {
                resolve()
              }
            } catch (error) {
              reject(new Error('当前层级权重之和必须为100%！'))
            }
          } catch (error) {
            reject(new Error('名称或权重不能为空！'))
          }
        })
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
