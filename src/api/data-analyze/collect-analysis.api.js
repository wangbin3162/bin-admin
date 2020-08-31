
import request from '../request'
import store from '@/store'
import BinUtil from 'bin-ui/src/utils/util'

function isDomain() {
  return store.state.user.info.departKind === 'DOMAIN'
}

function isAdmin() {
  return store.state.user.info.roleCodes === 'ROLE_ADMIN'
}

function getDepartId() {
  return store.state.user.info.departId
}

// gatherDept: isAdmin() ? null : getDepartId(),

/**
 * @author haodongdong
 * @description 首行数据
 * @returns {Promise}
 */
export async function firstLineStatis () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/firstLineStatis',
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
 * @description 中间数据
 * @param {Object} query 查询参数
 * @param {string} query.startDate
 * @param {string} query.endDate
 * @param {number} query.pageSize
 * @param {number} query.pageNo
 * @param {string} query.personClass
 * @returns {Promise}
 */
export async function centerStatis (query) {
  //  主要用于给结束的日期字符串多加一天，后端要求centerStatis传参的结束日期要多加一天。
  const endDate = new Date(query.endDate)
  endDate.setDate(endDate.getDate() + 1)
  const endDateStr = BinUtil.parseTime(endDate, '{y}-{m}-{d}')

  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/centerStatis',
        method: 'get',
        params: {
          startDate: query.startDate,
          endDate: endDateStr,
          pageSize: query.pageSize,
          pageNo: query.pageNo,
          personClass: query.personClass,
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
 * @description 信息归集日历
 * @param {Object} query 查询参数
 * @param {string} query.startDate
 * @param {number} query.pageSize
 * @returns {Promise}
 */
export async function xxgjNew (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/xxgjNew',
        method: 'get',
        params: {
          startDate: query.startDate,
          pageSize: query.pageSize,
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
 * @description 底部折线图数据
 * @param {Object} query 查询参数
 * @param {string} query.startDate
 * @param {number} query.endDate
 * @returns {Promise}
 */
export async function resMergeTrend (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/resMergeTrend',
        method: 'get',
        params: {
          startDate: query.startDate,
          endDate: query.endDate,
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
