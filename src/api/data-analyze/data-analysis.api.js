// 数据源管理
import request from '../request'
import store from '../../store'

function isDomain () {
  return store.state.user.info.departKind === 'DOMAIN'
}
function isAdmin () {
  return store.state.user.info.roleCodes === 'ROLE_ADMIN'
}

/**
 * @author haodongdong
 * @description 获取资源列表
 * @returns Promise
 */
export async function getResources() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/dir/getResources',
        method: 'get'
      })
      if (res.data.successful) {
        resolve(res.data.data)
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}

/* 2.4.1 资源信息数量 */
export function getTotalResource(query) {
  return request({
    url: '/da/data/gather/zyxxsl',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.2 数据归集总量 */
export function getTotalCount(query) {
  return request({
    url: '/da/data/gather/sjgjzl',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.3 本月归集数据量 */
export function getCurMonthCount(query) {
  return request({
    url: '/da/data/gather/bygjsjl',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.4 上月归集数据量 */
export function getPreMonthCount(query) {
  return request({
    url: '/da/data/gather/sygjsjl',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.5 数据完整率 */
export function getCompleteRate(query) {
  return request({
    url: '/da/data/gather/sjwzl',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.6 本月信息归集统计 */
export function getCurCompleteRate(query) {
  return request({
    url: '/da/data/gather/byxxgjtj',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      isDomain: isDomain()
    }
  })
}

/* 2.4.7 月度信息归集趋势 */
export function getMonthData(query) {
  return request({
    url: '/da/data/gather/ydxxgjqs',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      startDate: query.startDate,
      endDate: query.endDate,
      isDomain: isDomain()
    }
  })
}

/**
 * @author haodongdong
 * @description 获取年度归集趋势
 * @param {*} query
 */
export function getYearData(query) {
  return request({
    url: '/da/data/gather/ndxxgjqszy',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      startDate: query.startDate,
      endDate: query.endDate,
      resourceKey: query.resourceKey,
      isDomain: isDomain()
    }
  })
}

/* 2.4.10 信息归集历史 */
export function getDataHistory(query) {
  return request({
    url: '/da/data/gather/xxgjls',
    method: 'get',
    params: {
      gatherDept: isAdmin() ? null : query.departId,
      month: query.month,
      isDomain: isDomain()
    }
  })
}
