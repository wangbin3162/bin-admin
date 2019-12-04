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
export function getDetail (id, type, reason) {
  return request({
    url: '/api/docs/detail',
    type: 'get',
    params: {
      id, type, reason
    }
  })
}

/**
 * 获取正负面信息统计次数
 */
export function getPnAggs (personId, type) {
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
 * 指定类别下的资源信息接口
 */
export function getClassifyStat (personId, type, classifyCode) {
  return request({
    url: '/api/docs/classify/stat',
    type: 'get',
    params: {
      personId, type, classifyCode
    }
  })
}

/**
 * 获取资源信息列表
 */
export function getQueryList (listQuery) {
  return request({
    url: '/api/docs/query/list',
    type: 'get',
    params: {
      personId: listQuery.personId,
      resourceKey: listQuery.resourceKey,
      type: listQuery.type,
      page: listQuery.page - 1,
      size: listQuery.size
    }
  })
}

/**
 * 获取资源信息列表详情
 */
export function getQueryDetail (id, resourceKey, type) {
  return request({
    url: '/api/docs/query/detail',
    type: 'get',
    params: {
      id, resourceKey, type
    }
  })
}

/**
 * 法人或其他组织法定代表人所属公司列表查询接口
 */
export function getCompList (fddbr, type) {
  return request({
    url: '/api/docs/compList',
    type: 'get',
    params: {
      fddbr, type
    }
  })
}

/**
 * 统计企业股权接口
 */
export function getStockRightStat (personId) {
  return request({
    url: '/api/docs/stockRightStat',
    type: 'get',
    params: {
      personId
    }
  })
}
