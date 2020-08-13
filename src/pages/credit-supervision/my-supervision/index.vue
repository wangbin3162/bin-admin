<template>
  <cre-sup-layout>
    <div class="my-supervision">
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <p>我的监管</p>
        <span>及时掌握主体信用变动，关注我的信用领域</span>
      </div>

      <div class="sec-nav-con">
        <div class="sec-nav">
          <div class="tabs">
            <b-tabs ref="tabs" v-model="activeTab" :data="tabs"
              @on-change="handleTabsChange">
            </b-tabs>
          </div>
        </div>
      </div>

      <div class="main-con">
        <div class="left">
          <router-view></router-view>
        </div>

        <div class="right">
          <!-- 市场主体预警 -->
          <tip-market-warn class="mb-10"></tip-market-warn>
          <!-- 行业黑名单排行 -->
          <tip-industry-black-list></tip-industry-black-list>
        </div>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import TipMarketWarn from '@/pages/credit-supervision/components/TipMarketWarn'
  import TipIndustryBlackList from '@/pages/credit-supervision/components/TipIndustryBlackList'

  export default {
    name: 'MySupervision',
    components: {
      CreSupLayout,
      CreSupHeader,
      TipMarketWarn,
      TipIndustryBlackList
    },
    data () {
      return {
        personClassName: '法人',
        activeTab: 'MS',
        tabs: [
          { key: 'MS', title: '市场主体监管' },
          { key: 'KP', title: '重点人群监管' },
          { key: 'IA', title: '重点领域监管' },
          { key: 'KI', title: '重点行业监管' }
        ]
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const route = this.$route
        this.activeTab = route.name
      },

      /**
       * @author haodongdong
       * @description b-tabs组件当前tab改变回调
       * @param {Object} tab 当前tab对象
       */
      async handleTabsChange (tab) {
        this.activeTab = tab.key
        this.$router.push(tab.key)
      }
    }
  }
</script>

<style lang="stylus">
  .my-supervision {
    .sec-nav-con {
      .bin-tabs-wrapper.default:after {
        height: 0px;
      }
      .bin-tabs-wrapper .nav-wrapper .tabs-active-bar {
        height: 2px;
      }
      .bin-tabs-wrapper .nav-wrapper .tab-item {
        position: relative;
        top: -11px;
        font-size: 16px;
        &:hover {
          color: rgba(0,0,0,.65);
        }
      }
      .bin-tabs-wrapper .nav-wrap.is-scrollable .nav-prev {
        top: -12px;
      }
      .bin-tabs-wrapper .nav-wrap.is-scrollable .nav-next {
        top: -12px;
      }
      .bin-tabs-wrapper .nav-wrapper .tab-item.active {
        color: rgba(0,0,0,.65);
        font-weight: 600;
      }
    }
  }
</style>

<style lang="stylus" scoped>
 .my-supervision {
    min-width: 1300px;
    height: 100%;
    background: url("../../../assets/images/credit-supervision/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    background-position: top center;
    transition: background .3s;

    .search {
      padding-top: 50px;
      height: 230px;
      width: 1300px;
      margin: 0 auto;

      p {
        margin-bottom: 5px;
        font-size: 27px;
        color: #ffffff;
      }

      span {
        color: #ffffff;
      }

     .btn-con {
        width: 50%;
      }
    }

    .sec-nav-con {
      background: #ffffff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.12);

      .sec-nav {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 70px;
        width: 1300px;
        margin: 0 auto;

        .tabs {
          width:  700px;
        }

        .input {
          height: 47px;
          width: 400px;
        }
      }
    }

    .main-con {
      display: flex;
      justify-content: space-between;
      width: 1300px
      margin: 25px auto 25px;

      .left {
        width: 69%;
        background: #ffffff;
        min-height: 400px;

      }

      .right {
        width: 30%;
      }
    }
  }
</style>
