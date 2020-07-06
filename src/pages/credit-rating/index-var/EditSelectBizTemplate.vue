<template>
  <div class="edit-belong-type">
    <b-modal v-model="showDialog" title="选择业务模板"
      width="70%"
      :styles="{ top: '5%' }"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="handleVisibleChange">
      <v-table-wrap class="con">
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>

        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="模板名称" style="max-width: 35%">
            <b-input v-model.trim="listQuery.tempName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码" style="max-width: 35%">
            <b-input v-model.trim="listQuery.tempCode" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <div class="table">
          <!--中央表格-->
          <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
            <!--操作栏-->
            <template v-slot:action="{ row }">
              <b-button type="primary" plain size="small"
                @click="handleSelect(row)">
                选择
              </b-button>
            </template>
          </b-table>
        </div>
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" size="small"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getTemplateTree, getBusinessTemplateList } from '../../../api/analyze-engine/da-business-temp.api.js'

  export default {
    name: 'IndexVarEditSelectBizTemplate',
    props: ['open'],
    mixins: [commonMixin, permission],
    data () {
      return {
        listQuery: {
          tempCode: '',
          tempName: '',
          tempType: ''
        },
        treeData: [
          {
            title: '业务分类',
            expand: true,
            children: [
              { title: '主题名称1' },
              { title: '主题名称2' },
              { title: '主题名称3' },
              { title: '主题名称4' }
            ]
          }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '模板名称', key: 'tempName' },
          { title: '模板编码', key: 'tempCode' },
          { title: '模板说明', key: 'tempDesc' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    computed: {
      showDialog: {
        get () {
          return this.open
        },
        set (val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created () {

    },
    methods: {
      handleVisibleChange (visible) {
        if (visible) {
          this.initTree()
        } else {

        }
      },
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.tempType = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          tempName: '',
          tempCode: ''
        }
        this.searchList()
      },
      handleSelect (row) {
        const params = row.fields.map(item => {
          return {
            paraName: item.paramName,
            paraCode: item.paramCode,
            paraDesc: item.paramDesc,
            paraType: '', // 扩展字段，用于参数管理下的参数类型
            disabled: true // 扩展字段，使其传递给参数管理组件可用于disabled
          }
        })
        // 构建对象，可直接赋值给编辑组件的form
        const tempObj = {
          tplId: row.id,
          tplContent: row.tempName,
          params
        }
        this.$emit('selected', tempObj)
        this.showDialog = false
      },
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getTemplateTree().then(response => {
          if (response.data.code === '0') {
            const tree = response.data.data[0]
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
              this.listQuery.tempType = this.currentTreeNode.code
              this.handleFilter()
            }
          }
        })
      },
      searchList() {
        this.setListData()
        getBusinessTemplateList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.edit-belong-type {
  .table {
    // max-height: 400px;
    // overflow-y: auto;
  }
}
</style>
