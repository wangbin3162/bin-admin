<template>
  <b-modal v-model="historyDialog" title="查看历史" width="860" :mask-closable="false"
           append-to-body>
    <b-table :columns="columns" :data="historyList" stripe ref="table" :width="820"></b-table>
    <div slot="footer" class="t-center">
      <b-button size="small" @click="historyDialog=false">取消</b-button>
    </div>
  </b-modal>
</template>

<script>
  import * as api from '../../../../../api/dir/gather.api'

  export default {
    name: 'GatherHistory',
    data() {
      return {
        historyDialog: false,
        historyList: [],
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
        api.getHistory(recordId).then(res => {
          if (res.status === 200) {
            this.historyDialog = true
            this.historyList = res.data.rows
          }
        })
      }
    }
  }
</script>
