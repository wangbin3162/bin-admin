<template>
  <div class="validator-wrap">
    <div style="width: 100%;line-height:32px;" flex="main:justify">
      <span>校验: </span>
      <v-toggle-show v-model="showReal" show-text="显示实际值" hide-text="隐藏实际值"/>
    </div>
    <b-checkbox v-model="isRequired">必填项</b-checkbox>&nbsp;&nbsp;
    <div v-show="showReal">
      <b-input v-model="value" readonly/>
    </div>
  </div>
</template>

<script>
  import VToggleShow from '../../../../../components/VToggleShow/index'

  export default {
    name: 'Validator',
    components: { VToggleShow },
    props: {
      value: {
        type: String
      },
      required: { // 配置项类型，用于判断是否是必填项
        type: String
      },
      controlType: { // 控件类型，用于判断trigger 类型，blur or change
        type: String
      },
      dataType: { // 数据类型，用于判断校验器的输入类型
        type: String
      }
    },
    data() {
      return {
        showReal: true,
        isRequired: false,
        checkRules: null // 最终的格式化rules 对象，数组，
      }
    },
    watch: {
      value: {
        handler(val) {
          try {
            this.checkRules = JSON.parse(val)
          } catch (e) {
            this.checkRules = null
          }
          console.log(this.checkRules)
        },
        immediate: true
      },
      required: {
        handler(val) {
          this.isRequired = val === 'Y' // 根据是否是核心项来设置是否是必填
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue() {
        this.$emit('input', this.checkRules)
        this.$emit('on-change', this.checkRules)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .validator-wrap {
    width: 100%;
    margin-bottom: 16px;
  }
</style>
