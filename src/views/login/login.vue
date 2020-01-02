<template>
  <div class="page-login">
    <!--背景-->
    <div class="layer area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="main-wrap">
      <div class="header-inner">
        <img src="../../assets/images/logo-white.png" height="90" width="320" alt="logo" class="link"/>
      </div>
      <!--登录框-->
      <div class="content" flex="main:right cross:center">
        <div class="form">
          <div class="title">
            <h2>用户登录</h2>
            <p>USER LOGIN</p>
          </div>
          <b-form class="login-form" ref="loginForm" label-position="top"
                  :rules="rules" :model="formLogin">
            <b-form-item prop="username">
              <b-input type="text" v-model="formLogin.username" placeholder="请输入用户名">
                <img src="./images/User.png" height="30" width="30" alt="user" slot="prefix"/>
              </b-input>
            </b-form-item>
            <b-form-item prop="password">
              <b-input type="password" v-model="formLogin.password" placeholder="请输入密码">
                <img src="./images/Key.png" height="30" width="30" alt="key" slot="prefix"/>
              </b-input>
            </b-form-item>
            <b-form-item prop="captcha">
              <div class="captcha">
                <b-input type="text" v-model="formLogin.captcha" :maxlength="4" placeholder="验证码" flex-box="1">
                  <img src="./images/keycode.png" height="30" width="30" alt="key" slot="prefix"/>
                </b-input>
                <img :src="verifyCodeUrl" class="login-code" @click="refreshCode" title="点击刷新" alt="code">
              </div>
            </b-form-item>
            <div flex="main:center">
              <b-button @click="submit" class="button-login" v-waves :loading="loginLoading" size="large"
                        type="primary">
                {{ loginLoading? '登陆中...' :'登 录' }}
              </b-button>
            </div>
          </b-form>
        </div>
      </div>
    </div>
    <base-footer></base-footer>
  </div>
</template>

<script>
  import { getVerifyCode, login } from '../../api/login'

  export default {
    name: 'Login',
    data () {
      return {
        verifyCodeUrl: '',
        timeInterval: null,
        // 表单
        formLogin: {
          username: 'admin',
          password: '123456',
          captcha: ''
        },
        // 校验
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        loginLoading: false
      }
    },
    created () {
      this.refreshCode()
      document.addEventListener('keyup', this.enter)
    },
    methods: {
      // enter键盘事件
      enter (e) {
        if (e.code === 'Enter') {
          this.submit()
        }
      },
      // 刷新验证码
      refreshCode () {
        getVerifyCode().then(response => {
          if (response.status === 200) {
            this.verifyCodeUrl = 'data:image/png;base64,' + btoa(
              new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            )
            this.formLogin.captcha = ''
          } else {
            this.$message({ type: 'danger', content: '验证码请求错误' })
          }
        })
      },
      // 提交登录信息
      submit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loginLoading = true
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
        if (res.data.code === '0') {
          const token = res.data.data
          this.$store.dispatch('setToken', token).then(() => {
            // 重定向对象不存在则返回顶层路径
            this.$router.push('/')
          })
        } else {
          this.$message({ content: res.data.message, type: 'danger' })
          this.refreshCode()
        }
        this.loginLoading = false
      },
      // 登录失败
      requestFailed (err) {
        this.loginLoading = false
        this.refreshCode()
        this.$message({ type: 'danger', content: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试' })
      }
    },
    beforeDestroy () {
      document.removeEventListener('keyup', this.enter)
    }
  }
</script>

<style lang="stylus" scoped>
  .page-login {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    // 层
    .layer {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: auto;
      z-index: 0;
    }
    .area {
      overflow: hidden;
    }
    .main-wrap {
      flex: 1;
      background: url("images/login-bg.png") no-repeat center center;
    }
    // 登陆页面控件的容器
    .content {
      padding: 40px 200px;
      // 登录表单
      .form {
        position: relative;
        width: 472px;
        height: 500px;
        padding: 50px 40px 70px;
        background: #fff;
        box-sizing: border-box;
        .title {
          background-size: 100% 100%
          text-align: center;
          h2 {
            font-size: 24px;
            color: #666666;
            font-weight: normal;
            margin: 0;
          }
          p {
            font-size: 14px;
            color: #999999;
            margin: 0;
            padding: 10px;
          }
        }
        .login-form {
          padding: 20px 0;
        }
        .captcha {
          position: relative;
          .login-code {
            position: absolute;
            right: 0;
            top: 10px;
            width: 108px;
            height: 36px;
            cursor: pointer;
          }
        }
        // 登录按钮
        .button-login {
          width: 95%;
          margin-top: 15px;
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
            opacity: .3;
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
          width: 30px;
          height: 30px;
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
          width: 50px;
          height: 50px;
          animation-delay: 3s;
        }
        &:nth-child(7) {
          left: 35%;
          width: 20px;
          height: 20px;
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
          width: 50px;
          height: 50px;
          animation-delay: 0s;
          animation-duration: 11s;
        }
      }
    }
  }
  .header-inner {
    width: 1300px;
    margin: 0 auto;
  }
</style>
