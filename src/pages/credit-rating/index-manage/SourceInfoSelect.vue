<template>
  <div class="source-select">
    <b-modal v-model="showDialog"
      title="选择资源"
      width="90%"
      :styles="{ top: '10%'}"
      footer-hide
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap>
        <!-- tree -->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>

        <b-row :gutter="15">
          <b-col span="14">
            <!-- 查询 -->
            <v-filter-bar>
              <v-filter-item title="资源名称" :span="8">
                <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称" clearable></b-input>
              </v-filter-item>
              <v-filter-item title="资源性质" :span="8">
                <v-cascade :data="resPropertyOptions" v-model="listQuery.resProperty" style="width: 100%;"></v-cascade>
              </v-filter-item>
              <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
            </v-filter-bar>
            <!-- table -->
            <div class="tabl">
              <b-table :columns="columns" :data="list"
                height="400"
                :loading="listLoading"
                :highlight-row="paraType === 'I'"
                @on-current-change="handleCurrentRowChange">
                <template v-slot:personClass="{row}">{{ personClassMap[row.personClass] }}</template>
                <template v-slot:resProperty="{row}">{{ resPropertyMap[row.resProperty] }}</template>
                <template v-slot:action="{ row }">
                  <b-button :type="checkRowSelected(row) ? 'danger' : 'primary'" plain
                    @click="chooseOne(row)">
                    {{ checkRowSelected(row) ? '取消' : '选择' }}
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
          <b-col span="10">
            <b-card v-if="paraType === 'S'"
              class="box-card" head-tip
              header="已选资源信息">
              <b-tag type="info"
                :key="index"
                v-for="(tag,index) in selectedList"
                closable
                @on-close="handleCloseTag(index)">
                {{tag.resourceName}}
              </b-tag>
              <b-button type="primary" style="width: 100%;margin: 10px 0;"
                v-if="selectedList.length"
                @click="postSelectedList">
                确定添加
              </b-button>
            </b-card>

            <!-- <div v-else class="card-con">
              <b-card head-tip header="选择信息项">
                <b-table :data="infoItemList" :columns="columnsInfo"
                  :loading="infoTableLoading" height="400">
                  <template v-slot:dataType="{ row }">
                    {{ dataTypeMap[row.dataType] }}
                  </template>
                  <template v-slot:action="{ row }">
                    <b-button type="text" @click="handleRaiod(row)">
                      选择
                    </b-button>
                  </template>
                </b-table>
              </b-card>
            </div> -->

            <b-card v-else head-tip header="选择信息项(点击选择)">
              <b-tag type="info" style="cursor: pointer; margin: 4px;"
                v-for="item in infoItemList"
                :key="item.id"
                @on-click="handleRaiod(item)">
                {{ item.fieldTitle }}
              </b-tag>
            </b-card>
          </b-col>
        </b-row>
      </v-table-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getClassifyTree } from '../../../api/data-manage/classify.api'
  import { getPersonClassTree } from '../../../api/data-manage/metadata.api'
  import { getResInfoList, getResPropertyTree, getResDetail } from '../../../api/data-manage/res-info.api'

  export default {
    name: 'IndexManageEditSourceInfoSelect',
    mixins: [commonMixin, permission],
    props: {
      open: {
        type: Boolean
      },
      paraType: { // 参数类型 S 资源 I 信息项
        type: String
      }
    },
    data () {
      return {
        personClassMap: {},
        resPropertyMap: {},
        resPropertyOptions: [],
        listQuery: {
          resourceCode: '', // 所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '', // 资源性质
          availableStatus: 'available', // 可用状态 可用
          status: 'audited' // 状态 已发布
        },
        treeData: [],
        columns: [], // 初始化时根据参数类型paraType构建
        infoTableLoading: false, // 信息项table载入效果
        columnsInfo: [
          { title: '名称', key: 'fieldName', align: 'center' },
          { title: '标题', key: 'fieldTitle', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ], // 信息项表单columns
        infoItemList: [], // 存储信息项
        dataTypeMap: { // 信息项表单使用枚举对象
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        selectedList: [], // 已选择的数组
        curRow: null // 存储当前行
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
          this.init()
        } else {
          this.list = []
          this.treeData = []
          this.infoItemList = []
          this.selectedList = []
        }
      },
      // 树节点选择回调
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.resourceCode = node.code
        this.handleFilter()
      },
      // 重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          resourceCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别所属分类
          resourceName: '', // 资源名称(中文名)
          resProperty: '' // 资源性质
        }
        this.handleFilter()
      },
      // table当前行单选回调
      handleCurrentRowChange (row) {
        this.curRow = row // 缓存资源信息当前行
        this.infoTableLoading = true
        getResDetail(row.id).then(res => {
          this.infoItemList = res.data.data.items
          this.infoTableLoading = false
        })
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
      // 信息项选择按钮回调，单选
      handleRaiod (row) {
        this.$emit('choose-sin', {
          fieldName: row.fieldName,
          fieldTitle: row.fieldTitle,
          dataType: row.dataType,
          resourceName: this.curRow.resourceName, // 直接封装为中文名丢出去
          resourceKey: this.curRow.resourceKey
        })
        this.showDialog = false // 关闭弹框
      },
      // 用于检查是否选中
      checkRowSelected(row) {
        const dept = this.selectedList.find(item => {
          return item.resourceKey === row.resourceKey
        })
        return !!dept
      },
      // 选择按钮的回调
      chooseOne(row) {
        let index = this.selectedList.findIndex(item => {
          return item.resourceKey === row.resourceKey
        })
        if (index === -1) {
          this.selectedList.push({
            resourceName: row.resourceName,
            resourceDesc: row.resourceDesc,
            personClass: row.personClass,
            resProperty: row.resProperty,
            resourceKey: row.resourceKey
          })
        } else {
          this.selectedList.splice(index, 1)
        }
      },
      // 通用枚举
      getEnum() {
        // 主体类别树信息 code=A
        getPersonClassTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let personClasses = []
            let mapper = (node, parentCode) => {
              personClasses.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            // this.personClassOptions = data.children || []
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              this.personClassMap[item.key] = item.value
            })
          }
        })
        // 资源性质树信息 code=B
        getResPropertyTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let temp = []
            let mapper = (node, parentCode) => {
              temp.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            this.resPropertyOptions = data.children || []
            // 转换类型映射值（扁平化）
            temp.forEach(item => {
              this.resPropertyMap[item.key] = item.value
            })
          }
        })
      },
      // tree:初始化树结构
      initTree() {
        this.setListData() // 主要用于列表loading效果
        this.treeData = []
        // 请求响应返回树结构
        getClassifyTree('C').then(response => {
          const tree = response.data.data
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
            this.listQuery.resourceCode = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList() {
        getResInfoList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 初始化相关
      init () {
        this.getEnum()
        this.initTree()
        if (this.paraType === 'I') {
          this.columns = [
            { type: 'index', width: 50, align: 'center' },
            { title: '资源名称', key: 'resourceName', align: 'center' },
            { title: '主体类别', slot: 'personClass', align: 'center' },
            { title: '资源性质', slot: 'resProperty', align: 'center' }
          ]
        } else {
          this.columns = [
            { type: 'index', width: 50, align: 'center' },
            { title: '资源名称', key: 'resourceName', align: 'center' },
            { title: '主体类别', slot: 'personClass', align: 'center' },
            { title: '资源性质', slot: 'resProperty', align: 'center' },
            { title: '操作', slot: 'action', width: 150, align: 'center' }
          ]
        }
      }
    }
  }
</script>

<style lang="stylus">
  .source-select {
    .card-con .bin-card .bin-card__header {
      padding: 14px 20px !important;
    }
    .card-con .bin-card .bin-card__body {
      padding: 0 !important;
    }
  }
</style>

<style lang="stylus" scoped>
  .source-select {
    .table {
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
