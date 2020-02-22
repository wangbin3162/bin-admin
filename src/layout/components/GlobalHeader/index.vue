<template>
  <header class="layout-header" :class="{'fixed-header':fixedHeader}" :style="fixedHeaderStyle">
    <div v-if="hasAside" class="global-header">
      <div class="global-header-trigger" @click="toggleSideBar">
        <b-icon :name="sidebar?'outdent':'indent'"></b-icon>
      </div>
      <div style="flex: 1 1 0;"></div>
      <div class="global-header-right">
        <div class="dropdown-trigger" @click="themeModal=true">
          <b-icon name="ios-color-palette" size="20"></b-icon>
        </div>
        <user-avatar @on-change-password="handleChangePwd"/>
      </div>
    </div>
    <!--顶部导航栏时的内容-->
    <div v-else class="top-nav-header">
      <div class="top-nav-header-main wide">
        <div class="logo">
          <img class="icon" src="../../../assets/images/logo-icon-b.png" alt="logo-small"/>
          <h1>Bin Admin Pro</h1>
        </div>
        <!--顶部导航栏菜单-->
        <div style="flex: 1 1 0;">
          <header-menu/>
        </div>
        <div class="global-header-right">
          <div class="dropdown-trigger" @click="themeModal=true">
            <b-icon name="ios-color-palette" size="20"></b-icon>
          </div>
          <user-avatar @on-change-password="handleChangePwd"/>
        </div>
      </div>
    </div>
    <!--设置抽屉-->
    <b-drawer v-model="themeModal" append-to-body :closable="false">
      <div class="setting-panel">
        <h3 class="setting-theme-title">整体风格设置:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="亮色主题风格" theme="dark">
            <span @click="themChange('light')">
              <img src="../../../assets/images/light.svg" alt="">
              <i v-if="theme === 'light'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="暗色主题风格" theme="dark">
            <span @click="themChange('dark')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="theme === 'dark'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <b-divider></b-divider>
        <h3 class="setting-theme-title">导航栏模式:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="侧边导航" theme="dark">
            <span @click="menuTypeChange('aside')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="menuType === 'aside'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="顶部导航" theme="dark">
            <span @click="menuTypeChange('header')">
              <img src="../../../assets/images/header.svg" alt="">
              <i v-if="menuType === 'header'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <div class="setting-list-item">
          <span>固定Header</span>
          <b-switch :value="fixedHeader" @on-change="changeFixedHeader"></b-switch>
        </div>
        <div class="setting-list-item">
          <span>固定侧边栏</span>
          <b-switch :disabled="menuType==='header'" :value="fixedAside"
                    @on-change="changeFixedAside"></b-switch>
        </div>
      </div>
    </b-drawer>
    <!--修改密码弹窗-->
    <b-modal v-model="pwdModal" title="修改密码" append-to-body loading width="400">
      <b-form :model="user" ref="form" :rules="ruleValidate" :label-width="80" class="pt-10">
        <b-form-item label="原密码" prop="oldPwd">
          <b-input v-model="user.oldPwd" type="password" clearable></b-input>
        </b-form-item>
        <b-form-item label="新密码" prop="pwd" class="bin-form-item-required">
          <b-input v-model="user.pwd" type="password" clearable></b-input>
        </b-form-item>
        <b-form-item label="确认密码" prop="confirmPwd" class="bin-form-item-required">
          <b-input v-model="user.confirmPwd" type="password" clearable></b-input>
        </b-form-item>
      </b-form>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit">保存</b-button>
        <b-button plain @click="pwdModal = false">取消</b-button>
      </div>
    </b-modal>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HeaderMenu from './HeaderMenu'
  import UserAvatar from './UserAvatar'
  import { modifyPwd } from '../../../api/login.api'
  import { verifyPassword } from '../../../common/utils/validate'

  export default {
    name: 'GlobalHeader',
    components: { HeaderMenu, UserAvatar },
    data() {
      const checkPwd = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'))
        }
        if (!verifyPassword(value)) {
          return callback(new Error('密码必须包含字母和数字，长度为8-16之间'))
        }
        if (this.user.confirmPwd.length > 0) {
          this.$refs.form.validateField('confirmPwd')
        }
        callback()
      }
      const checkConfirmPwd = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入确认密码'))
        }
        if (value !== this.user.pwd) {
          return callback(new Error('两次密码不一致'))
        }
        callback()
      }
      return {
        themeModal: false,
        pwdModal: false,
        user: {
          oldPwd: '',
          pwd: '',
          confirmPwd: ''
        },
        ruleValidate: {
          oldPwd: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
          pwd: [{ validator: checkPwd, trigger: 'blur' }],
          confirmPwd: [{ validator: checkConfirmPwd, trigger: 'blur' }]
        }
      }
    },
    computed: {
      ...mapGetters(['theme', 'sidebar', 'menuType', 'fixedHeader', 'fixedAside']),
      hasAside() {
        return this.menuType === 'aside'
      },
      fixedHeaderStyle() {
        return {
          padding: 0,
          width: this.hasAside ? (this.fixedHeader ? `calc(100% - ${this.sidebar ? 256 : 64}px)` : '100%') : '100%',
          zIndex: 9,
          right: this.fixedHeader ? 0 : null
        }
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      themChange(val) {
        this.$store.dispatch('setThemeMode', val)
      },
      menuTypeChange(type) {
        this.$store.dispatch('setMenuType', type)
        // 重定向当前页面
        this.$router.replace('/refresh')
      },
      changeFixedHeader(val) {
        this.$store.dispatch('toggleFixedHeader', val)
        console.log(val)
      },
      changeFixedAside(val) {
        this.$store.dispatch('toggleFixedAside', val)
      },
      handleChangePwd() {
        this.pwdModal = true
        this.user = {
          oldPwd: '',
          pwd: '',
          confirmPwd: ''
        }
        this.$refs.form && this.$refs.form.resetFields()
      },
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let { oldPwd, pwd, confirmPwd } = this.user
            modifyPwd(oldPwd, pwd, confirmPwd).then(response => {
              if (response.status === 200 && response.data.code === '0') {
                this.pwdModal = false
                this.$message({ type: 'success', content: '修改密码成功，稍后请重新登录' })
                setTimeout(() => {
                  this.$store.dispatch('logout').then(() => {
                    this.$router.push({ name: 'login' })
                  })
                }, 3000)
              } else {
                this.pwdModal = false
                this.$message({ type: 'danger', content: '操作失败' + response.data.message })
              }
            })
          }
        })
      }
    }
  }
</script>
