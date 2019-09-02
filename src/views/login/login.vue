<template>
  <div class="page-login">
    <!--背景-->
    <div class="layer area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <!--时间-->
    <div class="layer time" flex="main:center cross:center">{{time}}</div>
    <!--登录框-->
    <div class="layer">
      <div class="content" flex="dir:top main:justify cross:center box:justify">
        <div class="header">
          <p class="header-motto">
            时间是一切财富中最宝贵的财富。 <span>—— 德奥弗拉斯多</span>
          </p>
        </div>
        <div class="main" flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="../../assets/images/logo.png" alt="logo">
          <!-- 表单 -->
          <div class="form">
            <b-card shadow="never">
              <b-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <b-form-item prop="username">
                  <b-input type="text" v-model="formLogin.username" placeholder="用户名" prefix="ios-contact"></b-input>
                </b-form-item>
                <b-form-item prop="password">
                  <b-input type="password" v-model="formLogin.password" placeholder="密码" prefix="ios-key"></b-input>
                </b-form-item>
                <b-form-item prop="code">
                  <b-input type="text" v-model="formLogin.code" placeholder="- - - -" style="width: 60%;"
                           prefix="ios-bulb"></b-input>
                  <span class="login-code"><img src="./image/login-code.png" alt="code"></span>
                </b-form-item>
                <b-button @click="submit" type="primary" class="button-login" v-waves>登录</b-button>
              </b-form>
            </b-card>
          </div>
        </div>
        <div class="footer">
          <p class="footer-copyright">
            bin-admin 简版后台管理系统2.0 <a href="https://github.com/wangbin3162/bin-admin" target="_blank">github</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dayJs from 'dayjs'
  import { login } from '../../api/login'
  import util from '../../utils/util'

  export default {
    name: 'Login',
    data () {
      return {
        timeInterval: null,
        time: dayJs().format('HH:mm:ss'),
        // 表单
        formLogin: {
          username: 'admin',
          password: 'admin',
          code: 'v9am'
        },
        // 校验
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      document.addEventListener('keyup', this.enter)
    },
    mounted () {
      this.timeInterval = setInterval(() => {
        this.refreshTime()
      }, 1000)
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
      document.removeEventListener('keyup', this.enter)
    },
    methods: {
      // enter键盘事件
      enter (e) {
        if (e.code === 'Enter') {
          this.submit()
        }
      },
      refreshTime () {
        this.time = dayJs().format('HH:mm:ss')
      },
      // 提交登录信息
      submit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            // 登录
            login(this.formLogin)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
          } else {
            // 登录表单校验失败
            this.$message({ type: 'danger', content: '请输入登录信息后登录' })
          }
        })
      },
      loginSuccess (res) {
        if (res.data.code === 0) {
          const token = res.data.data
          this.$store.dispatch('setToken', token).then(() => {
            // 重定向对象不存在则返回顶层路径
            this.$router.push('/')
          })
        } else {
          this.$message({ content: res.data.message, type: 'danger' })
        }
      },
      // 登录失败
      requestFailed (err) {
        this.$message({ type: 'danger', content: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试' })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .page-login {
    user-select: none;
    background-color: #F0F2F5;
    height: 100%;
    position: relative;
    // 层
    .layer {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: auto;
    }
    .area {
      overflow: hidden;
    }
    // 时间
    .time {
      font-size: 24em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }

    // 登陆页面控件的容器
    .content {
      height: 100%;
      min-height: 500px;
      // header
      .header {
        padding: 1em 0;
        .header-motto {
          margin: 0;
          padding: 0;
          color: #606266;
          text-align: center;
          font-size: 12px;
          span {
            color: #909399;
          }
        }
      }
      .main {
        .page-login--logo {
          width: 240px;
          margin-bottom: 2em;
          margin-top: -2em;
        }
        // 登录表单
        .form {
          width: 340px;
          box-sizing: border-box;
          // 登录按钮
          .button-login {
            width: 100%;
          }
          .login-code {
            display: inline-block;
            vertical-align: middle;
            width: 40%;
            height: 36px;
            border-radius: 2px;
            overflow: hidden;
            img {
              width: 100%;
              margin-top: -7px;
            }
          }
        }
      }
      // footer
      .footer {
        padding: 1em 0;
        .footer-copyright {
          padding: 0;
          margin: 0;
          font-size: 12px;
          color: #606266;
          a {
            color: #6898f0;
          }
        }
      }
    }
    // 背景
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      li {
        position: absolute;
        display: block;
        list-style: none;
        width: 20px;
        height: 20px;
        background: #FFF;
        animation: animate 25s linear infinite;
        bottom: -200px;
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
        &:nth-child(1) {
          left: 15%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }
        &:nth-child(2) {
          left: 5%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }
        &:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }
        &:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }
        &:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }
        &:nth-child(6) {
          left: 75%;
          width: 150px;
          height: 150px;
          animation-delay: 3s;
        }
        &:nth-child(7) {
          left: 35%;
          width: 200px;
          height: 200px;
          animation-delay: 7s;
        }
        &:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }
        &:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }
        &:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }
      }
    }
  }
</style>
