// 挖掘配置
import request from './request'

/* 首页查询所有资源信息列表内容 */
export function getResList(keyword) {
  return request({
    url: '/api/wj/rendering/search',
    method: 'get',
    params: {
      keyword
    }
  })
}

/* 展示界面的初始化数据接口-用于获取所有图表信息和条件配置的集合 */
export function getRenderingConfig(resourceKey, type = '') {
  return request({
    url: '/api/wj/rendering/config',
    method: 'get',
    params: {
      resourceKey,
      type
    }
  })
}

/* 获取所有字典项列表 */
export function getDictItems(code) {
  return request({
    url: '/api/dict/queryItems',
    method: 'get',
    params: {
      groupCode: code
    }
  })
}

/* 获取具体某个图表数据的接口 */
export function renderingChart(chartId, condition) {
  return request({
    url: '/api/wj/rendering/data',
    method: 'post',
    data: {
      chartId,
      condition
    }
  })
}

/* 归集分析-信息归集趋势分析接口 */
export function getGatherData(resourceKey, type = 'Y', year) {
  return request({
    url: '/api/wj/ext/gather/data',
    method: 'get',
    params: {
      resourceKey,
      type,
      year
    }
  })
}

/* 归集分析-部门采集数据排行分析 */
export function getGatherDeptData(resourceKey, year) {
  return request({
    url: '/api/wj/ext/gather/dept/top',
    method: 'get',
    params: {
      resourceKey,
      year
    }
  })
}

/* 归集分析-部门采集数据趋势分析 */
export function getGatherDeptTrend(resourceKey, year, createDept) {
  return request({
    url: '/api/wj/ext/gather/dept/trend',
    method: 'get',
    params: {
      resourceKey,
      year,
      createDept
    }
  })
}

/* 主体分析-男女年龄区间和性别比例分析 */
export function getGenderRatio(resourceKey) {
  return request({
    url: '/api/wj/ext/nat/genderRatio',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 主体分析-企业注册资本分析 */
export function getLegZczb(resourceKey) {
  return request({
    url: '/api/wj/ext/leg/zczb',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 主体分析-企业成立日期分析 */
export function getLegClrq(resourceKey) {
  return request({
    url: '/api/wj/ext/leg/clrq',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 主体分析-企业行业种类分析 */
export function getLegHydm(resourceKey) {
  return request({
    url: '/api/wj/ext/leg/hydm',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 主体分析-企业行业种类趋势分析 */
export function getLegHydmTrend(resourceKey, year, code) {
  return request({
    url: '/api/wj/ext/leg/hydm/trend',
    method: 'get',
    params: {
      resourceKey,
      year,
      code
    }
  })
}
