<template>
  <div class="top-search">
    <div class="type-wrap">
      <span :class="{'active':type==='1'}" @click="changeType('1')">法人和其他组织</span>
      <span :class="{'active':type==='2'}" @click="changeType('2')">自然人</span>
    </div>
    <div class="input-wrap" flex="main:justify">
      <div class="input">
        <label>
          <input v-model="q" :placeholder="placeholderLabel" @keyup.enter="handleSearch"/>
        </label>
        <span class="search-btn" @click="handleSearch" v-waves>查询</span>
        <b-icon class="clear-btn" name="ios-close" v-if="this.q.length>0"
                @click.native="q = ''"></b-icon>
      </div>
      <span class="back" @click="$emit('on-back')">返回</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'top-search',
    data () {
      return {
        type: '1', // 1 法人，2自然人
        q: ''
      }
    },
    created () {
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
      placeholderLabel () {
        return this.type === '1' ? '请输入企业名称、统一社会信用代码、工商注册号、组织机构代码等' : '请输入自然人名称'
      }
    },
    methods: {
      // 将vuex缓存数据映射至组件
      fetchData () {
        this.type = this.searchData.type
        this.q = this.searchData.q
      },
      changeType (type) {
        if (this.type !== type) {
          this.type = type
        }
      },
      handleSearch () {
        this.$store.dispatch('setSearchData', { type: this.type, reason: this.searchData.reason, q: this.q })
        this.$emit('on-search')
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
