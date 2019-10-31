// 登录相关接口文件
import request from './api_request'

/**
 * 获取查询结果列表
 */
export function getSearchList (listQuery) {
  return request({
    url: '/api/docs/search',
    type: 'get',
    params: {
      q: listQuery.q,
      type: listQuery.type,
      page: listQuery.page - 1,
      size: listQuery.size
    }
  })
}
