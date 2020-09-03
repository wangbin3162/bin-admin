<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="表单据名称" :span="8">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    icon="ios-add-circle-outline"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">编辑</b-button>
            <!--是否有删除键-->
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <fm-container ref="fmContainer"></fm-container>
  </div>
</template>

<script>
import commonMixin from '../../../common/mixins/mixin'
import FmContainer from '@/components/FormMaking/Container'

export default {
  name: 'TableDemo',
  components: { FmContainer },
  mixins: [commonMixin],
  data() {
    return {
      listQuery: {
        name: ''
      },
      columns: [
        { title: '表单据名称', key: 'name' },
        { title: '表名', key: 'tableName' },
        { title: '创建日期', key: 'createDate' },
        { title: '操作', slot: 'action', width: 140 }
      ]
    }
  },
  created() {
    this.resetFormTable()
    this.searchList()
  },
  methods: {
    // filter-Bar:重置查询条件
    resetQuery() {
      this.listQuery = {
        page: 1,
        size: 10,
        name: ''
      }
    },
    // 新增按钮事件
    handleCreate() {
      this.resetFormTable()
      this.$refs.fmContainer.open(this.widgetForm)
    },
    // 编辑事件
    handleModify(row) {
      // this.openEditPage('modify')
    },
    // 查看按钮事件
    handleCheck(row) {
      // this.openEditPage('check')
    },
    // 弹窗提示是否删除
    handleRemove(row) {
      this.$notice.success({ title: '删除成功' })
    },
    /* [数据接口] */
    // 重置栏目对象
    resetFormTable() {
      this.widgetForm = {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      }
    },
    // 查询所有部门列表
    searchList() {
      // 模拟获取列表数据
      this.setListData({
        list: [
          { name: '测试表单据', tableName: 'TABLE_TEST', createDate: '1990-04-22' }
        ],
        total: 1
      })
    }
  }
}
</script>
