<template>
  <!--字典选择组件 for ResInfoItems.vue -->
  <b-modal v-model="chooseDialog" title="选择系统字典" width="860" class="layout-inner" :mask-closable="false">
    <div>
      <!--查询条件-->
      <v-filter-bar>
        <v-filter-item title="字典名称">
          <b-input v-model.trim="listQuery.groupName"  placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="字典编码" width="230px">
          <b-input v-model.trim="listQuery.groupCode"  placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading" >
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="primary" plain @click="chooseOne(scope.row)">选择</b-button>
        </template>
      </b-table>
    </div>
    <div slot="footer" class="t-right">
      <!--下方分页器-->
      <b-page :total="total" show-sizer :current.sync="listQuery.page"
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/sys/dict.api'

  export default {
    name: 'SysDictChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          groupName: '',
          groupCode: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典名称', key: 'groupName' },
          { title: '字典编码', key: 'groupCode' },
          { title: '操作', slot: 'action', width: 90, align: 'center' }
        ],
        chooseDialog: false
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },
      open() {
        this.chooseDialog = true
        this.resetQuery()
      },
      // 选中一个角色
      chooseOne(item) {
        this.chooseDialog = false
        // 拼接字符串groupName/groupCode
        const value = item.groupName + '/' + item.groupCode
        this.$emit('on-choose', value)
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getDictGroupList(this.listQuery).then(response => {
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
