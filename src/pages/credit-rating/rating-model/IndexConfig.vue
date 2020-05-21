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
            <b-table id="customTable" v-if="!editStatus" :key="editStatus"
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
              <b-table id="customTable" :key="editStatus"
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
                  <!-- 为指标时显示 or 层级大于3时一直显示，且性质会改变所以需要绑定listCopy数据 -->
                  <b-button v-if="listCopy[index].indexType === 'Index' || row.level > 3"
                    type="text"
                    @click="handleSelectBtn(row.level, listCopy[index].indexType, index)">
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
        </div>

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
        loadingBtn: false,
        open: false, // 控制选择指标组件打开关闭
        radio: true, // 选择指标组件单选还是多选
        isInit: true, // 是否初始化过tree组件数据
        editStatus: false, // 标识是否是编辑
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        curNode: null, // 用于缓存选中的当前节点
        treeData: [], // 左侧树
        listQuery: {
          modelId: this.modelId,
          indexId: '',
          indexType: 'Index'
        },
        list: [],
        listCopy: [], // 用作数据绑定的副本，避免input等相关操作会重新刷新列表挂壁==关闭已展开列。
        columns: [
          {
            type: 'expand',
            width: 50,
            className: 'custome-expand-column disabled',
            render: (h, { row, index }) => {
              return (
                <div class="expand-row">
                  {
                    this.listCopy[index].children.map(item => {
                      return (
                        <div class="row-con">
                          <div class="column-type"></div>
                          <div class="column-type"></div>
                          <div class="column-con">{ item.indexName }</div>
                          <div class="column-con">{ this.natureEnum[item.indexType] }</div>
                          <div class="column-con">{ item.weight }%</div>
                          <div class="column-con">{ item.indexDesc }</div>
                        </div>
                      )
                    })
                  }
                </div>
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
            className: 'custome-expand-column disabled',
            render: (h, { row, index }) => {
              return (
                <div class="expand-row">
                  {
                    this.listCopy[index].children.map((item, cIndex) => {
                      return (
                        <div class="row-con">
                          <div class="column-type"></div>
                          <div class="column-type"></div>
                          <div class="column-con">{ item.indexName }</div>
                          <div class="column-con">{ this.natureEnum[item.indexType] }</div>
                          <div class="column-con">
                            <div flex>
                              <b-input-number style="width: 100%;"
                                max={100} min={0}
                                value={item.weight}
                                on-on-change={
                                  val => { item.weight = val }
                                }></b-input-number>
                                <span style="line-height: 30px;">%</span>
                            </div>
                          </div>
                          <div class="column-con">{ item.indexDesc }</div>
                          <div class="column-action">
                            <b-button type={'text'} onClick={ () => this.handleRemoveIndex(index, cIndex, item.id) }>删除</b-button>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'indexName', align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', slot: 'indexDesc', align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        curIndex: null // 当前操作行的index
      }
    },
    watch: {
      editStatus () {
        this.$nextTick(() => { // 编辑和取消切换table时重新处理禁用启用
          this.enableOrDisableExpanColumn(this.curNode.level) // 根据节点层级启用禁用左侧table可展开列
        })
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      // 树节点选择改变回调
      handTreeCurrentChange (selectedNode, curNode) {
        console.log(curNode)
        if (this.curNode.id === curNode.id) { // 点击已选择的
          curNode.selected = true
        } else {
          this.curNode = curNode
          this.listQuery.indexId = curNode.id
          this.handleFilter()
        }
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
          calIndexId: null,
          weight: 0,
          indexDesc: ''
        }
        this.listCopy.push(obj) // 用于数据操作
        this.list.push(obj) // 用于显示
      },
      // 编辑模式下删除按钮回调
      async handleRemove (index, id) {
        console.log('id', id)
        this.$confirm({
          title: '删除',
          content: '删除当前项目会删除其子项，确认删除吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const isSubmitted = this.listCopy[index].id !== undefined // 存在id说明提交过
              if (isSubmitted) {
                const map = this.tileTreeToMap(this.curNode.children) // 保存当前节点下的展开状态为map
                await deleteIndexModel(id)
                this.list.splice(index, 1) // 同步显示
                this.listCopy.splice(index, 1) // 删除绑定数据
                const newArr = this.listCopy.filter(item => item.id !== undefined) // 排除后续添加但未提交的数据
                this.restoreExpandStatus(newArr, map) // 恢复当前节点下的展开状态
                if (this.curNode.level < 3) { // 当前节点小于3则更新子节点至当前节点的children
                  this.curNode.children = JSON.parse(JSON.stringify(newArr)) // 同步到左侧树
                }
              } else {
                this.list.splice(index, 1) // 同步显示
                this.listCopy.splice(index, 1) // 删除绑定数据
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
      // 展开列下删除按钮回调
      async handleRemoveIndex(index, cIndex, id) {
        // this.listCopy[index].children.splice(cIndex, 1)
        const curRowChildren = this.listCopy[index].children
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
        if (level < 4) {
          // 单选
          this.radio = true
        } else if (indexType === 'Index') { // 大于4级时 指标单选 维度多选
            this.radio = true
          } else {
            this.radio = false
          }
        this.open = true
      },
      // 选择指标组件的多选回调
      handleChooseMul (mulVal) {
        const curRowObj = this.listCopy[this.curIndex]
        curRowObj.children = this.mergeFiveList(curRowObj.children, mulVal, curRowObj.id)
      },
      // 选择指标组件的单选回调
      handleChooseSing (singVal) {
        console.log(singVal)
        const curRowObj = this.listCopy[this.curIndex]
        curRowObj.indexName = singVal.indexName
        curRowObj.indexDesc = singVal.indexDesc
        curRowObj.calIndexId = singVal.id
      },
      // 编辑模式下提交按钮的回调
      async handleSubmit () {
        this.loadingBtn = true
        try {
          for (const item of this.listCopy) {
            item.title = item.indexName // 构建树组件用的title
            item.weight = Number(Number(item.weight).toFixed(2)) // 保留两位小数
          }
          const node = JSON.parse(JSON.stringify(this.curNode)) // 深拷贝当前节点
          const map = this.tileTreeToMap(node.children || []) // 保存当前节点下的展开状态为map
          node.children = this.listCopy // 深拷贝后如果当前节点为根节点且追加节点，则不会造成左侧树渲染
          const params = this.curNode.root ? this.listCopy : [node] // 根节点和子节点提交的格式有些区别

          await updatedIndexModel(params) // 请求接口更新数据
          await this.searchList() // 主要用于更新已选节点下数据后获取id，且这一步函数内会覆盖掉listCopy的展开状态

          this.restoreExpandStatus(this.listCopy, map) // 恢复当前节点下的展开状态
          if (this.curNode.level < 3) { // 当前节点小于3则更新子节点至当前节点的children
            this.curNode.children = JSON.parse(JSON.stringify(this.listCopy)) // 节点更新至树组件
          }

          this.editStatus = false // 退出编辑模式
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.loadingBtn = false
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
      // 取消与返回按钮的回调
      handleCancelBtn () {
        // 清除未保存的数据
        this.listCopy = this.listCopy.filter(item => item.id !== undefined)
        this.list = this.list.filter(item => item.id !== undefined)
        this.editStatus = false
      },
      // 获取列表
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexModleTree(this.listQuery)
          if (this.isInit) { // 第一次载入时做相关初始化
            this.treeData = this.initTree(res) // 构建左侧树
            this.curNode = this.treeData[0] // 把根节点存储至当前节点
            this.list = this.buildTree(res, this.curNode.level) // 构建为树结构
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
            // 每次请求都需要构建tree组件使用的数据结构，传入当前选中节点的层级，便于准确构建子节点层级
            this.list = this.buildTree(this.list, this.curNode.level)
          }
          this.listCopy = JSON.parse(JSON.stringify(this.list)) // 复制用于数据绑定的副本
          if (this.curNode.level === 3) {
            console.log('唔....，这里是三级子节点')
            console.log(this.listCopy)
          }
          this.$nextTick(() => {
            this.enableOrDisableExpanColumn(this.curNode.level) // 根据节点层级启用禁用左侧table可展开列
          })
        } catch (error) {
          console.error(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
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
              parentId: pid,
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
      // 构建树
      buildTree (tree, level = 0) {
        const list = []
        for (const item of tree) {
          // 构建tree组件用数据
          const obj = {
            title: item.indexName,
            expand: false,
            selected: false,
            level: level + 1,
            children: [],
            ...item
          }
          if (obj.level < 4) { // 这边如果是4级及以上则要保留children，用于展开显示
            // 如果层级小于3且有子节点则递归
            if (obj.level < 3 && (item.children && item.children.length > 0)) {
              obj.children = this.buildTree(item.children, obj.level)
            } else { // 去除第三级及后续层级的子节点
              obj.children = [] // 把为null的置为[]
            }
          } else {
            // 有子节点则递归
            if (item.children && item.children.length > 0) {
              obj.children = this.buildTree(item.children, obj.level)
            } else {
              obj.children = []
            }
          }
          list.push(obj)
        }
        return list
      },
      // 树结构平铺成map结构，保存展开状态、层级
      tileTreeToMap (tree) {
        try {
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
        } catch (error) {
          console.log(error)
        }
      },
      // 用于恢复展开状态
      restoreExpandStatus (tree, map) {
        try {
          for (const item of tree) {
            const expandStatus = map.get(item.id)
            // map中没取到值说明之前存map时该树节点并未存在
            if (expandStatus !== undefined) item.expand = expandStatus
            if (item.children && item.children.length) {
              this.restoreExpandStatus(item.children, map)
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      // 获取用于点击的可展开列的dom元素集合
      getExpandColumn () {
        const domList = []
        const tableEl = document.getElementById('customTable')
        const expandColumnList = tableEl.getElementsByClassName('custome-expand-column')
        for (const item of expandColumnList) {
          // const el = item.getElementsByTagName('div')[0].getElementsByTagName('div')[0]
          domList.push(item)
        }
        domList.shift() // 去除标题中的列
        return domList
      },
      // 启用禁用展开列功能
      enableOrDisableExpanColumn (level, nature) {
        const domList = this.getExpandColumn()
        for (const dom of domList) {
          if (level >= 3) { // 是第四层且是维度指标 可展开 && nature === 'Dimension' 暂缓维度条件
            dom.classList.remove('disabled')
          } else {
            dom.classList.add('disabled') // 反之启用
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
.index-config {
  td.disabled.custome-expand-column {
    pointer-events: none;
    background-color: #F5F5F5;
    i {
      color: #c0c4cc;
    }
  }

  .bin-table-expanded-cell { // 重写展开列默认样式
    padding: 0px;
    background: #f0f2f5;
  }
  .expand-row {
    .row-con {
      display: flex;
      justify-content: flex-start;
      margin: 7px 0;

      .column-type {
        width: 50px;
        text-align: center;
      }

      .column-con {
        padding: 0 16px;
        width: 0px; // flex-grow 均分剩余空间需要默认初始宽度
        flex-grow: 1;
        text-align: center;
        color: #909399;
        line-height: 30px;
        // 以下用于处理文字换行
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-all;
      }
      .column-action {
        width: 100px;
        text-align: center;
        line-height: 30px;
      }
    }
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
