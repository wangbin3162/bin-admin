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
        <div class="sec-nav">
          <div class="tabs">
            <b-tabs ref="tabs" v-model="activeTab" :data="tabs"
              @on-change="handleTabsChange">
            </b-tabs>
          </div>

          <div class="input">
            <b-input v-model="query.keyword" placeholder="请输入想查询的文字" clearable
              @on-enter="handleSearch" @on-clear="handleSearch">
              <b-icon name="ios-search" slot="suffix" style="cursor: pointer"
                @click.native="handleSearch">
              </b-icon>
            </b-input>
          </div>
        </div>
      </div>

      <div class="list-con">
        <transition name="move-left">
          <div class="left" v-show="visible">
            <div class="col-title">
              <b-icon size="24" name="ios-photos" color="#4ca6fb"></b-icon>
              <h3>栏目信息</h3>
            </div>

            <div v-for="item in subSecList" :key="item.id"
              @click="handleSubSecClick(item)"
              class="nav-btn" :class="{ actived: item.id === curSubTab.id }">
              {{ item.colName }}
            </div>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <b-loading fix showText="加载中...." v-if="loading">
            </b-loading>

            <template v-if="contentList.length > 0">
              <ul>
                <li v-for="item in contentList" :key="item.id">
                  <div class="title-con">
                    <img :src="`/api/cms/attach/download?attachmentId=${item.thumbnailPath}`" alt=""
                      v-show="item.thumbnailPath !== null">
                    <div class="title-text">
                      <p v-html="item.title" @click="handleTitleBtnClick(item.id)"></p>
                      <div v-html="item.summary"></div>
                    </div>
                  </div>

                  <div class="tips">
                    <span>{{ $util.parseTime(new Date(item.publishDate), '{y}-{m}-{d}')}}</span>
                    <span>浏览: {{ item.accessCnt }}</span>
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

            <b-empty v-else style="margin-top: 20%;">暂时没用内容哦</b-empty>
          </div>
        </transition>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import {
    getTopColumn,
    getSectionRoots, getSectionChildren,
    getContentList, getContentListByKeyword
  } from '../../api/content.api'

  export default {
    name: 'Content',
    data () {
      return {
        visible: false,
        loading: false,
        activeTab: '',
        curRootTab: {}, // 当前选中的根栏目tab
        curSubTab: {}, // 当前选中的子栏目tab
        tabs: [],
        subSecList: [],
        total: 0,
        query: { // 内容的查询参数
          columnId: '',
          contentStatus: 'PUBLISHED',
          keyword: '',
          size: 10,
          page: 1
        },
        contentList: []
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
        const query = this.$route.query
        await this.getTopColumn(query.pId)
        await this.getSectionChildren(this.curRootTab.id, query.sId)
        this.visible = true
        if (this.subSecList.length > 0) {
          if (query.keyword) {
            this.query.keyword = query.keyword
            await this.getContentListByKeyword(this.query)
          } else {
            this.query.columnId = this.curSubTab.id
            await this.getContentList(this.query)
          }
        }
      },

      /**
       * @author haodongdong
       * @description 获取topColumn接口筛选后的顶级栏目节点
       * @param {string} [activedSecId] 当前使之活动栏目
       */
      async getTopColumn (activedSecId = undefined) {
        try {
          const res = await getTopColumn()
          res.forEach(item => {
            item.key = item.id
            item.title = item.colName
            this.tabs.push(item)
          })
          this.$nextTick(() => {
            let index = this.tabs.findIndex(item => item.id === activedSecId)
            index = index === -1 ? 0 : index
            this.curRootTab = this.tabs[index]
            this.$refs.tabs.handleSelectTab(this.tabs[index])
          })
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取子栏目
       * @param {string} parentColId 父栏目id
       * @param {string} [activedSecId] 当前使之活动栏目
       */
      async getSectionChildren (parentColId, activedSecId = undefined) {
        try {
          const res = await getSectionChildren(parentColId)
          this.subSecList = res
          // 有子栏目则设置左侧默认选中
          if (this.subSecList.length > 0) {
            let index = this.subSecList.findIndex(item => item.id === activedSecId)
            index = index === -1 ? 0 : index
            this.curSubTab = this.subSecList[index]
          }
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 根据栏目获取文章内容
       * @param {Object} query 查询参数
       * @param {string} query.columnId 所属栏目id
       * @param {string} query.contentStatus 内容状态
       * @param {number} query.size 分页尺寸
       * @param {number} query.page 页数
       */
      async getContentList (query) {
        this.loading = true
        try {
          const res = await getContentList(query)
          this.contentList = res.rows
          this.total = res.total
        } catch (error) {
          console.error(error)
        }
        this.loading = false
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
          this.contentList = res.rows
          this.total = res.total
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 查询函数
       */
      handleSearch () {
        this.query.page = 1
        if (this.query.keyword) {
          this.getContentListByKeyword(this.query)
        } else {
          this.getContentList(this.query)
        }
      },

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
      },

      /**
       * @author haodongdong
       * @description 左侧子栏目点击事件
       * @param {Object} tab 子栏目对象
       */
      handleSubSecClick (tab) {
        this.curSubTab = tab
        this.query.page = 1
        this.query.columnId = tab.id
        this.$router.push({ // 暂时用于清空可能存在的url参数
          path: '/content/index'
        })
        this.getContentList(this.query)
      },

      /**
       * @author haodongdong
       * @description 点击文章标题的回调
       * @param {string} 文章id
       */
      handleTitleBtnClick (id) {
        this.$router.push({
          path: '/content/detail',
          query: {
            pId: this.curRootTab.id,
            sId: this.curSubTab.id,
            pName: this.curRootTab.colName,
            sName: this.curSubTab.colName,
            contentId: id
          }
        })
      },

      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       */
      handlePageChange (page) {
        this.query.page = page
        this.getContentList(this.query)
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
      top: -12px;
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
    background: url("../../assets/images/content/banner-bg0.png") no-repeat 0 0;
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
          height: 47px;;
          width: 400px;
        }
      }
    }

    .list-con {
      display: flex;
      justify-content: space-between;
      width: 1300px;
      margin: 25px auto 25px;

      .left {
        max-height: 400px;
        width: 300px;
        background: #ffffff;

        .col-title {
          display: flex;
          align-items: center;
          padding: 0 15px;
          height: 55px;
          border-bottom: 1px dashed  #d9d9d9;

          h3 {
            margin-left: 15px;
          }
        }

        .nav-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 55px;
          font-size: 15px;
          border-bottom: 1px dashed  #d9d9d9;
          cursor: pointer;
          transition: all 0.4s;

          &:hover {
            color: #ffffff;
            background: rgba(13, 133, 255, 0.2);
          }

          &.actived {
            color: #ffffff;
            background: rgba(13, 133, 255, 0.5);
          }
        }
      }

      .right {
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
                  display: inline-block;
                  margin-top: 10px;
                  margin-left: 13px;
                  color: #bfbfbf;
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
