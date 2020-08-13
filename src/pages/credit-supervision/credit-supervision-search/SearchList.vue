<template>
  <div class="list-wrap">
    <div class="list">
      <div class="total">为您找到 <em>{{ total }}</em> 条记录</div>
      <div class="item" v-for="item in list" :key="item.id">
        <keywords :size="68">{{ item.name[0] }}</keywords>
        <div class="center" flex-box="1">
          <h2>{{ item.name }}</h2>
          <p>
            <span>身份证号码：{{ item.id_sfz }}</span>
          </p>
        </div>
        <div class="ctrl">
          <span v-waves @click="handleCheck(item.id)">查看详情</span>
        </div>
      </div>
      <b-loading fix v-show="loading" show-text="loading"></b-loading>
      <no-data v-show="!loading && list.length===0"></no-data>
    </div>
  </div>
</template>

<script>
  import NoData from '@/components/NoData'
  import Keywords from '@/components/Keywords'

  export default {
    name: 'SearchList',
    components: { Keywords, NoData },
    data () {
      return {
        loading: false,
        total: 0,
        list: [
          { keywords: '江苏浮云网络科技有限公司', name: '郭小宁', id_sfz: '', id: '' }
        ]
      }
    },
    methods: {
      handleCheck(id) {
        this.$emit('on-check-detail', id)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list {
    position: relative;
    width: 1300px;
    padding-bottom: 198px;
    min-height: 497px;
    margin: 0 auto;
    background: #fff url("../../../assets/images/list-bg.png") no-repeat center bottom;
    border: 1px solid #eee;
    border-bottom: none;
    .total {
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
      background: #fff;
      transition: all .3s;
      border-bottom: 1px solid #eee;
      &:hover {
        box-shadow: 0 0 8px #eee;
        background: #fff url("../../../assets/images/list-item-bg.png") no-repeat center center;
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
