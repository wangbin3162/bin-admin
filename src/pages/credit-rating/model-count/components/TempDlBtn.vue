<template>
  <b-button plain icon="ios-arrow-round-down" @click="clickHandler">
    <slot>模板下载</slot>
  </b-button>
</template>

<script>
  import Util from '../../../../common/utils/util'
  import { templateDownload } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'TempDlBtn',
    props: ['personClass'],
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      async clickHandler () {
        try {
          const res = await templateDownload(this.personClass)
          let fileName = this.personClass === 'A01' ? '自然人模板.xlsx' : '法人模板.xlsx'
          Util.downloadFile(res, fileName)
        } catch (error) {
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      }
    }
  }
</script>
