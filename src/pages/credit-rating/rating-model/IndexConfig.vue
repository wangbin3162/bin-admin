<template>
  <div class="index-config">
    <page-header-wrap title="模型指标" show-close @on-close="$emit('close')">
      <v-edit-wrap class="cover">
        <div slot="full" flex>
          <!-- tree -->
          <div class="tree-con">
            <b-tree :data="treeData" slot="tree" :lock-select="false"
              @on-select-change="handTreeCurrentChange"></b-tree>
          </div>
          <div class="table-con">
            <!-- search -->
            <!-- <v-filter-bar @keyup-enter="handleFilter">
              <v-filter-item title="名称">
                <b-input v-model.trim="listQuery.indexName" placeholder="请输入" clearable></b-input>
              </v-filter-item>
              <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
            </v-filter-bar> -->

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
                  <b-input v-model="listCopy[index].indexName"
                    :disabled="listCopy[index].indexType === 'Index'"></b-input>
                </template>

                <template v-slot:indexType="{ row, index }">
                  <!-- 已提交的数据不允许修改性质 -->
                  <!-- Boolean(listCopy[index].id) 把id转为Boolean类型，提交过的数据id一定存在，未提交的则不存在 -->
                  <!-- Boolean(listCopy[index].uSelected) 用于新增时，如果已从指标选择组件选择指标，则不允许切换性质 -->
                  <b-select v-model="listCopy[index].indexType" append-to-body
                    @on-change="handleIndexTypeChange($event, index, row.level)"
                    :disabled="Boolean(listCopy[index].id)">
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
                  <b-input v-model="listCopy[index].indexDesc"
                    :disabled="listCopy[index].indexType === 'Index'"></b-input>
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
          { title: '名称', key: 'indexName', ellipsis: true, tooltip: true, align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', key: 'indexDesc', ellipsis: true, tooltip: true, align: 'center' }
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
          { title: '名称', slot: 'indexName', ellipsis: true, tooltip: true, align: 'center' },
          { title: '性质', slot: 'indexType', align: 'center' },
          { title: '权重', slot: 'weight', align: 'center' },
          { title: '描述', slot: 'indexDesc', ellipsis: true, tooltip: true, align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        domList: [] // 可展开列的dom
      }
    },
    watch: {
      editStatus () {
        this.$nextTick(() => { // 编辑和取消切换table时重新处理禁用启用
          this.enableOrDisableExpanColumn(this.curNode.level + 1) // 根据节点层级启用禁用左侧table可展开列
        })
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
            this.listQuery.indexId = curNode.id // 设置左侧table查询条件为当前节点id
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
        this.listCopy.push(obj) // 用于数据操作
        this.list.push(JSON.parse(JSON.stringify(obj))) // 用于显示，深拷贝解除响应式依赖
        this.$nextTick(() => {
          this.enableOrDisableExpanColumn(this.curNode.level + 1)
        })
      },
      // 性质下拉框change回调
      handleIndexTypeChange (indexType, index, level) {
        if (this.curNode.level >= 3) { // 用于更新第四层数据可展开列状态
          this.$nextTick(() => { // 更新展开列状态
            this.enableOrDisableExpanColumn(this.curNode.level + 1)
            if (indexType === 'Index') { // 如果是从维度切换为指标 则把可能已展开的列收起
              this.$nextTick(() => {
                this.hackClick(index, 'close')
              })
            }
          })
        }
        // 切换时清空之前类型的数据
        this.listCopy[index].indexName = ''
        this.listCopy[index].indexDesc = ''
        this.listCopy[index].weight = 0
        if (indexType === 'Index') {
          this.listCopy[index].children = []
          // 选择指标时自动打开选择指标弹框
          this.handleSelectBtn(level, indexType, index)
        } else {
          this.listCopy[index].calIndexId = null
        }
      },
      // 展开列下删除按钮回调
      async handleRemoveIndex(index, cIndex, id) {
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
        this.$set(curRowObj, 'uSelected', true) // 用于选择后禁止切换性质下拉框, 与指标下拉框关联
        this.$nextTick(() => { // 选择后展开
          this.hackClick(this.curIndex, 'open')
        })
      },
      // 选择指标组件的单选回调
      handleChooseSing (singVal) {
        const curRowObj = this.listCopy[this.curIndex]
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
                this.listCopy.splice(index, 1) // 删除绑定数据

                if (this.curNode.level < 3) { // 当前节点小于3则更新子节点至当前节点的children
                  const newArr = this.listCopy.filter(item => item.id !== undefined) // 排除后续添加但未提交的数据
                  const subNode = this.buildTree(newArr, this.curNode.level) // 默认过滤出维度节点
                  this.restoreExpandStatus(subNode, map) // 恢复当前节点下的展开状态
                  this.updateSubNodeToTreeCom(subNode) // 节点更新至树组件
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
      // 编辑模式下提交按钮的回调
      async handleSubmit () {
        try {
          await this.validate(this.listCopy)
          this.loadingBtn = true
          try {
            if (this.curNode.level < 3) { // 层级小于3时，提交的数据中不需包含children的内容
              for (const item of this.listCopy) {
                item.children = []
              }
            }

            const map = this.tileTreeToMap(this.curNode.children) // 保存当前节点下的展开状态为map

            await updatedIndexModel(this.listCopy) // 请求接口更新数据
            await this.searchList() // 主要用于更新已选节点下数据后获取id，且这一步函数内会覆盖掉listCopy的展开状态

            if (this.curNode.level < 3) { // 当前节点小于3则更新子节点至当前节点的children
              const subNode = this.buildTree(this.listCopy, this.curNode.level) // 默认过滤出维度节点
              this.restoreExpandStatus(subNode, map) // 恢复当前节点下的展开状态
              this.updateSubNodeToTreeCom(subNode) // 节点更新至树组件
            }

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
      // 重置查询
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          modelId: this.modelId,
          indexId: this.curNode.id,
          indexName: '',
          indexType: 'Index'
        }
        this.searchList()
      },
      // 编辑按钮的回调
      handleEditBtn () {
        this.listCopy = JSON.parse(JSON.stringify(this.list)) // 复制用于数据绑定的副本
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
            this.treeData = this.initTree(res) // 构建左侧树，默认只构建节点为维度的类型
            this.curNode = this.treeData[0] // 把根节点存储至当前节点
            this.list = this.buildTree(res, this.curNode.level, 'Index') // 构建为树结构(过滤出所有类型节点)
            this.isInit = false
          } else {
            /**
             * 按indexId查询拿到的是当前节点的数据
             * 且根节点为手动构建，所以点击根节点发起的查询不需取children
             * 所以获取当前节点的子节点需要自己处理
             */
            if (this.listQuery.indexId) { // 表示不是根节点
              this.list = res[0].children || []
            } else {
              this.list = res
            }
            // 每次请求都需要构建tree组件使用的数据结构，传入当前选中节点的层级，便于准确构建子节点层级
            this.list = this.buildTree(this.list, this.curNode.level, 'Index') // 构建用于列表展示的所有类型
          }
          this.listCopy = JSON.parse(JSON.stringify(this.list)) // 复制用于数据绑定的副本

          this.$nextTick(() => {
            this.enableOrDisableExpanColumn(this.curNode.level + 1) // 根据节点层级启用禁用左侧table可展开列
          })
        } catch (error) {
          console.error(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.listLoading = false
      },
      // 更新右侧table的相关节点状态到左侧树
      updateSubNodeToTreeCom (subNode) {
        this.curNode.children = JSON.parse(JSON.stringify(subNode)) // 节点更新至树组件
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
       * 构建树，用于把后端树形数据处理成b-tree组件可用的结构。
       * 扩展了一些树组件需要的字段。
       */
      buildTree (tree, level = 0, indexType = 'Dimension') { // indexType 为 Dimension 表示只筛选出维度节点，反之筛选出维度与指标节点
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
          if (obj.level < 4) { // 这边如果是4级及以上则要保留children，用于展开显示
            // 如果层级小于3且有子节点则递归
            if (obj.level < 3 && (item.children && item.children.length > 0)) {
              obj.children = this.buildTree(item.children, obj.level, indexType)
            } else { // 去除第三级及后续层级的子节点
              obj.children = [] // 把为null的置为[]
            }
          } else {
            // 有子节点则递归
            if (item.children && item.children.length > 0) {
              obj.children = this.buildTree(item.children, obj.level, indexType)
            } else {
              obj.children = []
            }
          }
          if (indexType === 'Dimension') { // 维度时只构建包含维度的节点，忽略Index指标节点
            if (obj.indexType === 'Dimension') list.push(obj)
          } else { // 非维度构建时，构建所有类型节点
            list.push(obj)
          }
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
          domList.push(item)
        }
        domList.shift() // 去除标题中的列
        return domList
      },
      // 启用禁用展开列功能
      enableOrDisableExpanColumn (curLevel) { // curLevel表示当前table展示的数据所属的层级
        this.domList = this.getExpandColumn() // 获取右侧可展开节点
        for (let i = 0; i < this.listCopy.length; i++) { // 遍历右侧table数据
          const el = this.listCopy[i]
          if (curLevel > 3 && el.indexType === 'Dimension') { // 是第四层且是维度指标 可展开
            this.domList[i].classList.remove('disabled')
          } else {
            this.domList[i].classList.add('disabled') // 反之启用
          }
        }
      },
      // hack的方式，使用原生js的click()主动触发对应行的展开操作
      hackClick (index, type) {
        if (this.domList.length > 0) {
          // 阻止bin-ui自身的报错，猜测可能是bin-in的dom渲染没有结束
          // 或者是任务队列没执行完触发click导致没获取的需要的数据而json报错
          setTimeout(() => {
            const el = this.domList[index].getElementsByTagName('div')[0].getElementsByTagName('div')[0] // 获取可点击元素
            const str = el.className
            if (type === 'open') {
              // 已展开则不点击
              if (!str.includes('bin-table-cell-expand-expanded')) el.click()
            } else {
              // 为展开则不点击
              if (str.includes('bin-table-cell-expand-expanded')) el.click()
            }
          }, 0)
        }
      },
      // 封装为支持Promise的confirm
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
      async validate (listCopy) {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of listCopy) {
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
              await this.isCount100(listCopy)
              // 如果是第四层的话，则验证四层内的子节点权重之和是否为100%
              if (this.curNode.level >= 3) {
                listCopy.forEach(async (item, index) => {
                  try {
                    await this.isCount100(item.children)
                    resolve()
                  } catch (error) {
                    this.hackClick(index, 'open')
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

<style lang="stylus">
.index-config {
  // td.disabled.custome-expand-column {
  //   cursor: not-allowed;
  // }
  td.disabled.custome-expand-column .bin-table-cell-expand {
    pointer-events: none;
    i {
      color: rgba(0, 0, 0, 0.0)
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
