<template>
  <div class="input-wrap" :style="inputStyle">
    <b-select style="width:100px;" v-model="current.type" :size="size"
              @on-change="changeType">
      <b-option value="FO">法人</b-option>
      <b-option value="ZRP">自然人</b-option>
    </b-select>
    <b-input v-model="current.keyword" clearable :size="size" style="margin-left: -1px;"
             @on-change="emitValue" :placeholder="placeholder" @on-enter="handleSearch"
             @on-clear="handleClear"></b-input>
    <b-button style="width:100px;margin-left: -1px;" type="primary" :size="size" v-waves
              @click="handleSearch">查 询
    </b-button>
  </div>
</template>

<script>
  import { isEmpty } from '../../../common/utils/assist'

  export default {
    name: 'UrpSearch',
    props: {
      value: {
        type: Object,
        default() {
          return {
            keyword: '',
            type: 'FO' // [FO,ZRP]
          }
        }
      },
      width: {
        type: String,
        default: '800px'
      },
      placeholder: {
        type: String,
        default: '请输入内容'
      },
      size: {
        type: String,
        default: 'large'
      }
    },
    data() {
      return {
        current: {}
      }
    },
    computed: {
      inputStyle() {
        return {
          width: this.width
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = { ...val }
        },
        immediate: true
      }
    },
    methods: {
      changeType(type) {
        if (this.current.type !== type) {
          this.current.type = type
        }
        this.emitValue()
      },
      handleSearch() {
        if (isEmpty(this.current.keyword)) {
          this.$message({ type: 'danger', content: '查询内容不能为空！' })
          return
        }
        this.$emit('on-search')
      },
      handleClear() {
        this.current.keyword = ''
        this.emitValue()
        this.$emit('on-clear')
      },
      emitValue() {
        this.$emit('input', this.current)
        this.$emit('on-change', this.current)
      }
    }
  }
</script>
