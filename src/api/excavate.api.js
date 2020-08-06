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
