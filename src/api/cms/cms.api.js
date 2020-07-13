/**
 * @author haodongdong
 * @description 新闻管理相关api接口
 * @module
 */
import request from '../request'

/**
 * @typedef {Object} Section 栏目对象
 * @property {string} id
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
        params: { sort: 'colSort,asc' }
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
 * @description 根据父节点id查询所属栏目所有子节点
 * @param {string} parentColId 父节点id
 * @returns {Promise<Section>}
 */
export async function getSectionChildren(parentColId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/children',
        method: 'get',
        params: {
          parentColId,
          sort: 'colSort,asc'
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
 * @description 添加栏目
 * @param {Section} section 栏目对象
 * @returns {Promise<void>}
 */
export async function createSection(section) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/add',
        method: 'post',
        data: section
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
 * @description 修改栏目
 * @param {Section} section 栏目对象
 * @returns {Promise<void>}
 */
export async function updateSection(section) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/modify',
        method: 'post',
        data: section
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
 * @description 删除栏目
 * @param {string} columnId 栏目id
 * @returns {Promise<void>}
 */
export async function removeSection(columnId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/remove',
        method: 'post',
        params: { columnId }
      })
      if (res.data.successful) {
       resolve()
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
 * @description 删除栏目缩略图
 * @param {string} columnId 栏目id
 * @returns {Promise<void>}
 */
export async function removeSectionImg(columnId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/column/thumbnail/remove',
        method: 'post',
        params: { columnId }
      })
      if (res.data.successful) {
       resolve()
      } else {
        reject(new Error(res.data.message))
      }
    } catch (error) {
      reject(error)
    }
  })
}
