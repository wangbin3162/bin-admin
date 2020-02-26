// 系统日志管理相关请求
import request from '../request'

const urlMap = {
  search: '/da/api/searchDaTheme',
  add: '/da/api/add',
  modify: '/da/api/modify',
  remove: '/da/api/remove'
}

/* 获取所有列表 */
export function getApiList(query) {
  return request.get(urlMap.search, {
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      code: query.code,
      sort: 'createDate,desc'
    }
  })
}
/* 编码唯一 */
export function oneCode(item) {
  return request({
    url: '/da/theme/check/' + item.code + '?id=' + item.id,
    method: 'get'
  })
}

/* 新增字典项 */
export function createTheme(item) {
  const data = {
    name: item.name,
    code: item.code,
    describe: item.describe
  }
  return request({
    url: '/da/theme/addDaTheme',
    method: 'post',
    data
  })
}

/* 删除用户信息 */
export function handleRemove(item) {
  return request({
    url: '/da/theme/removeDaTheme',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 修改字典项 */
export function modifyTheme(item) {
  const data = {
    id: item.id,
    name: item.name,
    code: item.code,
    describe: item.describe
  }
  return request({
    url: '/da/theme/modifyDaTheme',
    method: 'post',
    data
  })
}
