import { login, getInfo } from '../../api/login'
import util from '../../core/utils/util'
import { ACCESS_TOKEN } from '../mutation-types'

export default {
  state: {
    token: '', // token
    username: '',
    roles: [],
    info: {} // user的登录信息
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
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
        resolve()
      })
    },
    // 获取用户信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data.result
          console.log(result)
          // 判断角色权限是否存在
          if (result.roles && result.roles.length > 0) {
            commit('SET_ROLES', result.roles)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
