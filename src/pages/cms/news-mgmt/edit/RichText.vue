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
          toolbar: 'undo redo | preview formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
          toolbar_drawer: 'sliding',
          plugins: 'preview paste link image media table lists quickbars',
          quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
          quickbars_insert_toolbar: false,
          media_live_embeds: true,
          media_alt_source: false,
          media_poster: false,
          paste_data_images: true,
          file_picker_types: 'image media',
          file_picker_callback: this.uploadFile,
          language: 'zh_CN',
          language_url: 'tinymce/langs/zh_CN.js',
          height: 500,
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
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
      /**
       * @author haodongdong
       * @description tinymce 自定义上传函数
       */
      async uploadFile (callback, value, meta) {
        try {
          // 文件分类
          let filetype = ''
          // 为不同插件指定文件类型
          switch (meta.filetype) {
            case 'image':
              filetype = '.jpg, .jpeg, .png, .gif'
              break
            case 'media':
              filetype = '.mp3, .mp4'
              break
            default:
          }
          let input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', filetype)
          input.click()
          input.onchange = async () => {
            const file = input.files[0]
            if (file.size > 31457280) {
              this.$message({ type: 'warning', content: '上传文件请小于30mb' })
            } else {
              const res = await UploadPicture(this.contentId, file)
              callback(res.url)
            }
            input = null
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      }
    }
  }
</script>

<style>
  .tox-dialog-wrap__backdrop {
    background-color: rgba(255,255,255,0)!important;
  }
</style>
