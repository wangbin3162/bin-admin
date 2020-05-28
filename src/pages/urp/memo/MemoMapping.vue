<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="备忘录名称">
            <b-input v-model.trim="listQuery.memoName" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resourceName" placeholder="请输入" clearable/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:personClass="{row}">{{ personClassMap[row.personClass] }}</template>
          <template v-slot:isSys="{row}">{{ mapTypeMap[row.isSys] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <b-button :disabled="!canRemove" type="text" text-color="danger"
                      @click="handleRemove(row)">
              删除
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { requiredRule } from '../../../common/utils/validate'
  import * as api from '../../../api/urp/memo-mapping.api'

  export default {
    name: 'MemoMapping',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          memoName: '',
          resourceName: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '备忘录名称', key: 'memoName' },
          { title: '主体类型', slot: 'personClass', align: 'center', width: 150 },
          { title: '映射类型', slot: 'isSys', align: 'center', width: 200 },
          { title: '接口标识', key: 'ifcTagName' },
          { title: '资源名称', key: 'resourceName' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        personClassMap: { 'ZRP': '自然人', 'FO': '法人和其他组织' },
        mapTypeMap: { '1': '资源信息', '0': '外部接口' },
        mapping: null
      }
    },
    created() {
      this.resetMapping()
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          resourceName: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMapping()
        this.mapping = { ...this.mapping, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前映射吗？',
          content: '删除这条数据后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeMapping(row).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.$modal.remove()
            })
          }
        })
      },
      // 重置对象
      resetMapping() {
        this.mapping = {
          id: '',
          memoName: '',
          memoType: '',
          unionNum: 0,
          memoStatus: '0',
          fileCode: '',
          signDate: '',
          initiateDept: '',
          initiateDeptName: '',
          departs: [],
          measures: []
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        api.getMemoMappingList(this.listQuery).then(response => {
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
