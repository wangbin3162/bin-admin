<template>
  <div class="base-search">
    <div class="type-wrap" v-if="isDefault">
      <span :class="{'active':current.type==='1'}" @click="changeType('1')">法人和其他组织</span>
      <span :class="{'active':current.type==='2'}" @click="changeType('2')">自然人</span>
    </div>
    <div class="input-wrap" :class="size" flex="main:justify">
      <div class="input">
        <!--small版本前边下拉选择-->
        <b-dropdown v-if="size==='small'" trigger="click">
          <div class="select type">
          <span>
            {{ typeLabel }}
            <b-icon name="md-arrow-dropdown" size="20"></b-icon>
          </span>
          </div>
          <b-dropdown-menu slot="list" style="width: 100px;">
            <b-dropdown-item :selected="current.type==='1'" @click.native="changeType('1')">
              <span class="options">法人</span>
            </b-dropdown-item>
            <b-dropdown-item :selected="current.type==='2'" @click.native="changeType('2')">
              <span class="options">自然人</span>
            </b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
        <label>
          <input v-model="current.q" @input="emitValue" :placeholder="placeholderLabel" @keyup.enter="handleSearch"/>
        </label>
        <b-icon class="clear-btn" name="ios-close" v-if="this.current.q.length>0" @click.native="handleClear"></b-icon>
        <span class="search-btn" @click="handleSearch" v-waves>查询</span>
      </div>
      <!--选择查询原因-->
      <b-dropdown trigger="click">
        <div class="select">
          <span>
            {{ reasonLabel }}
            <b-icon name="md-arrow-dropdown" size="20"></b-icon>
          </span>
        </div>
        <b-dropdown-menu slot="list" style="width: 140px;">
          <b-dropdown-item v-for="(obj,key) in reasonMap" :key="key"
                           :selected="current.reason===key" @click.native="changeReason(key)">
            <span class="options">{{ obj }}</span>
          </b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
    </div>
    <div class="tip" v-if="isDefault">查看自然人、法人信用档案</div>
  </div>
</template>

<script>
  import { queryReason } from '../../api/search.api'

  export default {
    name: 'BaseSearch',
    props: {
      size: {
        type: String,
        default: 'default'
      },
      value: {
        type: Object,
        default() {
          return {
            type: '1', // 1法人，2自然人
            reason: '', // 1核查报告，2信用档案
            q: '' // 查询条件
          }
        }
      }
    },
    data() {
      return {
        current: {},
        reasonMap: {
          '1': '核查报告',
          '2': '信用档案'
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
    computed: {
      isDefault() {
        return this.size === 'default'
      },
      typeLabel() {
        const typeMap = {
          '1': '法人',
          '2': '自然人'
        }
        return typeMap[this.current.type]
      },
      reasonLabel() {
        return this.current.reason.length === 0 ? '选择查询原因' : this.reasonMap[this.current.reason]
      },
      placeholderLabel() {
        return this.current.type === '1' ? '请输入企业名称、统一社会信用代码、工商注册号、组织机构代码' : '请输入自然人名称'
      }
    },
    created() {
      queryReason().then(resp => {
        if (resp.data.code === '0') {
          this.reasonMap = resp.data.data
        }
      })
    },
    methods: {
      changeType(type) {
        if (this.current.type !== type) {
          this.current.type = type
        }
        this.emitValue()
      },
      changeReason(key) {
        if (this.current.reason !== key) {
          this.current.reason = key
        }
        this.emitValue()
      },
      handleSearch() {
        this.$emit('on-search')
      },
      handleClear() {
        this.current.q = ''
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

<style scoped lang="stylus">
  .base-search {
    width: 1040px;
    margin: 0 auto;
    .type-wrap {
      margin-bottom: 10px;
      span {
        display: inline-block;
        padding: 6px 12px 5px;
        margin: 0 5px;
        border-radius: 15px;
        font-size: 15px;
        cursor: pointer;
        transition: .3s;
        color: #fff;
        &.active {
          background: #fff;
          color: #0398ec;
        }
      }
    }
    .input-wrap {
      .input {
        position: relative;
        width: 885px;
        display: flex;
        label {
          flex: 1;
          input {
            width: 100%;
            height: 50px;
            line-height: 1.5;
            padding: 0 15px;
            font-size: 14px;
            border: 1px solid #fff;
            border-right: none;
            color: #515a6e;
            background-color: #fff;
            background-image: none;
            cursor: text;
            outline: 0;
          }
        }
        .search-btn {
          width: 100px;
          cursor: pointer;
          font-size: 18px;
          height: 50px;
          line-height: 52px;
          color: #ffffff;
          background: #2f8bfd;
          text-align: center;
        }
        .clear-btn {
          position: absolute;
          display: none;
          right: 110px;
          top: 50%;
          margin-top: -12px;
          font-size: 26px;
          cursor: pointer;
        }
        &:hover .clear-btn {
          display: block;
        }
      }
      .select {
        cursor: pointer;
        height: 50px;
        width: 140px;
        line-height: 49px;
        border: 1px solid #fff;
        color: #999999;
        background: #fff;
        text-align: center;
      }
      .options {
        display: inline-block;
        width: 100%;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
      &.small {
        padding: 0 96px;
        .input {
          width: 700px;
          input {
            height: 36px;
            line-height: 1.5;
            border-color: transparent;
          }
          .search-btn {
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            color: #fff;
            background: #0083eb;
          }
        }
        .select {
          width: 140px;
          cursor: pointer;
          height: 36px;
          line-height: 36px;
          border-color: transparent;
          &.type {
            width: 100px;
            border-right: 1px solid #e5effa;
          }
        }
        .options {
          line-height: 1.5em;
        }
      }
    }
    .tip {
      padding: 10px 25px;
      font-size: 12px;
      color: #fff;
    }
  }
</style>
