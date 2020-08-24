// 数据源管理
import request from '../request'
import store from '../../store'

function isDomain () {
  return store.state.user.info.departKind === 'DOMAIN'
}
function isAdmin () {
  return store.state.user.info.roleCodes === 'ROLE_ADMIN'
}

function getDepartId() {
  return store.state.user.info.departId
}

/**
 * @author haodongdong
 * @description 获取所有资源信息的resourceKey、resourceName
 * @returns Promise
 */
export async function getDirectoryTransfer() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/api/directoryTransfer',
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

/**
 * @author haodongdong
 * @description 首行数据
 * @returns {Promise}
 */
export async function firstLineStatis () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/gather/firstLineStatis',
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

/**
 * @author haodongdong
 * @description 本月信息归集统计
 * @returns {Promise}
 */
export async function byxxgjNew () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/gather/byxxgjNew',
        method: 'get',
        params: {
          gatherDept: isAdmin() ? null : getDepartId(),
          isDomain: isDomain()
        }
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

/**
 * @author haodongdong
 * @description 月度信息归集趋势
 * @param {Object} query 查询参数
 * @param {string} query.startDate 开始时间
 * @param {string} query.endDate 结束时间
 * @returns {Promise}
 */
export async function ydxxgjNew (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/gather/ydxxgjNew',
        method: 'get',
        params: {
          gatherDept: isAdmin() ? null : getDepartId(),
          isDomain: isDomain(),
          startDate: query.startDate,
          endDate: query.endDate
        }
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

/**
 * @author haodongdong
 * @description 年度信息归集趋势
 * @param {Object} query 查询参数
 * @param {string} query.startDate 开始时间
 * @param {string} query.endDate 结束时间
 * @param {string} [query.resourceKey] 资源key
 * @returns {Promise}
 */
export async function ndxxgjNew (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/gather/ndxxgjNew',
        method: 'get',
        params: {
          gatherDept: isAdmin() ? null : query.departId,
          isDomain: isDomain(),
          resourceKey: query.resourceKey,
          startDate: query.startDate,
          endDate: query.endDate
        }
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

/**
 * @author haodongdong
 * @description 信息归集记录
 * @param {Object} query 查询参数
 * @param {string} query.startDate 开始时间
 * @param {number} query.pageSize 查询数量
 * @returns {Promise}
 */
export async function xxgjNew (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/gather/xxgjNew',
        method: 'get',
        params: {
          pageSize: query.pageSize,
          startDate: query.startDate
        }
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
