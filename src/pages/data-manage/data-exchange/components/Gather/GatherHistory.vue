<template>
  <b-modal v-model="historyDialog" title="查看历史" width="860" :mask-closable="false"
           append-to-body>
    <b-table :columns="columns" :data="historyList" size="small"></b-table>
    <div slot="footer">
      <b-page :total="total" :current.sync="listQuery.page"
              @on-change="handleCurrentChange"></b-page>
    </div>
  </b-modal>
</template>

<script>
  import * as api from '../../../../../api/data-manage/gather.api'

  export default {
    name: 'GatherHistory',
    data() {
      return {
        historyDialog: false,
        historyList: [],
        listQuery: {
          page: 1,
          size: 10,
          recordId: ''
        },
        total: 0,
        columns: [
          { title: '操作类型', key: 'operationType' },
          { title: '操作人', key: 'operatorName' },
          { title: '业务类型', key: 'serviceType' },
          { title: '操作时间', key: 'operatorTime' }
        ]
      }
    },
    methods: {
      // 打开弹窗
      open(recordId) {
        this.listQuery.recordId = recordId
        this.searchList()
      },
      handleCurrentChange(page) {
        this.listQuery.page = page
        this.searchList()
      },
      searchList() {
        api.getHistory(this.listQuery).then(res => {
          if (res.status === 200) {
            this.historyDialog = true
            this.historyList = res.data.rows
          }
        })
      }
    }
  }
</script>
