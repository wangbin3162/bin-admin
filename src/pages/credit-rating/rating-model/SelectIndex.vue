<template>
  <div>
     <b-modal v-model="showDialog"
      title="选择指标"
      :width="width"
      :styles="{ top: '10%'}"
      footer-hide
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap>
        <!-- tree -->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>

        <b-row :gutter="15">
          <b-col :span="span">
            <!-- 查询 -->
            <v-filter-bar>
              <v-filter-item title="名称">
                <b-input v-model.trim="listQuery.indexName" placeholder="请输入" clearable></b-input>
              </v-filter-item>
              <v-filter-item title="指标性质">
                <b-select v-model="listQuery.indexKind" clearable>
                  <b-option v-for="(value, key) in natureEnum" :key="key" :value="key">
                    {{ value }}
                  </b-option>
                </b-select>
              </v-filter-item>
              <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
            </v-filter-bar>
            <!-- table -->
            <div class="table">
              <b-table :columns="columns" :data="list"
                :loading="listLoading" size="small">
                <template v-slot:indexName="{ row }">
                  <b-button type="text" @click="handleCheck(row.id)">{{ row.indexName }}</b-button>
                </template>
                <template v-slot:indexKind="{ row }">
                  {{ natureEnum[row.indexKind] }}
                </template>
                <template v-slot:indexScale="{ row }">
                  {{ scaleEnum[row.indexScale] }}
                </template>
                <template v-slot:validMonth="{ row }">
                  {{ row.validMonth }} 月
                </template>
                <!-- 操作栏 -->
                <template v-slot:action="{ row }">
                  <b-button v-if="!radio" :type="checkRowSelected(row) ? 'danger' : 'primary'" plain
                    @click="chooseOne(row)">
                    {{ checkRowSelected(row) ? '取消' : '选择' }}
                  </b-button>
                  <b-button v-else type="primary" plain
                    @click="handleRadio">
                    选择
                  </b-button>
                </template>
              </b-table>
            </div>
            <!--下方分页器-->
            <b-page :total="total" size="small"
              :current.sync="listQuery.page"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange"></b-page>
          </b-col>
          <b-col span="8" v-if="!radio">
            <b-card class="box-card" head-tip
              header="已选指标">
              <b-tag
                type="info"
                :key="index"
                v-for="(tag,index) in selectedList"
                closable
                @on-close="handleCloseTag(index)">
                {{tag.indexName}}
              </b-tag>

              <b-button type="primary" style="width: 100%;margin: 10px 0;"
                v-if="selectedList.length"
                @click="postSelectedList">
                确定添加
              </b-button>
            </b-card>
          </b-col>
        </b-row>
      </v-table-wrap>
      </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getIndexManageTree, getIndexManageList } from '../../../api/credit-rating/index-manage.api'
  import { getEvalNature, getEvalScale } from '../../../api/enum.api'

  export default {
    name: 'SelectIndex',
    mixins: [commonMixin],
    props: ['open', 'radio'],
    data () {
      return {
        width: '90%',
        span: 16,
        treeData: [],
        listQuery: {
          indexName: '',
          indexKind: '',
          bizType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '编码', key: 'indexCode', align: 'center' },
          { title: '名称', slot: 'indexName', align: 'center' },
          { title: '指标性质', slot: 'indexKind', align: 'center' },
          { title: '标度', slot: 'indexScale', align: 'center' },
          { title: '有效期限', slot: 'validMonth', align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        natureEnum: {}, // 指标性质枚举
        scaleEnum: {}, // 标度枚举
        selectedList: [] // 已选择的数组
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created () {

    },
    methods: {
      // b-modal组件的可视状态事件回调，用于初始化
      handleVisibleChange (visible) {
        if (visible) {
          if (this.radio) {
            this.width = '67%' // 单选宽度
            this.span = 24
          } else {
            this.width = '90%' // 多选宽度
            this.span = 16
          }
          this.getEnum()
          this.initTree()
        } else {
          this.list = []
          this.treeData = []
          this.selectedList = []
        }
      },
      // 树节点选择改变回调
      handTreeCurrentChange (data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.bizType = node.code
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
      // 用于检查是否选中
      checkRowSelected(row) {
        const isSelected = this.selectedList.find(item => {
          return item.calIndexId === row.id
        })
        return !!isSelected
      },
      // 选择按钮的回调
      chooseOne(row) {
        let index = this.selectedList.findIndex(item => {
          return item.calIndexId === row.id
        })
        if (index === -1) {
          this.selectedList.push({
            indexName: row.indexName,
            indexDesc: row.indexDesc,
            calIndexId: row.id
          })
        } else {
          this.selectedList.splice(index, 1)
        }
      },
      // tag关闭回调
      handleCloseTag(index) {
        this.selectedList.splice(index, 1)
      },
      // 确认选择按钮回调，向外发送处理后的数据，多选
      postSelectedList () {
        this.$emit('choose-mul', this.selectedList)
        this.showDialog = false // 关闭弹框
      },
      // 单选时选择选择按钮的回调
      handleRadio (row) {
        this.$emit('choose-sing', row)
        this.showDialog = false // 关闭弹框
      },
      // 获取列表
      async searchList() {
        try {
          const res = await getIndexManageList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      },
      // 获取所需枚举值
      async getEnum () {
        try {
          const [natureEnum, scaleEnum] = await Promise.all([getEvalNature(), getEvalScale()])
          this.natureEnum = natureEnum
          this.scaleEnum = scaleEnum
        } catch (error) {
          console.error(error)
        }
      },
      // tree:初始化树结构
      initTree() {
        this.listLoading = true
        this.treeData = []
        // 请求响应返回树结构
        getIndexManageTree().then(response => {
          const tree = response.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree, null, ['code']) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.bizType = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      }
    }
  }
</script>
