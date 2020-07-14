<template>
  <div class="thumbnail">
    <b-modal v-model="open"
      title="设置新闻缩略图"
      footer-hide
      @on-visible-change="visibleChangeHandler">

      <b-form ref="form" :model="form" :label-width="70">
        <b-form-item label="缩略图">
          <img-upload ref="imgUpload" funName="cms" moduleName="thumbnail"
            :echoId="form.thumbnailPath"
            @success="val => form.thumbnailPath = val"
            @clear="imgClearHandler">
          </img-upload>
        </b-form-item>

        <b-form-item label="高度" prop="thumbnailHeight">
          <b-input-number style="width: 100%" :min="0"
            v-model="form.thumbnailHeight" placeholder="请输入缩略图高度">
          </b-input-number>
        </b-form-item>

        <b-form-item label="宽度" prop="thumbnailWidth">
          <b-input-number style="width: 100%" :min="0"
            v-model="form.thumbnailWidth" placeholder="请输入缩略图宽度">
          </b-input-number>
        </b-form-item>
      </b-form>

    </b-modal>
  </div>
</template>

<script>
  import ImgUpload from '../../../../components/ImgUpload'

  export default {
    name: 'Thumbnail',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      newsId: {
        type: String
      }
    },
    components: {
      ImgUpload
    },
    data () {
      return {
        open: this.value,
        form: {
          id: this.newsId,
          thumbnailId: null,
          width: null,
          height: null
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      visibleChangeHandler (visible) {
        console.log(visible)
      },

      imgClearHandler () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
 .thumbnail {

 }
</style>
