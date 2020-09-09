<template>
  <cre-sup-layout>
    <div class="credit-supervision">
      <cre-sup-header></cre-sup-header>

      <div ref="search" class="search">
        <div style="width: 50%;">
          <p>风险预警 尽在掌握</p>
          <div flex class="btn-con">
            <b-dropdown class="dropdown" placement="bottom-start">
              <b-button type="primary" size="large">
                <span class="opt-text">
                  {{ personClass === '1' ? '法人和其他组织' : '自然人' }}
                </span>
                <b-icon name="ios-arrow-down"></b-icon>
              </b-button>
              <b-dropdown-menu slot="list">
                  <b-dropdown-item @click.native="personClass = '2'">
                    自然人
                  </b-dropdown-item>
                  <b-dropdown-item @click.native="personClass = '1'">
                    法人和其他组织
                  </b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
            <b-input v-model="keyword" placeholder="请输入查询关键字" clearable
              size="large"
              @on-enter="handleSearch"
              @on-clear="handleSearchClear">
            </b-input>
            <b-button type="primary" class="search-btn" size="large"
              @click="handleSearch">
              查询
            </b-button>
          </div>
        </div>
      </div>

      <div v-show="!visible" class="main-con">
        <div class="left">
          <div class="header">
            <h4>监管动态</h4>
          </div>
          <ul class="list">
            <b-loading fix show-text="加载中...." v-if="listLoading"></b-loading>
            <li v-for="(item, index) in list" :key="index" class="list-item">
              <div class="title-con">
                <div class="icon">
                  <img v-if="item.objectType === 1" class="cImg" src="https://img.xiaopiu.com/userImages/img343481737004f968.png">
                  <img v-else class="cImg" src="https://img.xiaopiu.com/userImages/img22049171056e7810.png">
                </div>

                <div class="text">
                  <p>
                    {{ item.objectName }}
                    <span>{{ item.resourceName }}</span>
                    增加了
                    <span>{{ item.count }}</span>
                    条记录
                  </p>
                  <span>操作日期：{{ item.createDate }}</span>
                </div>
              </div>

              <div class="button" @click="handleViewDetailBtn(item)">
                查看详情
              </div>
            </li>
          </ul>

          <div flex="main:right" class="mb-20 pr-10">
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

      <transition name="fade-scale-move">
        <search-list ref="searchList" v-show="visible"></search-list>
      </transition>
    </div>
  </cre-sup-layout>
</template>

<script>
  import { arrPgination } from '@/common/utils/util'
  import {
    getSupervisionDynamicList
  } from '@/api/credit-supervision/home.api'
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import TipNav from '@/pages/credit-supervision/home/TipNav'
  import TipMarketWarn from '@/pages/credit-supervision/components/TipMarketWarn'
  import TipIndustryBlackList from '@/pages/credit-supervision/components/TipIndustryBlackList'
  import SearchList from '@/pages/credit-supervision/home/search/SearchList'

  export default {
    name: 'CreditSupervision',
    components: {
      CreSupLayout,
      CreSupHeader,
      TipNav,
      TipMarketWarn,
      TipIndustryBlackList,
      SearchList
    },
    data () {
      return {
        personClass: '1',
        keyword: '',
        visible: false,
        total: 0,
        query: {
          pageSize: 10,
          page: 1,
          month: 6
        },
        resData: null, // 接口返回的数据容器
        listLoading: false,
        list: []
      }
    },
    created () {

    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        this.getSupervisionDynamicList(this.query)
        const routeQuery = this.$route.query
        if (JSON.stringify(routeQuery) !== '{}') {
          this.keyword = routeQuery.q
          this.personClass = routeQuery.type
          this.handleSearch()
        }
      },

      /**
       * @author haodongdong
       * @description 获取监管动态列表
       * @param {Object} query 查询参数对象
       */
      async getSupervisionDynamicList (query) {
        this.listLoading = true
        try {
          const res = await getSupervisionDynamicList(query.month)
          this.resData = res

          const data = arrPgination(res, query.pageSize, query.page)
          this.total = data.total
          this.query.page = data.page
          this.list = data.arr
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '查询失败', desc: error })
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description 搜索回调
       */
      handleSearch () {
        if (this.keyword) {
          this.$router.push({
            path: 'creditSupervision',
            query: {
              q: this.keyword,
              type: this.personClass
            }
          })
          const searchList = this.$refs.searchList
          searchList.search(this.keyword, this.personClass)

          const el = this.$refs.search
          el.style.height = '170px'
          this.visible = true
        } else {
          this.$message({ type: 'warning', content: '请输入查询关键字！' })
        }
      },

      /**
       * @author haodongdong
       * @description 搜索框清空按钮的回调
       */
      handleSearchClear () {
        this.$router.push({ // 用于清空url参数
          path: 'creditSupervision',
          query: {}
        })
        this.personClass = '1'
        this.keyword = ''
        const el = this.$refs.search
        el.style.height = '230px'
        this.visible = false
      },

      /**
       * @author haodongdong
       * @description 查看详情按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.objectId 主体id
       * @param {string} row.objectType 主体类别 1 法人 2 自然人
       */
      handleViewDetailBtn (row) {
        this.$router.push({
          name: 'recentDynamic',
          query: {
            type: String(row.objectType), // 这里需要转为String，因为后续的其他模块是按照字符型严格判断的
            id: row.objectId,
            objectName: row.objectName
          }
        })
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        const data = arrPgination(this.resData, this.query.pageSize, page)
        this.query.page = data.page
        this.list = data.arr
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
    background-size: 1920px 310px;
    background-position: center top;
    transition: background .3s;

    .search {
      display: flex;
      justify-content: center;
      padding-top: 50px;
      height: 230px;
      width: 1300px;
      margin: 0 auto;
      transition: height 0.2s;

      p {
        margin-bottom: 5px;
        font-size: 27px;
        color: #ffffff;
        text-align: center;
      }

     .btn-con {
        width: 100%;

        .opt-text {
          display: inline-block;
          width: 114px;
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

        .header {
          display: flex;
          align-items: center;
          padding-left: 10px;
          height: 50px;
          border-bottom: 1px solid #d9d9d9;
        }

        ul.list {
          position: relative;
          margin-bottom: 20px;
          padding: 0 10px 0;
          min-height: 90px;

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
