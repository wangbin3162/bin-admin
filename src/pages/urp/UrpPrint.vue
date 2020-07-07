<template>
  <iframe :src="pdfStr" width="100%" height="100%" style="border: none;"/>
</template>

<script>
  import * as api from '../../api/urp.api'

  export default {
    name: 'UrpPrint',
    data() {
      return {
        pdfStr: ''
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        // 先从地址栏拉取请求
        let { recordId } = this.$route.query
        api.print(recordId).then(resp => {
          this.pdfStr = window.URL.createObjectURL(resp.data)
        })
      }
    },
    beforeDestroy() {
      window.URL.revokeObjectURL(this.pdfStr)
    }
  }
</script>
