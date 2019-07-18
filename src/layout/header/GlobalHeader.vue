<template>
  <div class="global-header">
    <!--toggle-btn-->
    <div class="toggle-btn">
      <b-icon name="ios-menu" :class="{'open':sidebar}"
              @click.native="toggleSideBar"></b-icon>
    </div>
    <div class="header-box">
      <div class="left-box">
        <slot>
          <auto-breadcrumb></auto-breadcrumb>
        </slot>
      </div>
      <div class="right-ctrl" flex>
        <!--外部链接-->
        <a href="#" target="_blank" class="btn">
        <span class="action">
          <b-icon name="ios-help-circle"></b-icon>
        </span>
        </a>
        <div class="btn">
          <b-icon name="ios-notifications-outline"></b-icon>
        </div>
        <div class="btn">
          <b-icon name="ios-bug"></b-icon>
        </div>
        <div class="avatar">
          <el-dropdown size="medium" @command="handleCommand">
          <span class="el-dropdown-link">
             <img src="../../assets/images/logo-icon-a.png" alt="avatar"/>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'user'}" icon="el-icon-s-custom">用户中心</el-dropdown-item>
              <el-dropdown-item :command="{type:'logout'}" icon="el-icon-switch-button">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import AutoBreadcrumb from './components/Breadcrumb'

  export default {
    name: 'GlobalHeader',
    computed: {
      ...mapGetters(['sidebar']),
      ...mapActions(['logout'])
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('toggleSideBar')
      },
      handleCommand (command) {
        if (command.type === 'user') {
          this.$message('用户中心，暂时留空')
        }
        // 登出
        if (command.type === 'logout') {
          this.$confirm({
            title: '注销',
            content: '确认退出登录吗？',
            onOk: () => {
              console.log('退出登录')
              this.$store.dispatch('logout').then(() => {
                this.$router.push({ name: 'login' })
              }).catch(err => {
                this.$message({ type: 'danger', content: err.message })
              })
            }
          })
        }
      }
    },
    components: {
      AutoBreadcrumb
    }
  }
</script>

<style scoped lang="stylus">
  .global-header {
    position: relative;
    height: 64px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    .toggle-btn {
      position: absolute;
      left: 0;
      top: 0;
      width: 64px;
      height: 64px;
      text-align: center;
      line-height: 64px;
      .iconfont {
        display: inline-block;
        cursor: pointer;
        font-size: 30px;
        transition: .3s;
        transform: rotateZ(90deg);
        &:hover {
          color: #409EFF;
        }
        &.open {
          transform: rotateZ(0deg);
        }
      }
    }
    .header-box {
      padding: 0 20px 0 64px;
      display: flex;
      justify-content: space-between;
      .left-box {
        line-height: 64px;
      }
      .right-ctrl {
        height: 64px;
        .btn {
          cursor: pointer;
          padding: 0 12px;
          color: #666;
          transition: all .3s;
          line-height: 64px;
          &:hover {
            background-color: #f6f6f6;
          }
          .iconfont {
            font-size: 20px;
          }
        }
        .avatar {
          line-height: 64px;
          padding: 12px;
          .el-dropdown {
            height: 30px;
          }
          .el-dropdown-link {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #e8e8e8;
            overflow: hidden;
            text-align center;
            img {
              position: relative;
              top: -4px;
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
