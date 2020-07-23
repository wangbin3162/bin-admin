<template>
  <div class="header-wrap" :class="{'detail':showSearch}">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../assets/images/login/logo-white.png" @click="home" alt="logo" class="logo"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <div class="links">
          <div class="inner">
            <span class="item"><a href="" @click.stop.prevent="home">首页</a></span>
            <span class="item"><a href="">政策法规</a></span>
            <span class="item"><a href="">数据可视化</a></span>
            <span class="item"><a href="">联合奖惩</a></span>
            <span class="item"><a href="">挖掘分析</a></span>
            <span class="item"><a href="">信用监管</a></span>
            <!-- <span class="item"><a href="/dir/#/dataManage/res/resInfo" target="_blank">数据治理</a></span> -->
            <!-- <span class="item"><a href="/dir/#/creditRating/ratingModel" target="_blank">信用评级</a></span> -->
            <!-- <span class="item"><a href="/dir/#/sys/org/dept" target="_blank">系统管理</a></span> -->
          </div>
        </div>

        <div class="search-btn" v-if="showSearch" @click="changeDisplay(true)">
          <img src="../../assets/images/search.png" height="24" width="24" alt="icon" title="查询"/>
        </div>

        <notice-tips class="ml-15 mr-15">
        </notice-tips>

        <b-dropdown>
          <div class="user" flex="main:center cross:center">
            <img src="../../assets/images/icon-user.png" height="24" width="24" alt="icon"/>
            <span class="pl-5">
                {{ userName }}
                <b-icon name="md-arrow-dropdown" size="20"></b-icon>
              </span>
          </div>
          <b-dropdown-menu slot="list">
            <b-dropdown-item @click.native="logout">注销</b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
      </div>
      <transition name="move">
        <div class="search-wrap" v-show="display">
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import NoticeTips from './NoticeTips'

  export default {
    name: 'BaseHeader',
    props: {
      value: {
        type: Boolean
      },
      showSearch: {
        type: Boolean
      }
    },
    components: {
      NoticeTips
    },
    data() {
      return {
        display: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.display = val
        },
        immediate: true
      }
    },
    computed: {
      userRoles() {
        return this.$store.state.user.roles
      },
      userName() {
        return this.$store.state.user.info.realName
      }
    },
    methods: {
      home() {
        this.$emit('on-home')
        this.$router.push('/index')
      },
      logout() {
        this.$store.dispatch('logout').then(res => {
          this.$router.push('/login')
        })
      },
      changeDisplay(val) {
        this.display = val
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-wrap {
    background: rgba(16, 103, 222, 0.5);
    box-shadow: 0 0 8px rgba(143, 143, 143, 0.51);
    height: 80px;
    &.detail {
      background: rgba(16, 103, 222, 0.5) url("../../assets/images/header-bg.png") no-repeat center top;
      .search-wrap{

      }
    }
    .header-inner {
      position: relative;
      width: 1300px;
      height: 100%;
      margin: 0 auto;
      .logo {
        cursor: pointer;
        height: 100%;
      }
      .links {
        .inner {
          text-align: right;
          .item {
            display inline-block;
            width: 110px;
            text-align: center;
            a {
              color: #fff;
            }
          }
        }
      }
      .user {
        width: auto;
        padding: 0 10px;
        color: #fff;
      }
      .search-btn {
        position: relative;
        cursor: pointer;
        margin-left: 10px;
        padding-right: 10px;
        &:after {
          content: '';
          position: absolute;
          top: 5px;
          bottom: 5px;
          right: 0;
          border-right: 1px solid #e1e1e1;
        }
      }
      .search-wrap {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        right: 0;
        width: 920px;
        height: 100%;
        background-color: #0f80e9; /* 不支持线性的时候显示 */
        background-image: linear-gradient(to right, #0f80e9, #0e89ea);
        &.move-enter-active, &.move-leave-active {
          transition: .35s;
        }
        &.move-enter, &.move-leave-to {
          transform: translateY(-100%)
          opacity: .5;
        }
      }
    }
  }
</style>
