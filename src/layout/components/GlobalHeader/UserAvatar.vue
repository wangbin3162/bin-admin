<template>
  <div class="dropdown-trigger">
    <b-dropdown>
      <span class="user-link">
        <b-icon name="ios-contact" size="20"></b-icon>&nbsp;
        <span v-if="userInfo">你好,{{ userInfo.realName }}</span>
      </span>
      <b-dropdown-menu slot="list">
        <b-dropdown-item @click.native="handleChangePwd">
          <b-icon name="ios-lock" size="16"></b-icon>&nbsp;
          <span style="vertical-align: middle;">修改密码</span>
        </b-dropdown-item>
        <b-dropdown-item @click.native="handleLogout">
          <b-icon name="ios-log-out" size="16"></b-icon>&nbsp;
          <span style="vertical-align: middle;">注销登录</span>
        </b-dropdown-item>
      </b-dropdown-menu>
    </b-dropdown>
    <!--修改密码弹窗-->
    <b-modal v-model="pwdModal" title="修改密码" append-to-body loading width="400"
             ok-text="保存" @on-ok="handleSubmit" @on-cancel="pwdModal = false">
      <b-form :model="user" ref="form" :rules="ruleValidate" :label-width="100" class="pt-10">
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
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { modifyPwd } from '@/api/login.api'
import { verifyPassword } from '@/common/utils/validate'

export default {
  name: 'UserAvatar',
  computed: {
    ...mapGetters(['userInfo'])
  },
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
  methods: {
    handleLogout() {
      this.$confirm({
        title: '注销',
        content: '确认退出登录吗？',
        onOk: () => {
          this.$store.dispatch('logout').then(() => {
            this.$router.push('/login')
          }).catch(err => {
            this.$message({ type: 'danger', content: err.message })
          })
        }
      })
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
