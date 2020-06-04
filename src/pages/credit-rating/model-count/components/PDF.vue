<template>
  <div>
    <b-modal v-model="showDialog" title="PDF"
      width="65%"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="handleVisibleChange"
      @on-hidden="handleOnHidden">

      <iframe :src="src"
        style="height: 65vh; width: 100%; border: 0px none;">
      </iframe>

      <!-- <b-upload action="/" :before-upload="test">
        <b-button icon="ios-cloud-upload" plain type="primary"> 点击上传</b-button>
      </b-upload> -->
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
        console.log(pdfBlob)
        const reader = new FileReader()
        reader.readAsDataURL(pdfBlob)
        // reader.readAsArrayBuffer(pdfBlob)
        reader.onload = e => {
          // const pdfBlob = new Blob([e.target.result], { type: 'application/pdf' })
          // this.src = URL.createObjectURL(pdfBlob)
          this.src = e.target.result
        }
        return false
      },
      handleVisibleChange(visible) {
        if (visible) {
          this.init(this.pdfBlob)
        }
      },
      handleOnHidden () { // 弹框关闭动画结束后清理数据

      }
    }
  }
</script>
