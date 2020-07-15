<template>
  <div class="rich-text">
    <vue-tinymce v-model="content"
      :setting="setting">
    </vue-tinymce>

    <file-upload :contentId="contentId"></file-upload>
  </div>
</template>

<script>
  import { UploadPicture } from '../../../../api/cms/news-mgmt.api'
  import FileUpload from './FileUpload'

  export default {
    name: 'RichText',
    props: {
      value: {
        type: String,
        required: true
      },
      contentId: {
        type: String,
        default: null
      }
    },
    components: {
      FileUpload
    },
    data () {
      return {
        content: this.value,
        setting: {
          menubar: false,
          toolbar: 'undo redo | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
          toolbar_drawer: 'sliding',
          plugins: 'link image table lists quickbars',
          quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
          quickbars_insert_toolbar: false,
          images_upload_handler: this.uploadFile,
          language: 'zh_CN',
          language_url: '/tinymce/langs/zh_CN.js',
          height: 500
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.content = newVal
        }
      },
      content: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      async uploadFile (blobInfo, successFun, failFun) {
        try {
          const file = blobInfo.blob()
          const res = await UploadPicture(this.contentId, file)
          successFun(res)
        } catch (error) {
          failFun(error)
        }
      }
    }
  }
</script>
