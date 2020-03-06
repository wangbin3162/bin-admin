// 系统日志管理相关请求
import request from '../request'

const urlMap = {
  search: '/da/api/searchDaApi',
  add: '/da/api/add',
  modify: '/da/api/modify',
  remove: '/da/api/remove',
  detail: '/da/api/daApiDetail',
}

/* 获取所有列表 */
export function getApiList(query) {
  return request.get(urlMap.search, {
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      type: query.type,
      sort: 'createDate,desc'
    }
  })
}
/* 获取明细 */
export function getApiDetail(id) {
  console.log(id)
  return request.get(urlMap.detail, {
    params: {
      id : id
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
  return request({
    url: '/da/api/addDaApi',
    method: 'post',
    data: item
  })
}

/* 删除用户信息 */
export function handleRemove(item) {
  return request({
    url: '/da/api/removeDaApi',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 修改字典项 */
export function modifyTheme(item) {
  return request({
    url: '/da/api/modifyDaApi',
    method: 'post',
    data: item
  })
}
