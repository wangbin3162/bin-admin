<template>
  <div class="top-search">
    <div class="type-wrap">
      <span :class="{'active':current.type==='1'}" @click="changeType('1')">法人和其他组织</span>
      <span :class="{'active':current.type==='2'}" @click="changeType('2')">自然人</span>
    </div>
    <div class="input-wrap" flex="main:justify">
      <div class="input">
        <label>
          <input v-model="current.q" @input="emitValue" :placeholder="placeholderLabel" @keyup.enter="handleSearch"/>
        </label>
        <span class="search-btn" @click="handleSearch" v-waves>查询</span>
        <b-icon class="clear-btn" name="ios-close" v-if="this.current.q.length>0"
                @click.native="handleClear"></b-icon>
      </div>
      <span class="back" @click="$emit('on-back')">返回</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'top-search',
    props: {
      value: {
        type: Object,
        default () {
          return {
            type: '1', // 1法人，2自然人
            reason: '', // 1核查报告，2信用档案
            q: '' // 查询条件
          }
        }
      }
    },
    data () {
      return {
        current: {},
        type: '1', // 1 法人，2自然人
        q: ''
      }
    },
    watch: {
      value: {
        handler (val) {
          this.current = { ...val }
        },
        immediate: true
      }
    },
    computed: {
      typeLabel () {
        const typeMap = {
          '1': '法人',
          '2': '自然人'
        }
        return typeMap[this.current.type]
      },
      placeholderLabel () {
        return this.current.type === '1' ? '请输入企业名称、统一社会信用代码、工商注册号、组织机构代码等' : '请输入自然人名称'
      }
    },
    methods: {
      changeType (type) {
        if (this.current.type !== type) {
          this.current.type = type
        }
        this.emitValue()
      },
      handleSearch () {
        this.$emit('on-search')
      },
      handleClear () {
        this.current.q = ''
        this.emitValue()
        this.$emit('on-clear')
      },
      emitValue () {
        this.$emit('input', this.current)
        this.$emit('on-change', this.current)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .top-search {
    width: 840px;
    .type-wrap {
      margin-bottom: 5px;
      span {
        display: inline-block;
        padding: 0 12px;
        margin: 0 5px;
        font-size: 12px;
        color: #4f5968;
        cursor: pointer;
        transition: .3s;
        &.active {
          color: #1badf8;
        }
      }
    }
    .input-wrap {
      .input {
        position: relative;
        width: 750px;
        display: flex;
        label {
          flex: 1;
          input {
            width: 100%;
            height: 34px;
            line-height: 1.5;
            padding: 0 15px;
            font-size: 14px;
            border: 1px solid transparent;
            color: #515a6e;
            background-color: #f5f5f5;
            background-image: none;
            cursor: text;
            outline: 0;
          }
        }
        .search-btn {
          width: 72px;
          cursor: pointer;
          font-size: 14px;
          height: 34px;
          line-height: 34px;
          color: #fff;
          background: #369fff;
          text-align: center;
        }
        .clear-btn {
          position: absolute;
          display: none;
          right: 75px;
          top: 10px;
          font-size: 16px;
          cursor: pointer;
        }
        &:hover .clear-btn {
          display: block;
        }
      }
      .back {
        cursor: pointer;
        line-height: 34px;
        padding: 0 20px;
        border-radius: 18px;
        background-color: #f5f5f5;
        color: #333;
      }
    }
  }
</style>
