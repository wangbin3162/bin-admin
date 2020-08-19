/**
 * @author haodongdong
 * @description 我的监管相关接口
 */
import request from '../request'
import Qs from 'qs'

/**
  * @typedef {Object} Supervision 监管信息对象
  * @property {string} id 列表id
  * @property {string} jgStatus 是否监管，0 未监管 1 监管
  * @property {string} jgType 监管类型
  * @property {string} jgName 监管类型名称
  * @property {string} jgDesc 监管描述
  * @property {string} createUser 创建用户
  * @property {string} createDept 创建部门
  * @property {string} createDate 监管日期
  * @property {string} objectId 监管的主体id
  * @property {string} objectName 监管的主体名称
  */

/**
 * @author haodongdong
 * @description 获取类别树
 * @param {string} typeCode 类别编码，传递hydm获取行业代码树
 * @returns {Promise<any>}
 */
export async function getConTypeTree (typeCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/confType/tree',
        method: 'get',
        params: { typeCode }
      })
      if (res.data.successful) {
        resolve(res.data.data)
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 根据行业代码获取子类别列表
 * @param {Object} query 查询参数
 * @param {string} query.typeName 类别名称
 * @param {string} query.typeCode 类别编码
 * @param {number} query.size 分页大小
 * @param {string} query.page 当前页
 * @returns {Promise<any>}
 */
export async function getConTypeList (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/confType/search',
        method: 'get',
        params: {
          parentId: query.parentId,
          typeName: query.typeName,
          typeCode: query.typeCode,
          size: query.size,
          page: query.page - 1
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 我的监管下，市场主体、重点人群、重点领域三个内容的通用列表接口。
 * @param {Object} query 查询参数
 * @param {string} query.jgType 监管类型，MS 市场主体 KP 重点人群 IA 重点领域
 * @param {number} query.size 分页大小
 * @param {string} query.page 当前页
 * @returns {Promise<any>}
 */
export async function jgUserConfigSearch (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgUserConfig/search',
        method: 'get',
        params: {
          jgType: query.jgType,
          size: query.size,
          page: query.page - 1
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 我的监管下，市场主体、重点人群监管，新增时显示的列表
 * @param {Object} query 查询参数
 * @param {string} query.resourceKey 资源key，市场主体：DIR-20191014-173239-707 重点人群：DIR-20191014-173845-746
 * @param {number} query.keyValues 需要查询的关键字对象 eg. { name: '张' }
 * @param {number} query.opt 需要查询的关键字的设置对象  eg. { name: 'LIKE' }
 * @param {number} query.size 分页大小
 * @param {string} query.page 当前页
 * @returns {Promise<any>}
 */
export async function getCompAndPerson (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgUserConfig/addCompAndPerson',
        method: 'post',
        data: {
          resourceKey: query.resourceKey,
          keyValues: query.keyValues,
          ops: query.ops,
          searchPage: {
            size: query.size,
            page: query.page - 1,
            sorts: [{
              property: 'create_date',
              direction: 'desc'
            }]
          }
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author haodongdong
 * @description 添加监管
 * @param {Object} param 查询参数
 * @param {number} param.jgType 监管类型
 * @param {number} [param.jgDesc] 监管描述
 * @param {number} param.objectId 监管主体id
 * @param {string} param.objectName 监管主题名称
 * @returns {Promise<any>}
 */
export async function addSupervision (param) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgUserConfig/create',
        method: 'post',
        data: param
      })
      if (res.data.successful) {
        resolve()
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
 * @description 取消监管接口
 * @param {string} id 监管记录的id
 * @returns {Promise<any>}
 */
export async function cancelSupervision (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/credit/jgUserConfig/remove',
        method: 'post',
        params: {
          id
        }
      })
      if (res.data.successful) {
        resolve()
      } else {
        reject(res.data.message)
      }
    } catch (error) {
      reject(error)
    }
  })
}
