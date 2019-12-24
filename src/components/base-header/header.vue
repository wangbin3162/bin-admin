<template>
  <div class="header-wrap">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../assets/images/logo.png" height="90" width="320" alt="logo" class="link" @click="home"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <template v-if="!this.$slots.default">
          <div class="links">
            <div class="inner">
              <span class="item"><router-link to="index" tag="a">首页</router-link></span>
              <span class="item"><a href="javascript:;">信用监管</a></span>
              <span class="item"><a href="javascript:;">信用评级</a></span>
              <span class="item"><a href="javascript:;">大数据分析</a></span>
              <span class="item"><a href="javascript:;">专项应用</a></span>
              <span class="item"><a href="/dir/" target="_blank">数据治理</a></span>
            </div>
          </div>
          <b-dropdown>
            <div class="user" flex="main:center cross:center">
              <img src="../../assets/images/ixon-user.png" height="24" width="24" alt="icon"/>
              <span class="pl-5">
                {{ userName }}
                <b-icon name="md-arrow-dropdown" size="20"></b-icon>
              </span>
            </div>
            <b-dropdown-menu slot="list">
              <b-dropdown-item @click.native="logout">注销</b-dropdown-item>
            </b-dropdown-menu>
          </b-dropdown>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseHeader',
    computed: {
      userRoles () {
        return this.$store.state.user.roles
      },
      userName () {
        return this.$store.state.user.info.roleNames
      }
    },
    methods: {
      home () {
        this.$router.push('/index')
      },
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-wrap {
    background: #fff;
    box-shadow: 0 0 8px #d1d1d1;
    .header-inner {
      width: 1300px;
      margin: 0 auto;
      .links {
        .inner {
          text-align: right;
          .item {
            display inline-block;
            width: 120px;
            border-right: 1px solid #e1e1e1;
            text-align: center;
            a {
              color: #646c77;
            }
          }
        }
      }
      .user {
        width 140px;
      }
    }
  }
</style>
