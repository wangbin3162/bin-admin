import request from './api_request'

// 根据是否使用mock.js来设置基础url
// let baseUrl = 'https://easy-mock.com/mock/5a93b9748be1e80aa1c9293e/vue-admin'
let baseUrl = '/mock'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param data
 * @returns {*}
 */
export function login (data) {
  return request({
    url: `${baseUrl}/user/login`,
    method: 'post',
    data: data
  })
}

/**
 * 退出登录
 * @returns {*}
 */
export function logout () {
  return request({
    url: `${baseUrl}/user/logout`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
