// 挖掘配置
import request from '../request'

/* 获取资源信息列表 */
export function getResInfoList(query) {
  return request({
    url: '/api/dir/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceCode: query.resourceCode,
      resourceName: query.resourceName,
      status: query.status,
      availableStatus: query.availableStatus,
      resProperty: query.resProperty,
      isOpen: query.isOpen || '',
      sort: 'resourceKey,desc'
    }
  })
}

/* 获取资源性质树 */
export function getResPropertyTree() {
  return request({
    url: '/api/dir/classify/tree',
    method: 'get',
    params: {
      code: 'B'
    }
  })
}
