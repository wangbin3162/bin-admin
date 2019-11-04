<template>
  <div class="list-wrap">
    <div class="list">
      <div class="total">为您找到<em>{{ total }}</em>条记录</div>
      <div class="item" v-for="(item,index) in data" :key="item.id">
        <div class="keywords" :style="{background:colors[index]}" v-if="item.keywords">{{ item.keywords[0] }}</div>
        <div class="center" flex-box="1">
          <template v-if="currentType==='1'">
            <h2 v-html="item.highlight"></h2>
            <p>
              <span class="mr-20">{{ mapping.fddbr }}：<a>{{ item.fddbr }}</a></span>
              <span>{{ mapping.zczb }}：{{ item.zczb }}万人民币</span>
            </p>
            <p>
              <span>{{ mapping.clrq }}：{{ item.clrq }}</span>
            </p>
          </template>
          <template v-else>
            <h2>{{ item.name }}</h2>
            <p>
              <span>身份证号码：{{ item.id_sfz }}</span>
            </p>
          </template>
        </div>
        <div class="ctrl">
          <span v-waves @click="handleCheck(item.id)">查看详情</span>
        </div>
      </div>
      <b-loading fix v-show="loading" show-text="loading"></b-loading>
      <no-data v-show="!loading&&data.length===0"></no-data>
    </div>
  </div>
</template>

<script>
  import NoData from '../no-data/no-data'

  export default {
    name: 'base-list',
    components: { NoData },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      mapping: {
        type: Object,
        default () {
          return {}
        }
      },
      total: {
        type: Number,
        default: 0
      },
      loading: Boolean
    },
    data () {
      return {
        colors: ['#1ba6ee', '#36d8da', '#fce070', '#fbafb2',
          '#fb925a', '#4cf4db', '#dda9fb', '#66fb76',
          '#fb6471', '#7669fb']
      }
    },
    computed: {
      currentType () {
        return this.$store.state.search.searchData.type
      }
    },
    methods: {
      handleCheck (id) {
        this.$emit('on-check-detail', id)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list {
    position: relative;
    width: 1300px;
    min-height: 497px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #eee
    border-bottom: none;
    .total {
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
      border-bottom: 1px solid #eee;
      transition: all .3s;
      &:hover {
        box-shadow: 0 0 8px #eee;
        border-bottom-color: transparent;
      }
      .keywords {
        background: #1ba6ee;
        color: #fff;
        width: 68px;
        height: 68px;
        line-height: 68px;
        border-radius: 5px;
        text-align: center;
        font-size: 22px;
      }
      .center {
        padding: 0 40px;
        h2 {
          margin: 0;
          font-weight: normal;
          font-size: 16px;
          color: #333333;
          margin-bottom: 6px;
        }
        p {
          margin: 0;
          line-height: 25px;
        }
      }
      .ctrl {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
          color: #1c8ee7;
          padding: 7px 15px;
          border-radius: 20px;
          border: 1px solid #eee;
          box-shadow: 0 0 5px #eeeeee;
          transition: .3s;
          &:hover {
            box-shadow: 0 2px 5px #bee1f5;
          }
        }
      }
    }
  }
</style>
