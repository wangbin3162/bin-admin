/**
 * @author haodongdong
 * @description 新闻管理相关api接口
 * @module
 */
import request from '../request'

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
 * @typedef {Object} ContentThumbnail 内容缩略图对象
 * @property {string} id 新闻id
 * @property {string} thumbnailPath 缩略图id
 * @property {number} thumbnailHeight 高度
 * @property {number} thumbnailWidth 宽度
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
 * @description 新增内容(新闻)
 * @param {Content} content
 * @returns {Promise<string>} 返回添加成功后的内容id
 */
export async function createContent(content) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/add',
        method: 'post',
        data: content
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
 * @description 更新内容(新闻)
 * @param {Content} content
 * @returns {Promise<void>}
 */
export async function updateContent(content) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/modify',
        method: 'post',
        data: content
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
 * @description 删除内容(新闻)
 * @param {string} id 内容(新闻)id
 * @returns {Promise<void>}
 */
export async function removeContent(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/remove',
        method: 'post',
        data: { id }
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
 * @description 更新内容(新闻)缩略图
 * @param {ContentThumbnail} contentThumbnail 内容(新闻)缩略图对象
 * @returns {Promise<void>}
 */
export async function updateContentThumbnail(contentThumbnail) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/thumbnail/update',
        method: 'post',
        data: contentThumbnail
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
 * @description 删除内容(新闻)缩略图
 * @param {string} id 内容(新闻)id
 * @returns {Promise<void>}
 */
export async function removeContentThumbnail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/thumbnail/remove',
        method: 'post',
        data: { id }
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
 * @description 更新内容(新闻)置顶
 * @param {string} id 内容(新闻)id
 * @param {boolean} isTop 是否置顶
 * @returns {Promise<void>}
 */
export async function setTop(id, isTop) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/top',
        method: 'post',
        data: { id, isTop }
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
 * @description 更新内容(新闻)状态
 * @param {string} id 内容(新闻)id
 * @param {string} contentStatus 内容(新闻)状态
 * @returns {Promise<void>}
 */
export async function setStatus(id, contentStatus) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/content/status',
        method: 'post',
        data: { id, contentStatus }
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
 * @description 富文本编辑器内文件上传接口
 * @param {string} contentId
 * @param {File} file
 * @returns {Promise<void>}
 */
export function UploadPicture(contentId, file) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = new FormData()
      data.append('contentId', contentId)
      data.append('attachment', file)

      const res = await request({
        url: 'api/cms/attach/uploadPicture',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data
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
 * @description 批量上传新闻下方附件
 * @param {string} contentId
 * @param {File[]} files 文件数组
 * @returns {Promise<void>}
 */
export function UploadAttachments(contentId, files) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = new FormData()
      data.append('contentId', contentId)
      files.forEach(file => {
        data.append('attachment', file, file.name)
      })

      const res = await request({
        url: 'api/cms/attach/uploadAttachments',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data
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
 * @description 获取新闻下方附件列表
 * @param {string} contentId
 * @returns {Promise<any>}
 */
export function getAttachments(contentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/attach/list',
        method: 'get',
        params: { contentId }
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
 * @description 获取新闻下方附件列表
 * @param {string} attachmentId 附件id
 * @returns {Promise<any>}
 */
export function removeAttachment(attachmentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: 'api/cms/attach/remove',
        method: 'post',
        params: { attachmentId }
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
