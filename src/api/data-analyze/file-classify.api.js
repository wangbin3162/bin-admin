// 档案分类接口
import request, { requestPost } from '../request'
import { getClassifyTree } from '../data-manage/classify.api'

// 获取信用档案树
export function getTreeList() {
  return getClassifyTree('D')
}

/* 获取档案分类列表 */
export function getDocsConfigList(query) {
  return request({
    url: '/api/docs/config/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      classifyId: query.classifyId,
      resourceName: query.resourceName
    }
  })
}

/* 新增档案分类 */
export function createDocs(doc) {
  return request({
    url: '/api/docs/config/create',
    method: 'post',
    data: {
      classifyId: doc.classifyId,
      resourceKey: doc.resourceKey,
      resourceName: doc.resourceName,
      tableName: doc.tableName,
      fieldNames: doc.fieldNames,
      fieldTitles: doc.fieldTitles,
      resProperty: doc.resProperty,
      sortNum: doc.sortNum
    }
  })
}

/* 新增档案分类 */
export function modifyDocs(doc) {
  return request({
    url: '/api/docs/config/modify',
    method: 'post',
    data: {
      id: doc.id,
      classifyId: doc.classifyId,
      resourceKey: doc.resourceKey,
      resourceName: doc.resourceName,
      tableName: doc.tableName,
      fieldNames: doc.fieldNames,
      fieldTitles: doc.fieldTitles,
      resProperty: doc.resProperty,
      sortNum: doc.sortNum
    }
  })
}

/* 删除档案分类 */
export function removeDocs(id) {
  return request({
    url: '/api/docs/config/remove',
    method: 'post',
    params: { id }
  })
}
