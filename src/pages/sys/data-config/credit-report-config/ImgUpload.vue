<template>
  <div class="img-upload">
    <b-upload action="/" type="drag" :show-upload-list="false"
      :before-upload="handleUpload" :disabled="disabled">
      <div v-if="!hasFile"
        class="con" flex="dir:top main:center cross:center">
        <p>
          <b-icon name="ios-add" size="52" style="color: #3399ff"></b-icon>
        </p>
        <p>点击或拖拽上传</p>
      </div>
      <b-loading fix :show-text="loadiingText" v-if="uploading"></b-loading>
      <img v-if="hasFile" :class="{ 'show-model': showModel}" :src="imgSrc"/>
    </b-upload>

    <b-button v-if="hasFile && !showModel" @click="clearImg">清 空</b-button>
  </div>
</template>

<script>
  import { fileUpload, fileDownLoad } from '../../../../api/import-export.api'

  export default {
    name: 'ImgUpload',
    props: {
      moduleName: {
        type: String,
        required: true
      },
      echoId: { // 用于编辑时下载回显 回显id
        type: String,
        default: null
      },
      showModel: { // 用于下载显示的模式，可用在详情中
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        pointerEvent: 'auto', // 用于上传时禁止点击
        disabled: false, // 用于上传时禁止点击
        loadiingText: '上传中....',
        uploading: false,
        hasFile: false,
        imgSrc: ''
      }
    },
    created () {
      this.init()
    },
    methods: {
      // 上传前的回调
      handleUpload (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.imgSrc = e.target.result
          this.hasFile = true

          this.fileUpload(this.moduleName, file)
        }
        return false
      },
      // 清空按钮回调
      clearImg () {
        this.hasFile = false
        this.imgSrc = ''
        this.$emit('clear') // 清除图片事件
      },
      // 图片上传请求
      async fileUpload (moduleName, file) {
        this.loadiingText = '上传中....'
        this.uploading = true
        this.disabled = true

        try {
          const res = await fileUpload(moduleName, file)
          this.$emit('success', res) // 上传成功事件
          this.$message({ type: 'success', content: '图片上传 成功' })
        } catch (error) {
          this.$emit('fail') // 上传失败事件
          this.$notice.danger({ title: '上传失败', desc: error })
        }

        this.uploading = false
        this.disabled = false
      },
      // 图片下载请求
      async fileDownload (moduleName, id) {
        this.loadiingText = '下载中....'
        this.uploading = true
        this.disabled = true

        try {
          const res = await fileDownLoad(moduleName, id)
          const reader = new FileReader()
          reader.readAsDataURL(res)
          reader.onload = e => {
            this.imgSrc = e.target.result
            this.hasFile = true
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '图片下载失败', desc: error })
        }

        this.uploading = false
        this.disabled = false
        if (this.showModel) this.disabled = true // 如果时显示模式则禁止上传
      },
      init () {
        if (this.echoId) {
          this.fileDownload(this.moduleName, this.echoId)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .img-upload {
    position: relative;
    max-width: 200px;
    text-align: center;

    .con {
      padding: 20px 0;
      border:1px dashed #eee;
      cursor: pointer;

    }
    img {
      max-width: 100%;
    }
    .show-model {
      display: block
    }
  }
</style>
