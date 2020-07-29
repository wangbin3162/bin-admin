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
            path: '/news/index',
            query: {
              pId: routeQuery.pId,
              sId: routeQuery.sId,
            }
          }">
            {{ routeQuery.pName }}
          </b-breadcrumb-item>
          <b-breadcrumb-item>
            <span style="color: #0d85ff;">{{ routeQuery.sName }}</span>
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

                <span>发布时间：{{ $util.parseTime(new Date(content.publishDate), '{y}-{m}-{d}') }}</span>
                <span>来源：{{ content.source }}</span>
                <span>浏览量：{{ content.accessCnt }}</span>
              </div>

              <b-divider></b-divider>

              <div v-html="content.detail" class="content-con">
              </div>
            </div>

            <b-empty v-else style="margin-top: 20%;">暂时没有内容哦</b-empty>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <b-card class="content-search mb-20">
              <span>文章搜索</span>
              <b-input v-model="keyword" placeholder="请输入关键词" @on-enter="handleSearch">
                <b-icon name="ios-search" slot="suffix" style="cursor: pointer"
                  @click.native="handleSearch">
                </b-icon>
              </b-input>
            </b-card>

            <b-card head-tip class="card mb-20" shadow="never"
              v-for="sec in secList" :key="sec.id">
              <template v-slot:header>
                <div flex="main:justify cross:center">
                  <span>{{ sec.colName }}</span>
                  <b-icon name="ios-qr-scanner" size="20" style="cursor: pointer;"></b-icon>
                </div>
              </template>

              <div class="btn-con">
                <div class="btn" v-for="subSec in sec.children" :key="subSec.id"
                  @click="handleSecBtnClick(sec.id, subSec.id)">
                  {{ subSec.colName }}
                </div>
              </div>
            </b-card>

          </div>
        </transition>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import {
    getTopColumn, getSectionChildren,
    getContentDetail
  } from '../../../api/cms/news.api'

  export default {
    name: 'NewsDetail',
    data () {
      return {
        visible: false,
        loading: false,
        keyword: '',
        secList: [],
        content: {},
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
        this.buildRightNav()
        this.routeQuery = this.$route.query
        await this.getContentDetail(this.routeQuery.contentId)
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
       * @description 构建右侧栏目导航数据结构
       * @author haodongdong
       */
      async buildRightNav () {
       try {
          const res = await getTopColumn()
          res.forEach(item => {
            getSectionChildren(item.id).then(res => {
              this.$set(item, 'children', res)
            })
          })
          this.secList = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 左侧子栏目点击事件
       * @param {string} pId 根节点栏目id
       * @param {string} sId 子栏节点栏目id
       */
      handleSecBtnClick (pId, sId) {
        this.$router.push({
          path: '/news/index',
          query: {
            pId,
            sId
          }
        })
      },

      /**
       * @author haodongdong
       * @description 搜索框回调
       */
      handleSearch () {
        this.$router.push({
          path: '/news/index',
          query: {
            pid: this.routeQuery.pId,
            sid: this.routeQuery.sId,
            keyword: this.keyword
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

        .content-search {
          span {
            display: inline-block;
            margin-bottom: 10px;
          }
        }

        .card {
          .btn-con {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .btn {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 10px;
              width: 47%;
              height: 40px;
              background: #f5f5f5;
              border-radius: 5px;
              cursor: pointer;

              &:hover {
                background: #85919e;
                color: #ffffff;
                transition: all 0.4s;
              }
            }
          }
        }

      }
    }
  }
</style>
