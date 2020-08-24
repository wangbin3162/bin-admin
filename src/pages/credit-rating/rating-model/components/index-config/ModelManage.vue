<template>
  <div class="model-manage">
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
              :max="100" :min="0">
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
          <!-- 为指标时显示 or 层级大于3时一直显示，且性质会改变所以需要绑定listEdit数据 -->
          <b-button v-if="listEdit[index].indexType === 'Index' || row.level > 3"
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

    <select-index :open="open"
      :radio="radio"
      @close="open = false"
      @choose-sing="handleChooseSing"
      @choose-mul="handleChooseMul"></select-index>
  </div>
</template>

<script>
  import { updatedIndexModel, deleteIndexModel } from '@/api/credit-rating/rating-model.api'
  import SelectIndex from '@/pages/credit-rating/rating-model/SelectIndex'

  export default {
    name: 'ModelManage',
    props: {
      initList: {
        type: Array,
        required: true
      },
      editStatus: { // 标识是否是编辑
        type: Boolean,
        required: true
      },
      curNode: { //
        tyep: Object,
        required: true
      },
      listLoading: {
        type: Boolean,
        default: false
      }
    },
    components: {
      SelectIndex
    },
    data () {
      return {
        loadingBtn: false,
        open: false, // 控制选择指标组件打开关闭
        radio: true, // 选择指标组件单选还是多选
        isInit: true, // 是否初始化过tree组件数据
        natureEnum: { // 模型指标下指标性质枚举
          Dimension: '维度',
          Index: '指标'
        },
        curIndex: null, // 当前操作行的index
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
    watch: {
      initList: {
        handler (newVal) {
          this.list = this.buildTree(newVal, this.curNode.level)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 编辑模式下添加按钮的回调
       */
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

            // 这里以事件形式发出由外部组件更新editStatus状态
            this.$emit('quit-edit') // 退出编辑模式
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

      // 取消按钮的回调
      handleCancelBtn () {
        this.$emit('quit-edit')
      },

      /**
       * @author haodongdong
       * @description 供外部组件调用，编辑时深拷贝list到listEdit
       */
      deepCopyListToListEdit () {
        this.listEdit = this.$util.deepClone(this.list) // 复制用于数据绑定的副本
      },

      /**
       * @author haodongdong
       * @description 用于清理为保存的数据，供外部组件使用
       */
      clearData () {
        // 清除未保存的数据
        this.listEdit = this.listEdit.filter(item => item.id !== undefined)
        this.list = this.list.filter(item => item.id !== undefined)
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
        // 这里需要已事件的形式发出，使外部组件更新树节点。
        this.$emit('update-node', JSON.parse(JSON.stringify(subNode)))
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
  .model-manage {
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
</style>
