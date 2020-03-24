// 系统日志管理相关请求
import request from '../request'

/* 获取所有列表 */
export function getThemeList(query) {
  return request.get('/da/theme/searchDaTheme', {
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

/* 新增主题 */
export function createTheme(item) {
  return request({
    url: '/da/theme/addDaTheme',
    method: 'post',
    data: {
      name: item.name,
      code: item.code,
      url: item.url,
      describe: item.describe
    }
  })
}

/* 删除主题 */
export function removeTheme(item) {
  return request({
    url: '/da/theme/removeDaTheme',
    method: 'post',
    params: {
      id: item.id
    }
  })
}

/* 修改主题 */
export function modifyTheme(item) {
  const data = {
    id: item.id,
    name: item.name,
    code: item.code,
    url: item.url,
    describe: item.describe
  }
  return request({
    url: '/da/theme/modifyDaTheme',
    method: 'post',
    data
  })
}
