import request from './request'

/* 首页查询联合奖惩相关数量 */
export function getUrpCounts() {
  let memoCount = request.get('/api/urpAnalysis/memoCount')
  let jlCount = request.get('/api/urpAnalysis/jlCount')
  let cfCount = request.get('/api/urpAnalysis/cfCount')
  let departCount = request.get('/api/urpAnalysis/departCount')
  let measureCount = request.get('/api/urpAnalysis/measureCount')
  let requests = [memoCount, jlCount, cfCount, departCount, measureCount]
  return new Promise((resolve, reject) => {
    Promise.all(requests).then(res => {
      resolve({
        count1: res[0].data.code === '0' ? res[0].data.data : '',
        count2: res[1].data.code === '0' ? res[1].data.data : '',
        count3: res[2].data.code === '0' ? res[2].data.data : '',
        count4: res[3].data.code === '0' ? res[3].data.data : '',
        count5: res[4].data.code === '0' ? res[4].data.data : ''
      })
    }).catch(error => reject(new Error(error.message || '条数统计获取失败')))
  })
}
