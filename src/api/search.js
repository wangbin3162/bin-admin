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
 * 获取正负面信息统计次数
 */
export function getRedBlackNums (personId, type) {
  return request({
    url: '/api/docs/pn/aggs',
    type: 'get',
    params: {
      personId, type
    }
  })
}

/**
 * 自然人、法人或其他组织正负面信息资源统计接口
 */
export function getPnStat (personId, type, pnType) {
  return request({
    url: '/api/docs/pn/stat',
    type: 'get',
    params: {
      personId, type, pnType
    }
  })
}

/**
 * 获取7大类别tab
 */
export function getAggs (personId, type) {
  return request({
    url: '/api/docs/aggs',
    type: 'get',
    params: {
      personId, type
    }
  })
}

/**
 * 法人或其他组织法定代表人所属公司列表查询接口
 */
export function getCompList (fddbr) {
  return request({
    url: '/api/docs/compList',
    type: 'get',
    params: {
      fddbr
    }
  })
}
