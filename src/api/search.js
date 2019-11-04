// 信用档案查询相关接口文件
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

/**
 * 根据id和类型查询档案详情
 */
export function getDetail (id, type) {
  return request({
    url: '/api/docs/detail',
    type: 'get',
    params: {
      id, type
    }
  })
}

/**
 * 获取7大类别tab
 */
export function getClassify () {
  return request({
    url: '/api/docs/classify',
    type: 'get'
  })
}
