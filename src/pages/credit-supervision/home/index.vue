<template>
  <cre-sup-layout>
    <div class="credit-supervision">
      <b-modal v-model="modalFlag" title="关系图展示" width="1000" footer-hide
               @on-ok="$log.print('ok click')"  @on-cancel="$log.print('cancel click','success')">
        <relation-chart></relation-chart>
      </b-modal>
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <p>风险预警 尽在掌握</p>
        <div flex class="btn-con">
          <b-dropdown class="dropdown">
            <b-button type="primary" style="width: 94px;">
              {{ personClassName }}
              <b-icon name="ios-arrow-down"></b-icon>
            </b-button>
            <b-dropdown-menu slot="list">
                <b-dropdown-item @click.native="personClassName = '自然人'">
                  自然人
                </b-dropdown-item>
                <b-dropdown-item @click.native="personClassName = '法人'">
                  法人
                </b-dropdown-item>
            </b-dropdown-menu>
          </b-dropdown>
          <b-input placeholder="请输入查询主体" @on-enter="$router.push('/creditSupervision/search')"></b-input>
          <b-button type="primary" class="search-btn" @click="modalFlag = true">
            查询
          </b-button>
        </div>
      </div>

      <div class="main-con">
        <div class="left">
          <div class="header">
            <h4>监管动态</h4>
          </div>
          <ul>
            <li v-for="(item, index) in list" :key="index" class="list-item">
              <div class="title-con">
                <div class="icon">
                  <img v-if="item.objectType === 1" class="cImg" src="https://img.xiaopiu.com/userImages/img343481737004f968.png">
                  <img v-else class="cImg" src="https://img.xiaopiu.com/userImages/img22049171056e7810.png">
                </div>

                <div class="text">
                  <p>
                    <!-- 江苏浮云网络科技有限公司 自然人红黑名单 增加了 -->
                    {{ item.objectName }}
                    <span>{{ item.resourceName }}</span>
                     增加了
                    <span>{{ item.count }}</span>
                    条记录
                  </p>
                  <span>操作日期：{{ item.createDate }}</span>
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
              :page-size="query.pageSize"
              show-elevator
              @on-change="handlePageChange">
            </b-page>
          </div>
        </div>

        <div class="right">
          <!-- 右侧头部导航 -->
          <tip-nav class="mb-10"></tip-nav>
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
  import { arrPgination } from '@/common/utils/util'
  import { getSupervisionDynamicList } from '@/api/credit-supervision/home.api'
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import TipNav from '@/pages/credit-supervision/home/TipNav'
  import TipMarketWarn from '@/pages/credit-supervision/components/TipMarketWarn'
  import TipIndustryBlackList from '@/pages/credit-supervision/components/TipIndustryBlackList'
  import RelationChart from '@/pages/credit-supervision/home/RelationChart'

  export default {
    name: 'CreditSupervision',
    components: {
      CreSupLayout,
      CreSupHeader,
      TipNav,
      TipMarketWarn,
      TipIndustryBlackList,
      RelationChart
    },
    data () {
      return {
        personClassName: '法人',
        total: 0,
        query: {
          pageSize: 10,
          page: 1,
          month: 6
        },
        list: [],
        modalFlag: false
      }
    },
    created () {
      this.getSupervisionDynamicList(this.query)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取监管动态列表
       * @param {Object} query 查询参数对象
       */
      async getSupervisionDynamicList (query) {
        try {
          const res = await getSupervisionDynamicList(query.month)
          const data = arrPgination(res, query.pageSize, query.page)
          this.total = data.total
          this.query.page = data.page
          this.list = data.arr
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        this.query.page = page
        this.getSupervisionDynamicList(this.query)
      }
    }
  }
</script>

<style lang="stylus">
  .credit-supervision {
    .search {
      .dropdown {
        .bin-button {
          border-radius: 2px 0 0 2px;
        }
        .bin-button,
        .bin-button--primary,
        .bin-button--primary:active,
        .bin-button--primary:focus,
        .bin-button--primary:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0);
        }
      }

      .bin-input {
        border-radius: 0;
        color: #ffffff;
      }
      .bin-input,
      .bin-input:focus,
      .bin-input:hover {
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(255, 255, 255, 0);
        box-shadow: 0 0 0 2px rgba(13, 133, 255, 0);
      }

      .search-btn.bin-button {
          border-radius: 0 2px 2px 0;
        }
    }
  }
</style>

<style lang="stylus" scoped>
 .credit-supervision {
    height: 100%;
    background: url("../../../assets/images/credit-supervision/banner-bg0.png") no-repeat 0 0;
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

     .btn-con {
        width: 50%;
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

        .header {
          display: flex;
          align-items: center;
          padding-left: 10px;
          height: 50px;
          border-bottom: 1px solid #d9d9d9;
        }

        ul {
          margin-bottom: 20px;
          padding: 0 10px 0;

          li {
            padding: 17px 0;
            border-bottom: 1px solid #d9d9d9;

            &.list-item {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .title-con {
                display: flex;
                align-items: center;

                .icon {
                  margin-right: 10px;

                  img {
                    max-height: 32px;
                  }
                }

                .text {
                  p {
                    margin-bottom: 7px;
                    color: rgba(0, 0, 0, 0.75);
                    font-weight: 600;

                    span {
                      font-weight: 600;
                      color: #0d85ff;
                    }
                  }
                  span {
                    color: #8c8c8c;
                  }
                }
              }

              .button {
                cursor: pointer;
                padding: 5px 15px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #d9d9d9;
                color: rgba(0, 0, 0, 0.75)
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);
                transition: 0.3s;

                &:hover {
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
                }
              }
            }
          }
        }
      }

      .right {
        width: 30%;
        // background: #ffffff;
        // min-height: 400px;
      }
    }
  }
</style>
