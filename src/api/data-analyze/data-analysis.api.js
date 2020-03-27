// 数据源管理
import request from '../request'

/* 2.4.1 资源信息数量 */
export function getTotalResource(query) {
  return request({
    url: '/da/data/gather/zyxxsl',
    method: 'get',
    params: {
      createDept: query.departId
    }
  })
}

/* 2.4.2 数据归集总量 */
export function getTotalCount(query) {
  return request({
    url: '/da/data/gather/sjgjzl',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 2.4.3 本月归集数据量 */
export function getCurMonthCount(query) {
  return request({
    url: '/da/data/gather/bygjsjl',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 2.4.4 上月归集数据量 */
export function getPreMonthCount(query) {
  return request({
    url: '/da/data/gather/sygjsjl',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 2.4.5 数据完整率 */
export function getCompleteRate(query) {
  return request({
    url: '/da/data/gather/sjwzl',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 2.4.6 本月信息归集统计 */
export function getCurCompleteRate(query) {
  return request({
    url: '/da/data/gather/byxxgjtj',
    method: 'get',
    params: {
      departId: query.departId
    }
  })
}

/* 2.4.7 月度信息归集趋势 */
export function getMonthData(query) {
  return request({
    url: '/da/data/gather/ydxxgjqs',
    method: 'get',
    params: {
      createDept: query.departId,
      startDate: '2019-01',
      endDate: '2020-01'
    }
  })
}

/* 2.4.10 信息归集历史 */
export function getDataHistory(query) {
  return request({
    url: '/da/data/gather/xxgjls',
    method: 'get',
    params: {
      departId: query.departId,
      month: query.month
    }
  })
}
