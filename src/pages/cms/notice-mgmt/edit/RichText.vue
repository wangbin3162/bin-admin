<template>
  <div class="rich-text">
    <vue-tinymce v-model="content"
      :setting="setting">
    </vue-tinymce>
  </div>
</template>

<script>

  export default {
    name: 'NoticeMgmtRichText',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    components: {

    },
    data () {
      return {
        content: this.value,
        setting: {
          menubar: false,
          toolbar: 'undo redo | preview formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
          toolbar_drawer: 'sliding',
          plugins: 'preview link table lists quickbars paste',
          quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
          quickbars_insert_toolbar: false,
          paste_as_text: true,
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

    }
  }
</script>

<style>
  .tox-dialog-wrap__backdrop {
    background-color: rgba(255,255,255,0)!important;
  }
</style>
