<template>
  <base-layout>
    <div class="content">
      <base-header @on-home="handleHome"></base-header>

      <div class="title">
        <div class="con">
          <p>新闻动态</p>
          <span>关注信用/关注政策/关注事实</span>
        </div>
      </div>

      <div class="sec-nav-con">
        <div class="sec-nav">
          <div class="tabs">
            <b-tabs v-model="activeTab" :data="tabs"></b-tabs>
          </div>

          <div class="input">
            <b-input placeholder="请输入想查询的文字">
               <b-icon name="ios-search" slot="suffix" ></b-icon>
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

            <div class="nav-btn" :class="{ actived: n === 1}" v-for="n in 5" :key="n">
              法律法规
            </div>
          </div>
        </transition>

        <transition name="move-right">
          <div class="right" v-show="visible">
            <ul>
              <li v-for="n in 7" :key="n">
                <p>关于支持民营企业参与交通基础设施建设发展的实施意见（发改基础[2020] 1008号）</p>
                <div class="tips">
                  <span>2020-07-13</span>
                  <span>浏览1215</span>
                </div>
              </li>
            </ul>

            <div class="page">
              <b-page :total="0" :current="1" @on-change="handlePageChange">
              </b-page>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </base-layout>
</template>

<script>
  export default {
    name: 'Content',
    data () {
      return {
        visible: false,
        tabs: [
          { key: 'tab1', title: '用户管理' },
          { key: 'tab2', title: '组织管理' },
          { key: 'tab3', title: '系统管理' },
          { key: 'tab4', title: '目录模块配置' },
          { key: 'tab11', title: '用户管理' },
          { key: 'tab22', title: '组织管理' },
          { key: 'tab33', title: '系统管理' },
          { key: 'tab44', title: '目录模块配置' }
        ],
        activeTab: 'tab1'
      }
    },
    created () {

    },
    mounted () {
      this.visible = true
    },
    methods: {
      handleHome () {

      },

      handlePageChange () {

      }
    }
  }
</script>

<style lang="stylus">
  .content {
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
            background: rgba(13, 133, 255, 0.5);
          }

          &.actived {
            color: #ffffff;
            background: rgba(13, 133, 255, 0.5);
          }
        }
      }

      .right {
        min-height: 500px;
        width: 975px;
        padding: 20px 25px;
        background: #ffffff;

        ul {
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 90px;
            // margin-bottom: 10px;
            border-bottom: 1px solid #d9d9d9;

            p {
              font-size: 17px;
              margin-bottom: 10px;
              cursor: pointer;

              &:hover {
                color: #3d9dff;
                transition: color 0.2s;
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
