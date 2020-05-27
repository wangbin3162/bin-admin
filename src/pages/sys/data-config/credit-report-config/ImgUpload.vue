<template>
  <div class="img-upload" :style="{ pointerEvents: pointerEvent }">
    <b-upload action="/" type="drag"
      :before-upload="handleUpload">
      <div>
      </div>
      <div v-if="!hasFile"
        class="con" flex="dir:top main:center cross:center">
          <p>
            <b-icon name="ios-add" size="52" style="color: #3399ff"></b-icon>
          </p>
          <p>点击或拖拽上传</p>
      </div>
      <b-loading fix show-text="上传中...." v-if="uploading"></b-loading>
      <img v-if="hasFile" :src="imgSrc" />
    </b-upload>

    <b-button v-if="hasFile" @click="clearImg">清 空</b-button>
  </div>
</template>

<script>
  import { fileUpload } from '../../../../api/import-export.api'

  export default {
    name: 'ImgUpload',
    props: {
      moduleName: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        pointerEvent: 'auto', // 用于上传时禁止点击
        uploading: false,
        hasFile: false,
        imgSrc: ''
      }
    },
    created () {

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
        try {
          this.uploading = true
          this.pointerEvent = 'none'
          const res = await fileUpload(moduleName, file)
          this.$emit('success', res) // 上传成功事件
          this.$message({ type: 'success', content: '图片上传 成功' })
        } catch (error) {
          this.$emit('fail') // 上传失败事件
          this.$notice.danger({ title: '上传失败', desc: error })
        }
        this.uploading = false
        this.pointerEvent = 'auto'
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
  }
</style>
