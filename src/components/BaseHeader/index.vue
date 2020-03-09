<template>
  <div class="header-wrap" :class="{'detail':showSearch}">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../assets/images/logo-white.png" height="90" width="320" alt="logo"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <div class="links">
          <div class="inner">
            <span class="item"><a href="" @click.stop.prevent="home">首页</a></span>
            <span class="item"><a href="">信用监管</a></span>
            <span class="item"><a href="">信用评价</a></span>
            <span class="item"><a href="">大数据分析</a></span>
            <span class="item"><a href="">专项应用</a></span>
            <span class="item"><a href="/dir/" target="_blank">数据治理</a></span>
          </div>
        </div>
        <div class="search-btn" v-if="showSearch" @click="changeDisplay(true)">
          <img src="../../assets/images/search.png" height="24" width="24" alt="icon" title="查询"/>
        </div>
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
        return this.$store.state.user.info.roleNames
      }
    },
    methods: {
      home() {
        this.$store.dispatch('resetQuery')
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
    &.detail {
      background: rgba(16, 103, 222, 0.5) url("../../assets/images/header-bg.png") no-repeat center top;
    }
    .header-inner {
      position: relative;
      width: 1300px;
      margin: 0 auto;
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
        justify-content: right;
        align-items: center;
        top: 0;
        right: 0;
        width: 880px;
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
