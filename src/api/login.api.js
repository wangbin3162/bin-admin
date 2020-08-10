// 登录相关接口文件
import request, { requestPost } from './request'
import { reject } from 'core-js/fn/promise'

/**
 * 获取4位验证码
 */
export function getVerifyCode() {
  return request.get('/auth/verifyCode', {
    responseType: 'arraybuffer'
  })
}

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
  return requestPost('/auth/login', data)
}

/**
 * 获取用户信息
 * @returns {*}
 */
export function getInfo() {
  return request.get('/user/info')
}

/**
 * 修改登录密码
 * @param oldPwd
 * @param pwd
 * @param confirmPwd
 */
export function modifyPwd(oldPwd, pwd, confirmPwd) {
  return request({
    url: '/user/modifyPwd',
    method: 'post',
    data: {
      oldPwd: oldPwd,
      pwd: pwd,
      confirmPwd: confirmPwd
    }
  })
}

/**
 * @author haodongdong
 * @description 证书验证，验证客户端序列号是否可用，前端需要轮询调用该接口来判断证书有效。
 * 证书无效需要页面提示“证书已过期”，并返回到登录页面，不允许用户登录。
 * @returns {Promise}
 */
export async function licCheck () {
 return new Promise(async (resolve, reject) => {
   try {
     const res = await request({
      url: '/lic/check',
      method: 'get'
    })
    if (res.data.successful) {
      resolve()
    } else {
      reject(res.data.message)
    }
   } catch (error) {
    reject(error)
   }
 })
}
