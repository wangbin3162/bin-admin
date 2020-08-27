import Mock from 'mockjs'
import { builder, getBody } from '../util'
import menuList from '@/common/config/menuList'

// 默认的用户名密码
const username = ['admin', 'user', 'super']
const password = ['admin', 'user'] // admin,
const testMenu = menuList

const login = (options) => {
  // 拼装请求体
  const body = getBody(options)
  // console.log('mock: body', body)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }
  return builder('4291d7da9005377ec9aec4a71ea837f', '', '0', { 'Custom-Header': Mock.mock('@guid') })
}

const info = (options) => {
  const userInfo = {
    departCode: '10000',
    departId: 'pre_ncloud_sys_depart_10000',
    departKind: 'DOMAIN',
    departName: '信用办',
    functions: [...testMenu],
    permissions: {},
    realName: '管理员',
    roleCodes: 'ROLE_ADMIN',
    roleNames: '王彬',
    username: 'admin'
  }
  return builder(userInfo)
}

Mock.mock(/\/user\/login/, 'post', login)
Mock.mock(/\/user\/info/, 'get', info)
