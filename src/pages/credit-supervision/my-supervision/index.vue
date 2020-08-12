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
          <!-- <div class="header">
            <h4>监管动态</h4>
          </div>
          <ul>
            <li v-for="n in 7" :key="n" class="list-item">
              <div class="title-con">
                <div class="icon">
                  <img v-if="n % 2 !== 0" class="cImg" src="https://img.xiaopiu.com/userImages/img343481737004f968.png">
                  <img v-else class="cImg" src="https://img.xiaopiu.com/userImages/img22049171056e7810.png">
                </div>

                <div class="text">
                  <p>
                    江苏浮云网络科技有限公司 自然人红黑名单 增加了
                    <span>2</span>
                    条记录
                  </p>
                  <span>操作日期：2020-07-27 15:30:20</span>
                </div>
              </div>

              <div class="button">
                查看详情
              </div>
            </li>
          </ul>

          <div flex="main:right">
            <b-page :total="total"
              :current.sync="query.page"
              :page-size="query.size"
              @on-change="handlePageChange">
            </b-page>
          </div> -->
          <market-supervision></market-supervision>
        </div>

        <div class="right">
          <!-- 市场主体预警 -->
          <market-warn class="mb-10"></market-warn>
          <!-- 行业黑名单排行 -->
          <industry-black-list></industry-black-list>
        </div>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import MarketWarn from '@/pages/credit-supervision/components/MarketWarn'
  import IndustryBlackList from '@/pages/credit-supervision/components/IndustryBlackList'
  import MarketSupervision from '@/pages/credit-supervision/my-supervision/market-supervision'

  export default {
    name: 'MySupervision',
    components: {
      CreSupLayout,
      CreSupHeader,
      MarketWarn,
      IndustryBlackList,
      MarketSupervision
    },
    data () {
      return {
        personClassName: '法人',
        activeTab: 'tab1',
        tabs: [
          { key: 'tab1', title: '市场主体监管' },
          { key: 'tab2', title: '重点人群监管' },
          { key: 'tab3', title: '重点领域监管' },
          { key: 'tab4', title: '行业监管' }
        ]
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-tabs组件当前tab改变回调
       * @param {Object} tab 当前tab对象
       */
      async handleTabsChange (tab) {
        if (this.visible) { // 界面渲染后b-tabs组件切换的回调才有效
          this.curRootTab = tab
          await this.getSectionChildren(tab.id)
          this.contentList = []
          if (this.subSecList.length > 0) {
            this.query.page = 1
            this.query.columnId = this.curSubTab.id
            this.getContentList(this.query)
          }
        }
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
    height: 100%;
    background: url("../../../assets/images/content/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
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
        width: 64%;
        background: #ffffff;
        min-height: 400px;

      }

      .right {
        width: 35%;
      }
    }
  }
</style>
