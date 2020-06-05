<template>
  <div>
    <b-modal v-model="showDialog" title="PDF"
      width="65%"
      :styles="{ top: '5px' }"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="handleVisibleChange"
      @on-opened="handleOnOpened"
      @on-hidden="handleOnHidden">
      <!-- <b-loading fix show-text="加载中...." v-if="loading"></b-loading> -->

      <iframe :src="src"
        style="height: calc(100vh - 70px); width: 100%; border: 0px none;">
      </iframe>

    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'PDF',
    props: [
      'open',
      'pdfBlob'
    ],
    data () {
      return {
        loading: false,
        loaded: false,
        src: ''
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created () {

    },
    methods: {
      init (pdfBlob) {
        this.loading = true
        const reader = new FileReader()
        reader.readAsDataURL(pdfBlob)
        // reader.readAsArrayBuffer(pdfBlob)
        reader.onload = e => {
          // const pdfBlob = new Blob([e.target.result], { type: 'application/pdf' })
          // this.src = URL.createObjectURL(pdfBlob)
          this.src = e.target.result
          this.loading = false
        }
        return false
      },
      handleVisibleChange(visible) {
        if (visible) {
          this.init(this.pdfBlob)
        }
      },
      handleOnOpened () {

      },
      handleOnHidden () { // 弹框关闭动画结束后清理数据
        this.src = ''
      }
    }
  }
</script>
