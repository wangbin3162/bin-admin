<template>
  <!--元信息选择 for ResInfo.vue -->
  <b-modal v-model="chooseDialog" title="选择元信息" width="860" class="layout-inner" :mask-closable="false">
    <!--查询条件-->
    <v-filter-bar>
      <v-filter-item title="元信息名称">
        <b-input v-model.trim="listQuery.tableName" size="small" placeholder="元信息英文名" clearable></b-input>
      </v-filter-item>
      <v-filter-item title="元信息描述">
        <b-input v-model.trim="listQuery.metadataName" size="small" placeholder="元信息中文名" clearable></b-input>
      </v-filter-item>
      <!--添加查询按钮位置-->
      <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
    </v-filter-bar>
    <!--中央表格-->
    <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="primary" size="mini" plain @click="chooseOne(scope.row)">
          选择
        </b-button>
      </template>
    </b-table>
    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" show-sizer :current.sync="listQuery.page"
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/data-manage/metadata.api'

  export default {
    name: 'MetaDataChoose',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          metadataCode: '', // 类目类别
          tableName: '', // 元信息英文名
          metadataName: '', // 元信息中文名
          status: 'audited'// 状态
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '元信息名称', key: 'tableName' },
          { title: '元信息描述', key: 'metadataName' },
          { title: '操作', slot: 'action', width: 100 }
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
          metadataCode: '', // 类目类别,默认全部
          tableName: '', // 元信息英文名
          metadataName: '', // 元信息中文名
          status: 'audited'// 状态
        }
        this.handleFilter()
      },
      open() {
        this.chooseDialog = true
        this.resetQuery()
      },
      // 选中一个角色
      chooseOne(item) {
        api.getFieldsByID(item.id).then(res => {
          const metadata = res.data.data
          this.chooseDialog = false
          this.$emit('on-choose', {
            tableName: metadata.tableName,
            metadataName: metadata.metadataName,
            personClass: metadata.personClass,
            metadataCode: metadata.metadataCode,
            metadataKey: metadata.metadataKey,
            fields: metadata.fields
          })
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getMetadataList(this.listQuery).then(response => {
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
