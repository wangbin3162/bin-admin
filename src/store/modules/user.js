import { getInfo } from '../../api/login'
import util from '../../utils/util'
import { ACCESS_TOKEN } from '../mutation-types'
import { resetRouter } from '../../router'

export default {
  state: {
    token: '', // token
    roles: [],
    info: null // user的登录信息
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
    setToken ({ commit }, token) {
      return new Promise((resolve, reject) => {
        try {
          util.cookies.set(ACCESS_TOKEN, token)
          commit('SET_TOKEN', token)
          commit('SET_ROLES', [])
          commit('SET_INFO', null)
          resolve(token)
        } catch (e) {
          reject(e)
        }
      })
    },
    // 登出
    logout ({ commit }) {
      return new Promise((resolve) => {
        // 删除缓存的token
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // 删除cookie
        util.cookies.remove(ACCESS_TOKEN)
        // 清空路由
        resetRouter()
        resolve()
      })
    },
    // 获取用户信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data.data
          // console.log(result)
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
