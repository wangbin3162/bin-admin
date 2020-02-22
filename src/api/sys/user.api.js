// 用户管理相关请求
import request from '../request'

/* 获取所有用户列表 */
export function getUserList(query) {
  const data = new URLSearchParams()
  data.append('size', query.size)
  data.append('page', query.page - 1)
  data.append('username', query.username)
  data.append('realName', query.realName)
  data.append('departId', query.departId)
  data.append('status', query.status)
  data.append('sort', 'sortNum,asc')
  data.append('sort', 'createDate,desc')
  return request({
    url: '/management/user/search',
    method: 'get',
    params: data
  })
}

/* 新增用户信息 */
export function createUser(user) {
  return request({
    url: '/management/user/create',
    method: 'post',
    data: {
      username: user.username,
      realName: user.realName,
      mobile: user.mobile,
      departId: user.departId,
      email: user.email,
      status: user.status,
      roles: user.roles,
      remark: user.remark
    }
  })
}

/* 修改用户信息 */
export function modifyUser(user) {
  return request({
    url: '/management/user/modify',
    method: 'post',
    data: {
      id: user.id,
      username: user.username,
      realName: user.realName,
      mobile: user.mobile,
      departId: user.departId,
      email: user.email,
      status: user.status,
      roles: user.roles,
      remark: user.remark
    }
  })
}

/* 启用禁用用户信息 */
export function changeStatus(user) {
  let data = [user.id]
  return request({
    url: '/management/user/changeStatus',
    method: 'post',
    data,
    params: {
      flagType: user.status
    }
  })
}

/* 删除用户信息 */
export function removeUser(user) {
  return request({
    url: '/management/user/remove',
    method: 'post',
    params: {
      id: user.id
    }
  })
}

/* 删除用户信息 */
export function resetUserPwd(user) {
  let data = [user.id]
  return request({
    url: '/management/user/resetPwd',
    method: 'post',
    data
  })
}

/* 用户名是否唯一 */
export function oneUsername(user) {
  return request({
    url: '/management/user/checkUsernameExists',
    method: 'get',
    params: {
      id: user.id || '',
      username: user.username
    }
  })
}

/* 手机号是否唯一 */
export function oneMobile(user) {
  return request({
    url: '/management/user/checkMobileExists',
    method: 'get',
    params: {
      id: user.id || '',
      mobile: user.mobile
    }
  })
}

/* Email是否唯一 */
export function oneEmail(user) {
  return request({
    url: '/management/user/checkEmailExists',
    method: 'get',
    params: {
      id: user.id || '',
      email: user.email
    }
  })
}

/* 下载用户模板 */
export function downloadUserTemplate() {
  return request.get('/management/user/downloadUserTemplate', {
    responseType: 'blob'
  })
}
