// 类目管理
import request from '../request'
import store from '../../store'

function isDomain() {
  return store.state.user.info.departKind === 'DOMAIN'
}

function isAdmin() {
  return store.state.user.info.roleCodes === 'ROLE_ADMIN'
}

function getDepartId() {
  return store.state.user.info.departId
}

// 2.5.1 获取资源信息数量
export async function getZyxxsl() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/zyxxsl',
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
// 2.5.2 获取数据归集总量
export function getSjgjzl() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/sjgjzl',
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
// 2.5 3 获取本月归集数据量
export function getBygjsjl() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/bygjsjl',
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
// 2.5.4 获取自然人数据总量
export function getZrpcount() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/zrpcount',
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
// 2.5.5 获取法人或其他组织数据总量
export function getFocount() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/focount',
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
// 2.5.6 月度信息归集趋势图
export function getYearCollectData (year = new Date().getFullYear()) {
  return request({
    url: '/da/data/collect/ydxxgjqs',
    method: 'get',
    params: {
      year
    }
  })
}
// 2.5.7 本月数据分析
export function getMonthCollectData (month) {
  return request({
    url: '/da/data/collect/bysjfx',
    method: 'get',
    params: {
      month
    }
  })
}
// 2.5.8 按部门数据归集统计
export function getDeptCollectData () {
  return request({
    url: '/da/data/collect/bmsjfx',
    method: 'get'
  })
}
// 2.5.9 资源信息分类统计
export function getResourceData () {
  return request({
    url: '/da/data/collect/zyxxfltj',
    method: 'get'
  })
}
// 2.5.10 月度部门归集统计
export function getMonthDeptCollectData (month) {
  return request({
    url: '/da/data/collect/ydbmgjtj',
    method: 'get',
    params: {
      month
    }
  })
}
// 2.5.12 主体及资源数据分析
export function getSubjectData () {
  return request({
    url: '/da/data/collect/ztzysjfx',
    method: 'get'
  })
}

/**
 * @author haodongdong
 * @description 获取部门数据归集统计分析
 * @returns Promise
 */
export async function getBmsjgjfx(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/bmsjgjfx',
        method: 'get',
        params: {
          startDate: query.startDate,
          endDate: query.endDate,
          pageSize: query.pageSize
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
 * @description 获取信息归集记录
 * @returns Promise
 */
export async function getXxgjjl (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/xxgjjl',
        method: 'get',
        params: {
          startDate: query.startDate,
          pageSize: query.pageSize
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
 * @description 获取最新提报部门
 * @returns Promise
 */
export async function getZxtbbm(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/zxtbbm',
        method: 'get',
        params: {
          startDate: query.startDate,
          endDate: query.endDate,
          pageSize: query.pageSize,
          pageNo: query.pageNo - 1
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
 * @description 资源信息分类统计
 * @returns Promise
 */
export async function getZyxxfltjsj(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/zyxxfltjsj',
        method: 'get',
        params: {
          gatherDept: isAdmin() ? null : getDepartId(),
          isDomain: isDomain(),
          startDate: query.startDate,
          endDate: query.endDate,
          personClass: query.personClass
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
 * @description 自然人资源信息归集趋势
 * @returns Promise
 */
export async function getZrpxxgjqs(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/zrpxxgjqs',
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
 * @description 法人资源信息归集趋势
 * @returns Promise
 */
export async function getFrzzxxgjqs(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/collect/frzzxxgjqs',
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
 * @description 获取所有所有部门信息
 * @returns Promise
 */
export async function getCompTransfer() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/da/data/api/compTransfer',
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
