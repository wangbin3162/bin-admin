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
          <b-breadcrumb-item :to="{
            path: '/news',
            query: {
              pId: breadcrumbParam.pId,
              sId: breadcrumbParam.sId,
            }
          }">
            {{ breadcrumbParam.pName }}
          </b-breadcrumb-item>
          <b-breadcrumb-item>
            <span style="color: #0d85ff;">{{ breadcrumbParam.sName }}</span>
          </b-breadcrumb-item>
        </b-breadcrumb>
      </div>

      <div class="main-con">
        <!-- <b-loading fix showText="加载中...." v-if="loading">
        </b-loading> -->

        <transition name="move-left">
          <div class="left" v-show="visible">

            <div v-if="content.title !== null">
              <div class="content-title">
                <p>
                  {{ content.title }}
                </p>

                <div flex="main:justify">
                  <div>
                    <span>发布时间：{{ $util.parseTime(new Date(content.publishDate), '{y}-{m}-{d}') }}</span>
                    <span>来源：{{ content.source }}</span>
                    <span>浏览量：{{ content.accessCnt }}</span>
                  </div>
                  <!-- <span style="cursor: pointer; color: #0d85ff;" @click="handleAttachDlBtn">附件下载</span> -->
                </div>
              </div>

              <b-divider></b-divider>

              <div v-html="content.detail" class="content-con">
              </div>

              <attachment-download v-model="openAttachmentDownload"
                :contentId="routeQuery.newsId">
              </attachment-download>
            </div>

            <b-empty v-else style="margin-top: 20%;">暂时没有内容哦</b-empty>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <section-side-nav @breadcrumb-param="handleBreadcrumbParam">
            </section-side-nav>
          </div>
        </transition>
      </div>
    </div>

    <!-- <attachment-download v-model="openAttachmentDownload"
      :contentId="routeQuery.contentId">
    </attachment-download> -->
  </base-layout>
</template>

<script>
  import { getContentDetail } from '../../../api/cms/news.api'
  import SectionSideNav from '../components/SectionSideNav'
  import AttachmentDownload from '../components/AttachmentDownload'

  export default {
    name: 'NewsDetail',
    components: {
      SectionSideNav,
      AttachmentDownload
    },
    data () {
      return {
        visible: false,
        loading: false,
        openAttachmentDownload: false,
        content: {},
        routeQuery: {},
        breadcrumbParam: {} // 面包屑需要使用的参数
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
        await this.getContentDetail(this.routeQuery.newsId)
        this.visible = true
      },

      /**
       * @author haodongdong
       * @description 根据内容id获取新闻内容
       * @param {string} id
       */
      async getContentDetail (id) {
        this.loading = true
        try {
          const res = await getContentDetail(id)
          this.content = res
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 附件下载按钮回调
       */
      handleAttachDlBtn () {
        this.openAttachmentDownload = true
      },

      /**
       * @author haodongdong
       * @description section-side-nav组件breadcrumb-param事件回调
       * @param {Object} param
       * @param {string} param.pId 文章所属的顶层栏目id
       * @param {string} param.sId 文章所属栏目id
       * @param {string} param.pName 文章所属的顶层栏目名
       * @param {string} param.sName 文章所属栏目名
       */
      handleBreadcrumbParam (param) {
        this.breadcrumbParam = param
      }

    }
  }
</script>

<style lang="stylus">
  .content {
    .content-con {
      p {
        margin: 16px;
      }
      img {
        height: auto;
        max-width: 100%;
      }
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

    .main-con {
      display: flex;
      justify-content: space-between;
      width: 1300px;
      margin: 0 auto 25px;

      .left {
        position: relative;
        min-height: 500px;
        width: 975px;
        padding: 20px 25px;
        background: #ffffff;

        .content-title {
          p {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
          }

          span {
            margin-right: 30px;
            color: #595959;
          }
        }
      }

      .right {
        width: 300px;

      }
    }
  }
</style>
