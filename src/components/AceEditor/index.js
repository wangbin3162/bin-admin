let ace = require('brace')

module.exports = {
  name: 'BAceEditor',
  render(h) {
    let height = this.height ? this.px(this.height) : '100%'
    let width = this.width ? this.px(this.width) : '100%'
    return h('div', {
      style: {
        width,
        height,
        border: '1px solid #e8e8e8'
      }
    })
  },
  props: {
    value: String,
    lang: true,
    theme: String,
    height: true,
    width: true,
    options: Object,
    readonly: Boolean
  },
  data() {
    return {
      editor: null,
      contentBackup: ''
    }
  },
  methods: {
    px(n) {
      if (/^\d*$/.test(n)) {
        return n + 'px'
      }
      return n
    }
  },
  watch: {
    value(val) {
      if (this.contentBackup !== val) {
        this.editor.session.setValue(val, 1)
        this.contentBackup = val
      }
    },
    theme(newTheme) {
      this.editor.setTheme('ace/theme/' + newTheme)
    },
    lang(newLang) {
      this.editor.getSession().setMode(typeof newLang === 'string' ? ('ace/mode/' + newLang) : newLang)
    },
    options(newOption) {
      this.editor.setOptions(newOption)
    },
    height() {
      this.$nextTick(function () {
        this.editor.resize()
      })
    },
    width() {
      this.$nextTick(function () {
        this.editor.resize()
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted() {
    let vm = this
    let lang = this.lang || 'text'
    let theme = this.theme || 'chrome'

    require('brace/ext/emmet')

    let editor = vm.editor = ace.edit(this.$el)
    editor.$blockScrolling = Infinity

    this.$emit('init', editor)

    // editor.setOption("enableEmmet", true);
    editor.getSession().setMode(typeof lang === 'string' ? ('ace/mode/' + lang) : lang)
    editor.setTheme('ace/theme/' + theme)
    // 设置只读
    if (this.readonly) {
      editor.setReadOnly(true)
    }
    if (this.value) {
      editor.setValue(this.value, 1)
    }
    this.contentBackup = this.value

    editor.on('change', function () {
      let content = editor.getValue()
      vm.$emit('input', content)
      vm.$emit('on-change', content)
      vm.contentBackup = content
    })
    if (vm.options) {
      editor.setOptions(vm.options)
    }
  }
}
