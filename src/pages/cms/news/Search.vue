<template>
  <base-layout>
    <div class="content">
      <base-header></base-header>

      <div class="title">
        <div class="con">
          <p>政策法规</p>
          <span>关注信用/关注政策/关注事实</span>
        </div>
      </div>

      <div class="sec-nav-con">
        <b-breadcrumb separator="/">
          <b-breadcrumb-item :to="{ path: '/' }">首页</b-breadcrumb-item>
          <b-breadcrumb-item>
            <span style="color: #0d85ff;">新闻搜索</span>
          </b-breadcrumb-item>
        </b-breadcrumb>
      </div>

      <div class="list-con">
        <transition name="move-left">
          <div class="left" v-show="visible">
            <b-loading fix showText="加载中...." v-if="loading">
            </b-loading>

           <template v-if="list.length > 0">
              <ul>
                <li v-for="item in list" :key="item.id">
                  <div class="title-con">
                    <img :src="`/api/cms/attach/download?attachmentId=${item.thumbnailPath}`" alt=""
                      v-show="item.thumbnailPath !== null">
                    <div class="title-text">
                      <p v-html="item.title" @click="handleTitleBtnClick(item.id, item.colId)"></p>
                      <div v-html="item.summary"></div>
                    </div>
                  </div>

                  <div class="tips">
                    <span>所属栏目：{{ item.colName }}</span>
                    <div>
                      <span class="mr-20">{{ $util.parseTime(new Date(item.publishDate), '{y}-{m}-{d}')}}</span>
                      <span>浏览: {{ item.accessCnt }}</span>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="page">
                <b-page :total="total"
                  :current.sync="query.page"
                  :page-size="query.size"
                  @on-change="handlePageChange">
                </b-page>
              </div>
            </template>

            <b-empty v-else style="margin-top: 20%;">暂时没有内容哦</b-empty>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <section-side-nav v-model="query.keyword"
              searchTitle="新闻搜索"
              searchType="search"
              @search="handleSearch">
            </section-side-nav>
          </div>
        </transition>

      </div>
    </div>
  </base-layout>
</template>

<script>
  import { getContentListByKeyword } from '../../../api/cms/news.api'
  import SectionSideNav from '../components/SectionSideNav'

  export default {
    name: 'News',
    components: {
      SectionSideNav
    },
    data () {
      return {
        visible: false,
        loading: false,
        total: 0,
        query: { // 查询参数
          columnId: '',
          keyword: '',
          size: 10,
          page: 1
        },
        routeQuery: {},
        list: []
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 初始化处理
       */
      async init () {
        this.routeQuery = this.$route.query
        if (this.routeQuery.keyword) {
          this.query.keyword = this.routeQuery.keyword
        }
        await this.getContentListByKeyword(this.query)
        this.visible = true
      },

      /**
       * @author haodongdong
       * @description 根据关键字查询内容列表
       * @param {Object} query 查询参数
       * @param {string} query.columnId 所属栏目id
       * @param {string} query.keyword 关键字
       * @param {string} query.contentStatus 内容状态
       * @param {number} query.size 分页尺寸
       * @param {number} query.page 页数
       */
      async getContentListByKeyword (query) {
        this.loading = true
        try {
          const res = await getContentListByKeyword(query)
          this.list = res.rows
          this.total = res.total
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 点击标题的回调
       * @param {string} id 文章新闻id
       * @param {string} colId 新闻文章所属栏目id
       */
      handleTitleBtnClick (id, colId) {
        window.open(`#/news/detail?newsId=${id}&newsColumnId=${colId}`)
      },

      /**
       * @author haodongdong
       * @description section-side-nav组件的search事件回调
       * @param {string} keyword 关键字
       */
      handleSearch (keyword) {
        this.query.page = 1
        this.query.keyword = keyword
        this.$router.push('search')
        this.getContentListByKeyword(this.query)
      },

      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       */
      handlePageChange (page) {
        this.query.page = page
        this.getContentListByKeyword(this.query)
      }
    }
  }
</script>

<style lang="stylus">
  .content {
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
</style>

<style lang="stylus" scoped>
  .content {
    height: 100%;
    background: url("../../../assets/images/content/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    transition: background .3s;

    .title {
      width: 1300px;
      margin: 0 auto;
      color: #ffffff;
      height: 230px;

      .con {
        position: relative;
        top: 25%;
        left: 10%;
        width: 30%;

        p {
          margin-bottom: 10px;
          font-size: 30px;
        }
        span {
          font-size: 15px;
        }
      }
    }

    .sec-nav-con {
      width: 1300px;
      margin: 15px auto;
    }

    .list-con {
      display: flex;
      justify-content: space-between;
      width: 1300px;
      margin: 0 auto 25px;

      .right {
        width: 300px;
      }

      .left {
        position: relative;
        min-height: 500px;
        width: 975px;
        padding: 20px 25px;
        background: #ffffff;

        ul {
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 10px;
            min-height: 90px;
            padding-bottom: 5px;
            border-bottom: 1px solid #d9d9d9;

            .title-con {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              cursor: pointer;

              img {
                max-width: 100px;
                margin-right: 20px;
              }

              .title-text {
                p {
                font-size: 17px;

                  &:before {
                    content: '';
                    display: inline-block;
                    margin-right: 10px;
                    height: 13px;
                    width: 2px;
                    background: #d9d9d9;
                  }
                }

                div {
                  margin-top: 10px;
                  margin-left: 13px;
                  color: #bfbfbf;

                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
              }

              &:hover {
                color: #3d9dff;
                img {
                  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
                  transition: all 0.3s;
                }
                transition: color 0.3s;
              }
            }

            .tips {
              display: flex;
              justify-content: space-between;
              color: #8c8c8c
            }
          }
        }

        .page {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
      }
    }
  }
</style>
