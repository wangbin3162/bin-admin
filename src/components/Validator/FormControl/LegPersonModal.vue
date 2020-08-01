<template>
  <!--选择法人弹窗 -->
  <b-modal v-model="dialogFormVisible" title="选择法人" width="860"
           append-to-body :mask-closable="false">
    <div style="padding: 0;">
      <!--查询条件-->
      <v-filter-bar @keyup-enter="handleFilter">
        <v-filter-item title="名称">
          <b-input v-model.trim="listQuery.compName" placeholder="输入名称" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <!--操作栏-->
        <template v-slot:action="{row}">
          <b-button type="text" @click="chooseOne(row)">选择</b-button>
        </template>
      </b-table>
    </div>
    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import { getLegList } from '../../../api/data-manage/gather.api'

  export default {
    name: 'LegPersonModal',
    mixins: [commonMixin],
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          compName: '' // 名称
        },
        columns: [
          { title: '名称', key: 'compName' },
          { title: '证件类型', key: 'idTypeName' },
          { title: '证件号码', key: 'idCode' },
          { title: '操作', slot: 'action', width: 100 }
        ]
      }
    },
    methods: {
      open() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          compName: '' // 名称
        }
        this.handleFilter()
      },
      chooseOne(item) {
        this.$emit('choose-one', item)
        this.dialogFormVisible = false
      },
      // 查询所有法人列表
      searchList() {
        this.setListData()
        getLegList(this.listQuery).then(response => {
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
