<template>
  <b-button :type="btnType" plain icon="ios-arrow-round-down"
    size="small"
    @click="clickHandler">
    <slot>下载</slot>
  </b-button>
</template>

<script>
  // import Util from '../../../../common/utils/util'
  import { attachmentDownload } from '../../../api/credit-service/credit-diff.api'

  export default {
    name: 'TempDlBtn',
    props: {
      id: {
        type: String,
        required: true
      },
      fileName: {
        type: String,
        required: true
      },
      btnType: {
        type: String,
        default: 'primary'
      }
    },
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
          this.downloadFile(res, this.fileName)
        } catch (error) {
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      },
      downloadFile (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(link.href)
        }
      }
    }
  }
</script>
