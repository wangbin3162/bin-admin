import cookies from './util.cookies'
import log from './log'

const util = {
  cookies,
  log
}

util.timeFix = function () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}
util.cloneDeep = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}
util.downloadFile = function (content, fileName) {
  // filename，摘取了常用的部分，其实还有其他一些
  //    'exe'        => 'application/octet-stream',
  //    'pdf'        => 'application/pdf',
  //    'xls'        => 'application/vnd.ms-excel',
  //    'ppt'        => 'application/vnd.ms-powerpoint',
  //    'js'         => 'application/x-javascript',
  //    'zip'        => 'application/zip',
  //    'mp3'        => 'audio/mpeg',
  //    'bmp'        => 'image/bmp',
  //    'gif'        => 'image/gif',
  //    'jpeg'       => 'image/jpeg',
  //    'jpg'        => 'image/jpeg',
  //    'png'        => 'image/png',
  //    'css'        => 'text/css',
  //    'html'       => 'text/html',
  //    'htm'        => 'text/html',
  //    'txt'        => 'text/plain',
  //    'xsl'        => 'text/xml',
  //    'xml'        => 'text/xml',
  let data = new Blob([content], { type: 'application/vnd.ms-excel' })
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(data, fileName)
  } else {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

export default util

/**
 * @author haodongdong
 * @description 前端通用的数组分页函数，返回分页后的对应页数的数组
 * @param {any[]} arr 需要分页的数组
 * @param {number} pageSize 分页大小
 * @param {number} page 当前页数
 * @returns
 */
export function arrPgination (arr, pageSize, page) {
  // 总条数
  const total = arr.length
  // 总页数 = 总条数 / 每页大小，有余数则 + 1
  const isDivide = total % pageSize === 0
  let totalPages = Math.floor((total / pageSize))
  if (!isDivide) totalPages += 1
  // 控制page极限值
  if (page <= 0) page = 1
  if (page >= totalPages) page = totalPages
  // 获取当前页数对应的起始index
  const index = page * pageSize - pageSize
  console.log(index)
  // 截取对应数组
  const arrCache = arr.slice(index, index + pageSize)
  return {
    total,
    totalPages,
    page,
    arr: arrCache
  }
}
