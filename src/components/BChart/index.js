import BChart from './BChart.vue'

/**
 * 转换数据集
 * @param opts 配置项 { xField:'x',  yField:'y' ,seriesField:'可选'} //  分别为x轴映射字段，y轴映射字段，series 可选
 * @param dataSource 元数据
 */
function formatDataSet(opts, dataSource) {
  let { xField, yField, seriesField } = opts
  return {
    source: [
      [xField, yField],
      ...dataSource.map(item => {
        return [item[xField], item[yField]]
      })
    ]
  }
}

export { BChart, formatDataSet }
