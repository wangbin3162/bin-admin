// 我的采集
import request, { appendFormData, requestPostFormData } from '../request'

/* 获取我的采集资源列表（无分页） */
export function getMyGather(query) {
  return request({
    url: 'api/analysis/dir/gather/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceName: query.resourceName
    }
  })
}

/* 获取资源信息列表 */
export function getResourceInfo(resourceKey) {
  return request({
    url: '/api/dir/gather/getResourceInfo',
    method: 'get',
    params: {
      resourceKey
    }
  })
}

/* 查询采集信息 */
export function getGatherList(query, keyValues, ops) {
  let data = {
    resourceKey: query.resourceKey,
    searchPage: {
      size: query.size,
      page: query.page - 1,
      sorts: [
        { property: 'create_date', direction: 'desc' }
      ]
    }
  }
  if (keyValues) {
    data.keyValues = keyValues
  }
  if (ops) {
    data.ops = ops
  }
  return request({
    url: '/api/dir/gather/search',
    method: 'post',
    data: data
  })
}

/* 根据ID查询采集信息 */
export function queryOne(id, resourceKey) {
  return request({
    url: '/api/dir/gather/queryOne',
    method: 'post',
    data: {
      resourceKey,
      keyValues: {
        id
      }
    }
  })
}

/* 根据ID查询采集信息 */
export function show(id, resourceKey) {
  return request({
    url: '/api/dir/gather/show',
    method: 'post',
    data: {
      resourceKey,
      keyValues: {
        id
      }
    }
  })
}

/* 新增一个采集信息 */
export function createGather(resourceKey, keyValues) {
  return request({
    url: '/api/dir/gather/create',
    method: 'post',
    data: {
      resourceKey,
      keyValues
    }
  })
}

/* 修改采集信息 */
export function modifyGather(resourceKey, keyValues) {
  // 修改时不能更换父级和类目编码
  return request({
    url: '/api/dir/gather/modify',
    method: 'post',
    data: {
      resourceKey,
      keyValues
    }
  })
}

/* 删除一个采集信息 */
export function removeGather(resourceKey, id) {
  return request({
    url: '/api/dir/gather/remove',
    method: 'post',
    data: {
      resourceKey,
      keyValues: {
        id
      }
    }
  })
}

/* 获取历史列表 */
export function getHistory(query) {
  return request({
    url: `/api/dir/gather/history/${query.recordId}`,
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1
    }
  })
}

/* 获取所有字典项列表 */
export function getDictItems(code) {
  return request({
    url: '/api/dict/queryItems',
    method: 'get',
    params: {
      groupCode: code
    }
  })
}

/* 分页查询法人人或其他组织信息 */
export function getLegList(query) {
  return request({
    url: '/api/dir/gather/queryByPagingWithLegBaseInfo',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      compName: query.compName
    }
  })
}

/* 分页查询自然人或其他组织信息 */
export function getNatList(query) {
  return request({
    url: '/api/dir/gather/queryByPagingWithNatBaseInfo',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      name: query.name
    }
  })
}

/* 下载模板 */
export function downloadTemplate(resourceKey) {
  return request({
    url: '/api/dir/gather/download/template',
    type: 'get',
    responseType: 'blob',
    params: { resourceKey }
  })
}

/* 导出 */
export function dataExport(resourceKey) {
  return request({
    url: '/management/exportJob/start',
    method: 'post',
    params: { resourceKey }
  })
}

/* 导入 */
export function dataImport(resourceKey, uploadFile) {
  let url = '/management/importJob/start'
  let data = new FormData()
  appendFormData(data, 'resourceKey', resourceKey)
  appendFormData(data, 'uploadFile', uploadFile)
  return requestPostFormData(url, data)
}

/* 查看批量导入记录 */
export function queryImportRecords(query, resourceKey) {
  let { size, page, jobType, beginTime, endTime, status } = query
  return request({
    url: '/management/importJob/queryImportRecords',
    method: 'get',
    params: {
      resourceKey, size, page: page - 1, jobType, beginTime, endTime, status
    }
  })
}

/* 查看批量导出记录 */
export function queryExportRecords(query, resourceKey) {
  let { size, page, jobType, beginTime, endTime, status } = query
  return request({
    url: '/management/exportJob/queryExportRecords',
    method: 'get',
    params: {
      resourceKey, size, page: page - 1, jobType, beginTime, endTime, status
    }
  })
}

/* 查看导入详情 */
export function queryImportDetails(comDataId) {
  return request({
    url: '/management/importJob/queryImportDetails',
    method: 'get',
    params: {
      comDataId
    }
  })
}

/* 查看错误报告 */
export function queryErrorExcelInfo(comDataId) {
  return request({
    url: '/management/importJob/queryErrorExcelInfo',
    method: 'get',
    params: {
      comDataId
    }
  })
}

/* 下载导出文件 */
export function downloadExport(id) {
  return request({
    url: '/management/exportJob/downloadExportFile',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}

/* 下载导入文件 */
export function downloadImport(id, downloadType) {
  return request({
    url: '/management/importJob/downloadExport',
    method: 'get',
    responseType: 'blob',
    params: { id, downloadType }
  })
}
