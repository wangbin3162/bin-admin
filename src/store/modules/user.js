import { login, logout } from '../../api/login'
import util from '../../core/utils/util'
import { ACCESS_TOKEN } from '../mutation-types'

export default {
  state: {
    token: '', // token
    roles: [],
    info: {} // user的登录信息
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 登录
    login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data.result
          console.log('vuex:')
          console.log(result)
          // 设置token
          util.cookies.set(ACCESS_TOKEN, result.token)
          commit('SET_TOKEN', result.token)
          resolve(result)
        }).catch(error => {
          console.log('error')
          reject(error)
        })
      })
    },
    // 登出
    logout ({ commit }) {
      return new Promise((resolve) => {
        // 删除cookie
        util.cookies.remove(ACCESS_TOKEN)
        // 删除缓存的token
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])

        logout().then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }
  }
}
