<template>
  <div class="rich-text">
    <vue-tinymce v-model="content"
      :setup="setup"
      :setting="setting">
    </vue-tinymce>
  </div>
</template>

<script>
  export default {
    name: 'RichText',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        content: this.value,
        setting: {
          menubar: false,
          toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
          toolbar_drawer: 'sliding',
          quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
          plugins: 'link image media table lists fullscreen quickbars',
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
    methods: {
      setup(editor) {

      }
    }
  }
</script>
