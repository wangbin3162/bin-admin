<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="变量类型">
            <b-select>
              <b-option :value="''">连续型</b-option>
              <b-option :value="''">离散型</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!-- 是否有删除键 -->
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!-- 编辑组件 -->
    <Edit v-show="isEdit" :title="editTitle" @close="handleCancel"></Edit>
    <!-- 详情组件 -->
    <Detail v-show="isCheck" :title="editTitle" @close="handleCancel"></Detail>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import Detail from '@/pages/credit-rating/index-var/Detail'
  import { getIndexVarList } from '../../../api/credit-rating/index-var.api'

  export default {
    name: 'IndexVar',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail
    },
    data () {
      return {
        moduleName: '变量',
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'name' },
          { title: '描述', key: 'desc' },
          { title: '编码', key: 'code' },
          { title: '变量类型', key: 'varType' },
          { title: '数据类型', key: 'dataType' },
          { title: '模板类型', key: 'tempType' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    created () {
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
      handleCheck () {
        this.openEditPage('check')
      },
      handleModify () {
        this.openEditPage('modify')
      },
      handleRemove () {

      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getIndexVarList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      }
    }
  }
</script>
