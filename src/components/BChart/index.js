import BChart from './BChart.vue'

/**
 * 转换数据集
 * @param opts 配置项 { xField:'x',  yField:'y' ,seriesField:'可选'} //  分别为x轴映射字段，y轴映射字段，series 可选
 * @param dataSource 元数据
 * 元数据 [{x:'1月',y:'111',s:'系列一'},{x:'1月',y:'222',s:'系列二'},{x:'2月',y:'222',s:'系列一'},{x:'2月',y:'222',s:'系列二'}]
 * 根据此种元数据类型来转换为dataset数据系列
 */
function formatDataSet(opts, dataSource) {
  let { xField, yField, seriesField } = opts
  if (!seriesField) {
    return {
      source: [
        [xField, yField], ...dataSource.map(item => ([item[xField], item[yField]]))
      ]
    }
  } else {
    const dimensions = []
    const map = new Map()
    dataSource.forEach(item => {
      if (item[xField]) {
        dimensions[0] = xField
      }
      if (item[seriesField]) {
        if (!dimensions.includes(item[seriesField])) {
          dimensions.push(item[seriesField])
        }
      }
      if (map.has(item[xField])) {
        map.set(item[xField], [...map.get(item[xField]), item[yField]])
      } else {
        map.set(item[xField], [item[xField], item[yField]])
      }
    })
    return {
      source: [dimensions, ...map.values()]
    }
  }
}

/**
 * 转换成系列平铺数组,将分组的数据转换成dataset
 * @param opts 平铺项名称 { xField:'x',  yField:'y' ,seriesField:'可选，多系列必填'}
 * @param data 包含一个对象数组[ {data:[],legend:'系列分组标记'} ...]
 * 先转换为[
 * {x:'1月',y:'111',s:'系列一'},{x:'1月',y:'222',s:'系列二'}
 * {x:'2月',y:'222',s:'系列一'},{x:'2月',y:'222',s:'系列二'}
 * ]
 * 在根据此格式转换为dataset二维数组形式
 */
function formatSeries(opts, data) {
  let { seriesField } = opts
  if (!seriesField) {
    console.error('seriesField is required')
    return
  }
  let series = []
  data.forEach(item => {
    if (item[seriesField]) {
      let seriesData = item.data.map(i => ({ ...i, [seriesField]: item[seriesField] }))
      series = series.concat(seriesData)
    }
  })

  return formatDataSet(opts, series)
}

/**
 * 转换成类别分组数据，适用于未知系列条目数量的options配置，传统型数据的转换，方便遍历取值
 * @param opts 平铺项名称 { xField:'x',  yField:'y' ,seriesField:'可选，多系列必填'}
 * @param data 包含一个对象数组[ {data:[],legend:'系列分组标记'} ...]
 * return [{
 *   seriesName: "自然人"
 *   xAxis: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
 *   data: ["100", "200", "300", "500", "100", "200", "300", "500", "100", "200", "300", "500"]
 * }]
 */
function formatDataSeries(opts, data) {
  let { xField, yField, seriesField } = opts
  return data.map(item => {
    return {
      seriesName: item[seriesField],
      xAxis: item.data.map(i => i[xField]),
      data: item.data.map(i => i[yField])
    }
  })
}

export { BChart, formatDataSet, formatSeries, formatDataSeries }
