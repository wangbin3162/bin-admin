<template>
  <div class="list-wrap">
    <div class="list">
      <div class="total">为您找到 <em>{{ total }}</em> 条记录</div>
      <div class="item" v-for="item in data" :key="item.id" :class="item.type.toLowerCase()">
        <div class="keywords">
          <keywords :size="68">{{ item | keywords}}</keywords>
        </div>
        <div class="center">
          <template v-if="item.type==='FO'">
            <h2>{{ item.name }}</h2>
            <b-row>
              <b-col :span="8">
                <simple-label label="统一社会信用代码">{{ item.unifiedCode }}</simple-label>
              </b-col>
              <b-col :span="8">
                <simple-label label="工商注册号">{{ item.regNo }}</simple-label>
              </b-col>
              <b-col :span="8">
                <simple-label label="组织机构代码">{{ item.orgInstCode }}</simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col :span="8">
                <simple-label label="法定代表人">{{ item.natName }}</simple-label>
              </b-col>
              <b-col :span="8">
                <simple-label label="注册日期">{{ item.regDate }}</simple-label>
              </b-col>
            </b-row>
            <simple-label label="注册地址">{{ item.compAddress }}</simple-label>
          </template>
          <template v-else>
            <h2>{{ item.name }}</h2>
            <p>
              <span>证件号码：{{ item.code }}</span>
            </p>
          </template>
        </div>
        <div class="ctrl">
          <span v-waves @click="handleCheck(item)">执行反馈</span>
        </div>
        <div class="memo-typ" :class="item.memoType==='1'?'black':'red'">
          <img v-if="item.memoType==='1'" src="../../../assets/images/urp/black_name.png" alt=""/>
          <img v-else src="../../../assets/images/urp/red_name.png" alt=""/>
          {{ item.memoType==='1'?'黑名单':'红名单' }}
        </div>
      </div>
      <b-loading fix v-show="loading" show-text="loading"></b-loading>
      <no-data v-show="!loading&&data.length===0"></no-data>
    </div>
  </div>
</template>

<script>
  import Keywords from '../../../components/Keywords/index'
  import NoData from '../../../components/NoData/index'
  import SimpleLabel from '../../../components/SimpleLabel/SimpleLabel'

  export default {
    name: 'UrpList',
    components: { SimpleLabel, NoData, Keywords },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      loading: Boolean
    },
    filters: {
      keywords(item) {
        return item.name.substr(0, 1)
      }
    },
    computed: {
      total() {
        return this.data.length
      }
    },
    methods: {
      handleCheck(item) {
        this.$emit('on-check-detail', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list {
    position: relative;
    width: 1300px;
    padding-bottom: 190px;
    min-height: 465px;
    margin: 0 auto;
    background: #fff url("../../../assets/images/list-bg.png") no-repeat center bottom;
    border: 1px solid #eee;
    margin-bottom: 32px;
    .total {
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
    }
    .item {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 16px 32px;
      background: #fff;
      transition: all .3s;
      border-bottom: 1px solid #eee;
      &.fo {
        max-height: 154px;
        .keywords {
          padding-top: 16px;
        }
      }
      &.zrp {
        padding: 32px;
      }
      &:hover {
        box-shadow: 0 0 8px #eee;
        background: #fff url("../../../assets/images/list-item-bg.png") no-repeat 0 0;
      }
      .center {
        width: calc(100% - 100px - 68px);
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
      .memo-typ {
        position: absolute;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        top: 0;
        right: 32px;
        width: 88px;
        background: #f5f5f5;
        padding: 10px 0;
        text-align: center;
        border-radius: 0 0 5px 5px;
        img {
          margin-right: 4px;
        }
        &.red {
          color: #ee5454;
        }
      }
    }
  }
</style>
