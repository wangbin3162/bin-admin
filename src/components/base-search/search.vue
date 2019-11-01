<template>
  <div class="base-search">
    <div class="type-wrap" v-if="isNormal">
      <span :class="{'active':type==='1'}" @click="changeType('1')">法人和其他组织</span>
      <span :class="{'active':type==='2'}" @click="changeType('2')">自然人</span>
    </div>
    <div class="input-wrap" :class="{'small':!isNormal}" flex="main:justify">
      <div class="input">
        <b-dropdown v-if="!isNormal" trigger="click">
          <div class="select type">
          <span>
            {{ typeLabel }}
            <b-icon name="md-arrow-dropdown" size="20"></b-icon>
          </span>
          </div>
          <b-dropdown-menu slot="list" style="width: 100px;">
            <b-dropdown-item :selected="type==='1'">
              <span class="options" @click="type='1'">法人</span>
            </b-dropdown-item>
            <b-dropdown-item :selected="type==='2'">
              <span class="options" @click="type='2'">自然人</span>
            </b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
        <label>
          <input v-model="q" :placeholder="placeholderLabel" @keyup.enter="handleSearch"/>
        </label>
        <span class="search-btn" @click="handleSearch" v-waves>查询</span>
      </div>
      <b-dropdown trigger="click">
        <div class="select">
          <span>
            {{ reasonLabel }}
            <b-icon name="md-arrow-dropdown" size="20"></b-icon>
          </span>
        </div>
        <b-dropdown-menu slot="list" style="width: 140px;">
          <b-dropdown-item :selected="reason==='report'">
            <span class="options" @click="reason='report'">信用报告</span>
          </b-dropdown-item>
          <b-dropdown-item :selected="reason==='check'">
            <span class="options" @click="reason='check'">信用核查</span>
          </b-dropdown-item>
        </b-dropdown-menu>
      </b-dropdown>
    </div>
    <div class="tip" v-if="isNormal">查看自然人、法人信用档案</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'BaseSearch',
    props: {
      isNormal: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        type: '1', // 1 法人，2自然人
        reason: '', // 查询原因
        q: ''
      }
    },
    created () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.fetchData()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    computed: {
      ...mapGetters(['searchData']),
      typeLabel () {
        const typeMap = {
          '1': '法人',
          '2': '自然人'
        }
        return typeMap[this.type]
      },
      reasonLabel () {
        const reasonMap = {
          report: '信用报告',
          check: '信用核查'
        }
        return this.reason.length === 0 ? '选择查询原因' : reasonMap[this.reason]
      },
      placeholderLabel () {
        return this.type === 'leg' ? '请输入企业名称、统一社会信用代码、工商注册号、组织机构代码等' : '请输入自然人名称'
      }
    },
    methods: {
      // 将vuex缓存数据映射至组件
      fetchData () {
        this.type = this.searchData.type
        this.reason = this.searchData.reason
        this.q = this.searchData.q
      },
      changeType (type) {
        if (this.type !== type) {
          this.type = type
        }
      },
      handleSearch () {
        this.$emit('on-search', {
          type: this.type,
          reason: this.reason,
          q: this.q
        })
        this.$log.primary(`查询[type:${this.type}][reason:${this.reason}][q:${this.q}]`)
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
        color: #fff;
        cursor: pointer;
        transition: .3s;
        &.active {
          background: #fff;
          color: #0398ec;
        }
      }
    }
    .input-wrap {
      .input {
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
            border: 1px solid transparent;
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
          color: #369fff;
          background: #fff;
          text-align: center;
          border-left: 1px solid #e5effa;
        }
      }
      .select {
        cursor: pointer;
        height: 50px;
        width: 150px;
        line-height: 50px;
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
        padding: 0 98px;
        .input {
          width: 700px;
          input {
            height: 36px;
            line-height: 1.5;
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
      color: #ffffff;
      font-size: 12px;
    }
  }
</style>
