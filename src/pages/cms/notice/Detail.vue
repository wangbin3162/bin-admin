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
          <b-breadcrumb-item to="/notice">
            通知公告
          </b-breadcrumb-item>
        </b-breadcrumb>
      </div>

      <div class="main-con">

        <transition name="move-left">
          <div class="left" v-show="visible">

            <div v-if="detail.title !== null">
              <div class="content-title">
                <p>
                  {{ detail.title }}
                </p>

                <div flex="main:justify">
                  <div>
                    <span>发布时间：{{ $util.parseTime(new Date(detail.createDate), '{y}-{m}-{d}') }}</span>
                    <span>来源：{{ detail.source }}</span>
                    <!-- <span>浏览量：{{ detail.accessCnt }}</span> -->
                  </div>
                  <span style="cursor: pointer; color: #0d85ff;" @click="handleAttachDlBtn">附件下载</span>
                </div>
              </div>

              <b-divider></b-divider>

              <div v-html="detail.content" class="content-con">
              </div>
            </div>

            <b-empty v-else style="margin-top: 20%;">暂时没有内容哦</b-empty>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <section-side-nav searchTitle="通知搜索" searchType="notice"
              @search="handleSearch"></section-side-nav>
          </div>
        </transition>
      </div>
    </div>

    <attachment-download v-model="openAttachmentDownload"
      :initFileList="detail.fileList">
    </attachment-download>
  </base-layout>
</template>

<script>
  import { getNoticeDetail } from '../../../api/cms/notice.api'
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
        detail: {},
        routeQuery: {}
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
        await this.getNoticeDetail(this.routeQuery.noticeId)
        this.visible = true
      },

      /**
       * @author haodongdong
       * @description 根据内容id获取新闻内容
       * @param {string} id
       */
      async getNoticeDetail (id) {
        this.loading = true
        try {
          const res = await getNoticeDetail(id)
          this.detail = res
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 附件下载回调
       */
      handleAttachDlBtn () {
        this.openAttachmentDownload = true
      },

      /**
       * @author haodongdong
       * @description section-side-nav组件的search事件回调
       * @param {string} title 搜索框的值
       */
      handleSearch (title) {
        this.$router.push({
          path: '/notice',
          query: {
            noticeTitle: title
          }
        })
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
      margin: 20px auto;
    }

    .main-con {
      display: flex;
      justify-content: space-between;
      width: 1300px;
      margin: 25px auto 25px;

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
