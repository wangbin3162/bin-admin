import request from './request'

// 根据是否使用mock.js来设置基础url
// let baseUrl = 'https://easy-mock.com/mock/5a93b9748be1e80aa1c9293e/vue-admin'
let baseUrl = process.env.NODE_ENV === 'production'
  ? '/preview/bin-admin'
  : '/mock'

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
export function login(data) {
  return request({
    url: `${baseUrl}/user/login`,
    method: 'post',
    data: data
  })
}

/**
 * 获取用户信息
 * @returns {*}
 */
export function getInfo() {
  return request({
    url: `${baseUrl}/user/info`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
