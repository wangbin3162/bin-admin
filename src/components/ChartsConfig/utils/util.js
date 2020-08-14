/**
 * 图表类型中文名映射
 */
import { formatSeries } from 'bin-charts/src/utils/util'
import { deepCopy, isEmpty } from '@/common/utils/assist'
import { oneOf } from 'bin-ui/src/utils/util'
import { geoCoordMap } from './geoCoordMap'

const DEFAULT_COLORS = [
  '#5B8FF9', '#5AD8A6',
  '#5D7092', '#F6BD16',
  '#E8684A', '#6DC8EC',
  '#9270CA', '#FF9D4D',
  '#269A99', '#FF99C3'
]

// 颜色列表
export const COLOR_LIST = [
  '#5B8FF9', '#BDD2FD',
  '#5AD8A6', '#BDEFDB',
  '#5D7092', '#C2C8D5',
  '#F6BD16', '#FBE5A2',
  '#E8684A', '#F6C3B7',
  '#6DC8EC', '#B6E3F5',
  '#9270CA', '#D3C6EA',
  '#FF9D4D', '#FFD8B8',
  '#269A99', '#AAD8D8',
  '#FF99C3', '#FFD6E7'
]

export const COLOR_LIST_GRAY = [
  '#eeeeee',
  '#dddddd',
  '#bebebe',
  '#a1a1a1',
  '#848484',
  '#686868',
  '#4e4e4e',
  '#353535',
  '#1d1d1d'
]

// 宽度下拉
export const WIDTH_MAP = {
  '1/3': '33.33%',
  '2/3': '66.66%',
  '1/2': '50%',
  '100%': '100%'
}

// 指标卡宽度枚举
export const WIDTH_MAP_CARD = {
  '1/5': '20%',
  '1/4': '25%',
  '1/3': '33.33%',
  '1/2': '50%',
  '1/1': '100%'
}

// 指标卡背景颜色预设
export const COLOR_INDEX_CARD = [
  '#4065e0', '#35a4ff', '#6fcafa', '#18e5e6',
  '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16',
  '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D'
]

// 图表基础配置对象
export const basicComponents = [
  {
    name: '指标卡',
    type: 'index',
    icon: 'index-card',
    options: {
      title: '指标标题',
      backgroundColor: '#4065e0',
      width: '25%',
      height: 100,
      icon: 'ios-albums',
      iconSize: 24
    },
    isOpen: 'static',
    staticDataSource: [{
      value: 1234
    }],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '指标组',
    type: 'indexGroup',
    icon: 'index-group',
    options: {
      title: '指标组',
      height: 100,
      groupList: [
        {
          title: '指标标题1',
          backgroundColor: '#4065e0',
          icon: 'ios-albums',
          iconSize: 24,
          value: 1234,
          field: ''
        },
        {
          title: '指标标题2',
          backgroundColor: '#4065e0',
          icon: 'ios-albums',
          iconSize: 24,
          value: 8888,
          field: ''
        },
        {
          title: '指标标题3',
          backgroundColor: '#4065e0',
          icon: 'ios-albums',
          iconSize: 24,
          value: 9527,
          field: ''
        },
        {
          title: '指标标题4',
          backgroundColor: '#4065e0',
          icon: 'ios-albums',
          iconSize: 24,
          value: 2345,
          field: ''
        }
      ]
    },
    isOpen: 'static',
    staticDataSource: [],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '折线图',
    type: 'line',
    icon: 'linechart',
    options: {
      title: '折线图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '100%',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: { show: false, trigger: 'axis' },
      legend: {
        show: false,
        textStyle: {
          color: '#686868',
          fontSize: 12
        },
        icon: '',
        itemWidth: 16,
        itemHeight: 12,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      yAxis: {
        type: 'value',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      series: {
        name: '系列一',
        type: 'line',
        smooth: true,
        label: {
          show: false,
          color: '#686868',
          fontSize: 12,
          position: 'top'
        },
        areaStyle: {
          opacity: 0
        }
      },
      color: DEFAULT_COLORS,
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      {
        s: '系列1',
        data: [
          { x: '1/1', y: 375 },
          { x: '1/2', y: 200 },
          { x: '1/3', y: 25 },
          { x: '1/4', y: 190 },
          { x: '1/5', y: 90 },
          { x: '1/6', y: 277 }
        ]
      }
    ],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '柱状图',
    type: 'histogram',
    icon: 'barchart',
    options: {
      title: '柱状图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '100%',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false,
        textStyle: {
          color: '#686868',
          fontSize: 12
        },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      yAxis: {
        type: 'value',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      series: {
        name: '系列一',
        type: 'bar',
        smooth: true,
        label: {
          show: false,
          color: '#686868',
          fontSize: 12,
          position: 'top'
        },
        barWidth: 'auto' // 可选
      },
      color: DEFAULT_COLORS,
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      {
        s: '系列1',
        data: [
          { x: '1/1', y: 375 },
          { x: '1/2', y: 200 },
          { x: '1/3', y: 25 },
          { x: '1/4', y: 190 },
          { x: '1/5', y: 90 },
          { x: '1/6', y: 277 }
        ]
      },
      {
        s: '系列2',
        data: [
          { x: '1/1', y: 75 },
          { x: '1/2', y: 100 },
          { x: '1/3', y: 225 },
          { x: '1/4', y: 390 },
          { x: '1/5', y: 190 },
          { x: '1/6', y: 77 }
        ]
      }
    ],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '条形图',
    type: 'bar',
    icon: 'align-left',
    options: {
      title: '条形图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '100%',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false,
        textStyle: {
          color: '#686868',
          fontSize: 12
        },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0
      },
      xAxis: {
        type: 'value',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: false,
          alignWithLabel: false,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      yAxis: {
        type: 'category',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#848484'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#848484'
          }
        },
        axisLabel: {
          show: true,
          color: '#848484',
          fontSize: 12
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#848484'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eeeeee'
          }
        }
      },
      series: {
        name: '系列一',
        type: 'bar',
        smooth: true,
        label: {
          show: false,
          color: '#686868',
          fontSize: 12,
          position: 'top'
        },
        barWidth: 'auto' // 可选
      },
      color: DEFAULT_COLORS,
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      {
        s: '系列1',
        data: [
          { x: '1/1', y: 375 },
          { x: '1/2', y: 200 },
          { x: '1/3', y: 25 },
          { x: '1/4', y: 190 },
          { x: '1/5', y: 90 },
          { x: '1/6', y: 277 }
        ]
      },
      {
        s: '系列2',
        data: [
          { x: '1/1', y: 75 },
          { x: '1/2', y: 100 },
          { x: '1/3', y: 225 },
          { x: '1/4', y: 390 },
          { x: '1/5', y: 190 },
          { x: '1/6', y: 77 }
        ]
      }
    ],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '饼图',
    type: 'pie',
    icon: 'piechart',
    options: {
      title: '饼图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '50%',
      height: 400,
      tooltip: { show: false, trigger: 'item', formatter: '{a}<br>{c} ({d}%)' },
      legend: {
        show: false,
        textStyle: {
          color: '#686868',
          fontSize: 12
        },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0
      },
      series: {
        name: '系列一',
        type: 'pie',
        label: {
          show: true,
          color: '',
          fontSize: 12,
          position: 'outside' // 可选inside
        },
        roseType: false, // 饼图可选玫瑰图
        center: ['50%', '50%'], // 饼图可选
        radius: ['0', '70%']// 饼图可选
      },
      color: DEFAULT_COLORS,
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      {
        s: '系列1',
        data: [
          { x: '1/1', y: 375 },
          { x: '1/2', y: 200 },
          { x: '1/3', y: 25 },
          { x: '1/4', y: 190 },
          { x: '1/5', y: 90 },
          { x: '1/6', y: 277 }
        ]
      }
    ],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '雷达图',
    type: 'radar',
    icon: 'radarchart',
    options: {
      title: '雷达图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '50%',
      height: 400,
      tooltip: { show: false, trigger: 'item' },
      legend: {
        show: false,
        textStyle: {
          color: '#686868',
          fontSize: 12
        },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0
      },
      radar: { // 雷达图可选
        shape: 'circle', // polygon
        center: ['50%', '50%'],
        radius: '75%'
      },
      series: {
        name: '系列一',
        type: 'radar',
        label: {
          show: false,
          color: '',
          fontSize: 12,
          position: 'top' // 可选inside
        },
        areaStyle: { // 可选的
          opacity: 0
        }
      },
      color: DEFAULT_COLORS,
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      {
        s: '系列一',
        data: [
          { x: '维度1', y: 375 },
          { x: '维度2', y: 200 },
          { x: '维度3', y: 234 },
          { x: '维度4', y: 321 },
          { x: '维度5', y: 405 }
        ]
      },
      {
        s: '系列二',
        data: [
          { x: '维度1', y: 175 },
          { x: '维度2', y: 300 },
          { x: '维度3', y: 334 },
          { x: '维度4', y: 221 },
          { x: '维度5', y: 105 }
        ]
      },
      {
        s: '系列三',
        data: [
          { x: '维度1', y: 115 },
          { x: '维度2', y: 233 },
          { x: '维度3', y: 434 },
          { x: '维度4', y: 121 },
          { x: '维度5', y: 215 }
        ]
      }
    ],
    dataSource: '',
    dataSourceParam: []
  },
  {
    name: '地图',
    type: 'map',
    icon: 'map',
    options: {
      title: '地图',
      titleStyle: {
        color: '#686868',
        fontSize: 18
      },
      width: '100%',
      height: 600,
      tooltip: { show: false, trigger: 'item' },
      visualMap: {
        show: false,
        type: 'piecewise',
        min: 0,
        max: 200,
        itemWidth: 10,
        itemHeight: 10,
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'],
          symbolSize: [10, 16]
        },
        textStyle: {
          color: '#686868',
          fontSize: 12
        }
      },
      // 地图独有的
      geo: {
        map: 'china',
        zoom: 1.2,
        label: {
          normal: {
            show: false,
            color: '#fff',
            fontSize: 12
          },
          emphasis: {
            color: '#1f9bff'
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#282c3c',
            borderColor: '#1f9bff'
          },
          emphasis: {
            areaColor: '#1d2131',
            borderColor: '#1f9bff'
          }
        }
      },
      series: {
        type: 'scatter', // scatter,effectScatter
        coordinateSystem: 'geo',
        symbolSize: 10,
        aspectScale: 0.75,
        hoverAnimation: true,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3
        },
        label: {
          show: false,
          color: '',
          fontSize: 12,
          position: 'inside' // 可选inside
        },
        itemStyle: {
          emphasis: {
            borderColor: '#fff',
            borderWidth: 1
          }
        },
        zlevel: 1
      },
      sourceMap: { xField: 'x', yField: 'y', seriesField: 's' }
    },
    isOpen: 'static',
    staticDataSource: [
      { x: '吉林', y: 178 },
      { x: '北京', y: 23 },
      { x: '上海', y: 122 },
      { x: '徐州', y: 98 },
      { x: '南京', y: 188 },
      { x: '兰州', y: 31 },
      { x: '乌鲁木齐', y: 122 },
      { x: '马鞍山', y: 32 },
      { x: '张家界', y: 55 },
      { x: '三门峡', y: 100 }
    ],
    dataSource: '',
    dataSourceParam: []
  }
]

// 根据图表原始数据拼装实际charts options
export function buildOptions(chartData, dynamic = false, dynamicData = []) {
  let { staticDataSource, options, type } = chartData
  let sourceMap = options.sourceMap

  // 组装options
  let opts = deepCopy(options)
  delete opts['title']
  delete opts['titleStyle']
  delete opts['width']
  delete opts['height']
  delete opts['sourceMap']

  let data = (dynamic && dynamicData) ? dynamicData : staticDataSource
  let dataset = getDataset(sourceMap, data, options.series.name)

  // 设置数据series和dataset
  if (oneOf(type, ['line', 'histogram', 'bar', 'pie'])) {
    let seriesList = []
    data.forEach(item => {
      seriesList.push({
        name: item[sourceMap.seriesField],
        ...deepCopy(options.series)
      })
    })
    opts.series = seriesList
    opts.dataset = dataset
  }
  // 雷达图特殊处理
  if (type === 'radar') {
    let seriesList = dataset.source[0].slice(1)
    let dataList = dataset.source.slice(1)
    // 配置雷达图维度数据
    opts.radar.indicator = dataList.map(item => ({ name: item[0] }))

    let seriesData = []
    for (let i = 0; i < seriesList.length; i++) {
      seriesData.push({ name: seriesList[i], value: dataList.map(item => item[i + 1]) })
    }
    let series = opts.series
    series.data = seriesData
    opts.series = [series]
  }
  // 地图特殊处理
  if (type === 'map') {
    let series = opts.series
    series.data = convertData(data, sourceMap.xField, sourceMap.yField)
    opts.series = [series]
  }

  return opts
}

// 处理dataset数据
function getDataset(sourceMap, data, seriesName = '') {
  let _sourceMap = sourceMap || { xField: 'x', yField: 'y', seriesField: 's' }
  let _data = data || []
  if (_data.length === 1 && isEmpty(_data[0].s)) {
    _data[0].s = seriesName
  }
  return formatSeries(_sourceMap, _data)
}

function convertData(data, xField, yField) {
  let res = []
  for (let i = 0; i < data.length; i++) {
    let geoCoord = geoCoordMap[data[i][xField]]
    if (geoCoord) {
      res.push({
        name: data[i][xField],
        value: geoCoord.concat(data[i][yField])
      })
    }
  }
  return res
}
