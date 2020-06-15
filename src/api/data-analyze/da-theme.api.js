// 系统日志管理相关请求
import request from '../request'

/* 获取所有列表 */
export function getThemeList(query) {
  return request.get('/da/theme/search', {
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name,
      code: query.code,
      category: query.code,
      sort: 'createDate,desc'
    }
  })
}

/* 编码唯一 */
export function oneCode(item) {
  return request({
    url: '/da/theme/checkCode',
    method: 'get',
    params: {
      code: item.code,
      id: item.id
    }
  })
}

/* 新增主题 */
export function createTheme(item) {
  return request({
    url: '/da/theme/create',
    method: 'post',
    data: {
      name: item.name,
      code: item.code,
      url: item.url,
      category: item.category,
      describe: item.describe
    }
  })
}

/* 删除主题 */
export function removeTheme(item) {
  return request({
    url: '/da/theme/remove',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 修改主题 */
export function modifyTheme(item) {
  return request({
    url: '/da/theme/modify',
    method: 'post',
    data: {
      id: item.id,
      name: item.name,
      code: item.code,
      url: item.url,
      category: item.category,
      describe: item.describe
    }
  })
}

/* 获取主题列表 */
export function getThemeTree() {
  return request({
    url: '/da/theme/list',
    method: 'get'
  })
}
