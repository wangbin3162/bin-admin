<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.varName" placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="变量类型">
            <b-select v-model="listQuery.varType">
              <b-option v-for="item in varTypeOptions" :key="item.value"
                :value="item.value">{{ item.label }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:varName="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">{{ row.varName }}</b-button>
          </template>

          <template v-slot:varType="{ row }">
            {{ varTypeEnum[row.varType] }}
          </template>

          <template v-slot:dataType="{ row }">
            {{ dataTypeEnum[row.dataType] }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              修改
            </b-button>
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(row.id)">
                删除
              </b-button>
            </template>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <!-- 详情组件 -->
    <!-- <Detail v-if="isCheck" @close="handleCancel"
      :title="editTitle" :id="id"
      :varTypeEnum="varTypeEnum" :dataTypeEnum="dataTypeEnum"
      :paramTypeEnum="paramTypeEnum"></Detail> -->
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'

  export default {
    name: 'IndexVar',
    mixins: [commonMixin, permission],
    components: {
      // Detail
    },
    data () {
      return {
        moduleName: '变量',
        id: '', // 查看详情的id
        editData: null, // 编辑操作使用的数据
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '变量名称', slot: 'varName' },
          { title: '变量编码', key: 'varCode' },
          { title: '变量类型', slot: 'varType' },
          { title: '数据类型', slot: 'dataType' },
          { title: '模板内容', key: 'tplContent', ellipsis: true, tooltip: true },
          { title: '描述', key: 'varDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 120 }
        ],
        varTypeEnum: {},
        dataTypeEnum: {},
        paramTypeEnum: {},
        varTypeOptions: [], // 变量类型下拉框 用于父子组件
        dataTypeOptions: [], // 数据类型下拉框 用于子组件
        paramTypeOptions: [] // 参数类型下拉框  用于子组件
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          varName: '',
          varType: ''
        }
        this.searchList()
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (id) {
        this.id = id
        this.openEditPage('check')
      },
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      handleRemove (id) {
        // this.$confirm({
        //   title: '删除',
        //   content: '确定要删除当前指标变量吗？',
        //   loading: true,
        //   okType: 'danger',
        //   onOk: async () => {
        //     try {
        //       const [success, errorMsg] = await deleteIndexVar(id)
        //       if (success) {
        //         this.$message({ type: 'success', content: '操作成功' })
        //         this.searchList()
        //       } else {
        //         this.$notice.danger({ title: '操作错误', desc: errorMsg })
        //       }
        //     } catch (error) {
        //       this.$notice.danger({ title: '操作错误', desc: error })
        //     }
        //     this.$modal.remove()
        //   }
        // })
      },
      // 处理编辑框关闭事件
      handleClose () {
        // 清空可能存在的待编辑数据
        this.editData = null
        this.handleCancel()
      },
      async searchList () {
        // this.listLoading = true
        // try {
        //   const res = await getIndexVarList(this.listQuery)
        //   this.setListData({
        //     list: res.rows,
        //     total: res.total
        //   })
        // } catch (error) {
        //   console.log(error)
        // }
        // this.listLoading = false
      },
      // 或许所需的枚举值
      async getEnum () {
        // try {
        //   const [varType, dataType, paramType] = await Promise.all([
        //     getEvalVarType(), getEvalDataType(), getEvalParamType()
        //   ])
        //   this.varTypeEnum = varType
        //   this.dataTypeEnum = dataType
        //   this.paramTypeEnum = paramType
        //   this.initOptions()
        // } catch (error) {
        //   console.log(error)
        // }
      }
    }
  }
</script>
