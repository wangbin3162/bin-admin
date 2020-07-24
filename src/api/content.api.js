// 内容(新闻)相关api接口
import request from './request'
import Qs from 'qs'

/**
 * @typedef {Object} Section 栏目对象
 * @property {string} [id]
 * @property {string} parentCol 父节点id
 * @property {string} parentColName 父节点名称
 * @property {string} colName 栏目名称
 * @property {string} colUrl 栏目url
 * @property {string} colType 栏目类型
 * @property {string} colSort 栏目排序码
 * @property {string} colDesc 栏目描述
 * @property {string} keywords 关键字
 * @property {string} createBy 创建人
 * @property {string} createDept 创建部门
 * @property {string} createDeptName 创建部门名称
 * @property {string} columnCode 栏目编码
 * @property {string} [thumbnailPath] 缩略图路径id
 * @property {string} [thumbnailHeight] 缩略图高度
 * @property {string} [thumbnailWidth] 缩略图宽度
 * @property {string} [title] b-tree组件使用的树节点名称
 * @property {boolean} [expand] b-tree组件使用，是否展开子节点
 * @property {boolean} [loading] b-tree组件使用，异步加载子节点时是否显示加载效果
 * @property {Section[]} [children] b-tree组件使用的子节点
 */

 /**
 * @typedef {Object} Content 内容对象
 * @property {string} [id] 内容id
 * @property {string} colId 栏目id
 * @property {string} title 标题
 * @property {string} summary 摘要
 * @property {string} [linkUrl] 链接地址
 * @property {string} contentType 文章类型
 * @property {boolean} isTop 是否置顶
 * @property {number} orderNo 排序码
 * @property {string} keywords 关键字
 * @property {string} description 描述
 * @property {string} source 创建机构
 * @property {string} brief 备注
 * @property {string} detail 文章主体部分
 * @property {string} [thumbnailPath] 缩略图路径id
 * @property {string} [thumbnailHeight] 缩略图高度
 * @property {string} [thumbnailWidth] 缩略图宽度
 */

 /**
 * @typedef {Object} Notice 通知对象
 * @property {string} [id] id
 * @property {string} type 通知类型
 * @property {string} title 标题
 * @property {string} content 内容
 * @property {string} files 附件id的字符串数组
 * @property {string} validDate 过期时间
 * @property {string} remark 备注
 * @property {boolean} isTop 是否置顶
 * @property {string} notifyStatus 通知状态
 */

/**
 * @author haodongdong
 * @description 首页栏目列表
 * @returns {Promise<any>}
 */
export async function getTopColumn() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/topColumn',
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
 * @description 查询栏目所有根节点
 * @returns {Promise<Section>}
 */
export async function getSectionRoots() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/roots',
        method: 'get',
        params: {
          sort: [
            'colSort,asc',
            'createDate,desc'
          ]
        },
        paramsSerializer (params) {
          return Qs.stringify(params, { arrayFormat: 'repeat' })
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
 * @description 获取子栏目
 * @param {string} parentColId
 * @returns {Promise<Section>}
 */
export async function getSectionChildren(parentColId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/children',
        method: 'get',
        params: { parentColId }
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
 * @description 获取栏目下的内容列表(新闻列表)
 * @returns {Promise<Content>}
 * @param {Object} query 查询参数
 * @param {string} query.columnId 所属栏目id
 * @param {string} query.title 标题
 * @param {string} query.contentType 内容类型
 * @param {string} query.contentStatus 内容状态
 * @param {string} query.publishDateStart 发布时间范围查询的起始时间
 * @param {string} query.publishDateEnd 发布时间范围查询的结束时间
 * @param {number} query.size 分页尺寸
 * @param {number} query.page 页数
 */
export async function getContentList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/search',
        method: 'get',
        params: {
          columnId: query.columnId,
          title: query.title,
          contentType: query.contentType,
          contentStatus: query.contentStatus,
          publishDateStart: query.publishDateStart,
          publishDateEnd: query.publishDateEnd,
          size: query.size,
          page: query.page - 1,
          sort: [
            'isTop,desc',
            'orderNo,desc',
            'publishDate,desc'
          ]
        },
        paramsSerializer (params) {
          return Qs.stringify(params, { arrayFormat: 'repeat' })
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
 * @description 根据关键字查询文章内容
 * @returns {Promise<Content>}
 * @param {Object} query 查询参数
 * @param {string} query.colId 所属栏目id，不传则查询所有栏目
 * @param {string} query.keyword 关键字
 * @param {string} query.contentStatus 内容状态
 * @param {number} query.size 分页尺寸
 * @param {number} query.page 页数
 */
export async function getContentListByKeyword(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/keyword',
        method: 'get',
        params: {
          colId: query.columnId,
          keyword: query.keyword,
          contentStatus: query.contentStatus,
          size: query.size,
          page: query.page - 1,
          sort: [
            'isTop,desc',
            'orderNo,desc',
            'publishDate,desc'
          ]
        },
        paramsSerializer (params) {
          return Qs.stringify(params, { arrayFormat: 'repeat' })
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
 * @description 获取所有通知
 * @param {Object} query 查询参数
 * @param {string} [query.title] 通知标题
 * @param {number} query.size 分页尺寸
 * @param {number} query.page 当前页数
 * @returns {Promise<Notice>}
 */
export async function getNoticeList(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/search',
        method: 'get',
        params: {
          title: query.title,
          type: query.type,
          notifyStatus: query.notifyStatus,
          size: query.size,
          page: query.page - 1,
          sort: 'isTop,desc'
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
 * @description 获取未读通知数量
 * @returns {Promise<number>}
 */
export async function getUnreadNum () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/userReadModify',
        method: 'post'
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
 * @description 更新用户读取通知时间
 * @returns {Promise}
 */
export async function updateUserReadNotice () {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/cmsNotify/unread',
        method: 'get'
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
