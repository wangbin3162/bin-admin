import request, { appendFormData, requestPostFormData } from './request'

const moduleNameEnum = {
  USER: 'SysUserController',
  DEPART: 'SysDepartController'
}

/**
 * 通用批量导入方法
 * @param file
 * @param moduleName  [ SysUserController,SysDepartController ]
 * @param id 对应用户和部门[departId,parentId]
 * @returns { AxiosPromise }
 */
export function commDataImport(file, moduleName, id) {
  let url = '/management/comm/commDataImport'
  let data = new FormData()
  appendFormData(data, 'uploadFile', file)
  appendFormData(data, 'moduleName', moduleName)
  if (moduleName === moduleNameEnum.USER) {
    appendFormData(data, 'departId', id)
  } else if (moduleName === moduleNameEnum.DEPART) {
    appendFormData(data, 'parentId', id)
  }
  return requestPostFormData(url, data)
}

/**
 * 通用导出事件
 * @param moduleName  [ SysUserController,SysDepartController ]
 * @param id 对应用户和部门[departId,parentId]
 * @returns {AxiosPromise}
 */
export function commDataExport(moduleName, id) {
  let data = { moduleName }
  if (moduleName === moduleNameEnum.USER) {
    data.departId = id
  } else if (moduleName === moduleNameEnum.DEPART) {
    data.parentId = id
  }
  return request({
    url: '/management/comm/commDataExport',
    method: 'post',
    params: data
  })
}

/**
 * 查看批量导入记录
 * @returns { AxiosPromise }
 * @param query
 */
export function queryImportRecords(query) {
  let { size, page, jobType, beginTime, endTime, status } = query
  return request({
    url: '/management/comm/queryImportRecords',
    method: 'get',
    params: {
      size, page: page - 1, jobType, beginTime, endTime, status
    }
  })
}

/**
 * 查看批量导出记录
 * @returns { AxiosPromise }
 * @param query
 */
export function queryExportRecords(query) {
  let { size, page, jobType, beginTime, endTime, status } = query
  return request({
    url: '/management/comm/queryExportRecords',
    method: 'post',
    params: {
      size, page: page - 1, jobType, beginTime, endTime, status
    }
  })
}

/**
 * 查看导入详情
 * @param id
 * @returns {AxiosPromise}
 */
export function queryImportDetails(id) {
  return request({
    url: '/management/comm/queryImportDetails',
    method: 'get',
    params: {
      comDataId: id
    }
  })
}

/**
 * 查看错误报告
 * @param id
 * @returns {AxiosPromise}
 */
export function queryErrorExcelInfo(id) {
  return request({
    url: '/management/comm/queryErrorExcelInfo',
    method: 'get',
    params: {
      comDataId: id
    }
  })
}

/**
 * 下周导出文件
 * @param id
 * @returns {AxiosPromise}
 */
export function downloadExport(id) {
  return request({
    url: '/management/comm/downloadExport',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}

/**
 * @author haodongdong
 * @description 通用？文件上传接口，目前用于信用报告配置新增图片上传
 * @param {*} moduleName
 * @param {*} file
 * @returns Promise
 */
export function fileUpload(moduleName, file) {
  return new Promise(async (resolve, reject) => {
    const url = '/api/comm/file/upload'

    let data = new FormData()

    appendFormData(data, 'uploadFile', file)
    appendFormData(data, 'funName', moduleName)

    try {
      const res = await requestPostFormData(url, data)
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
 * @description 通用？文件下载接口，目前用于信用报告配置图片回显
 * @param {*} moduleName
 * @param {*} file
 * @returns Promise
 */
export function fileDownLoad(funName, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: '/api/comm/file/download',
        responseType: 'blob',
        method: 'get',
        params: {
          id,
          funName
        }
      })
      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}
