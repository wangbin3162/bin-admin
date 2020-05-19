// 附件上传接口
import request, { appendFormData, requestPostFormData } from '../request'

/* 资源信息附件上传接口 */
export function attachmentUpload(resourceKey, uploadFile) {
  let url = '/api/dir/attachment/upload'
  let data = new FormData()
  appendFormData(data, 'resourceKey', resourceKey)
  appendFormData(data, 'uploadFile', uploadFile)
  return requestPostFormData(url, data)
}

/* 资源信息附件明细列表接口 */
export function getAttachmentList(ids) {
  return request({
    url: '/api/dir/attachment/list',
    method: 'get',
    params: {
      ids
    }
  })
}

/* 资源信息附件下载接口 */
export function downloadAttachment(id) {
  return request({
    url: '/api/dir/attachment/download',
    method: 'get',
    responseType: 'blob',
    params: { id }
  })
}
