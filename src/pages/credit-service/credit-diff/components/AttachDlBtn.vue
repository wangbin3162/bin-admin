<template>
  <b-button plain icon="ios-arrow-round-down" size="small" @click="clickHandler">
    <slot>下载</slot>
  </b-button>
</template>

<script>
  import Util from '../../../../common/utils/util'
  import { attachmentDownload } from '../../../../api/credit-service/diff-app.api'

  export default {
    name: 'TempDlBtn',
    props: [
      'id',
      'fileName'
    ],
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      async clickHandler () {
        try {
          const res = await attachmentDownload(this.id)
          Util.downloadFile(res, this.fileName)
        } catch (error) {
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      }
    }
  }
</script>
