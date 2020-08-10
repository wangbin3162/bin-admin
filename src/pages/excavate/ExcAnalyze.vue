<template>
  <div class="charts-wrap">
    <div class="preview-wrapper" v-if="previewVisible">
      <render-filter v-model="conditionForm" :conditions="conditions" @on-change="handleFilter"/>
      <template v-for="chart in charts">
        <charts-preview-item v-if="chart && chart.key" :key="chart.key"
                             ref="chartItems"
                             :element="chart" :item-gap="16"
                             dynamic :conditions="conditionForm"/>
      </template>
    </div>
  </div>
</template>

<script>
import { deepCopy, isNotEmpty } from '@/common/utils/assist'
import { getRenderingConfig } from '@/api/excavate.api'
import { basicComponents } from '@/pages/excavate/utils/util'
import RenderFilter from '@/pages/excavate/chart-preview/RenderFilter'
import ChartsPreviewItem from '@/pages/excavate/chart-preview/ChartsPreviewItem'

export default {
  name: 'ExcAnalyze',
  components: { ChartsPreviewItem, RenderFilter },
  data() {
    return {
      resource: {
        resourceKey: '',
        resourceName: ''
      },
      charts: [],
      conditions: [],
      conditionForm: [],
      previewVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      // 先从地址栏拉取请求
      let { resourceKey, resourceName } = this.$route.query
      this.resource.resourceKey = resourceKey || ''
      this.resource.resourceName = resourceName || ''
      // 初始化数据
      this.charts = []
      this.conditions = []
      this.conditionForm = []
      this.previewVisible = false

      if (isNotEmpty(resourceKey)) {
        this.searchDetail()
      }
    },
    // 查询详情
    searchDetail() {
      // 获取render 参数配置
      getRenderingConfig(this.resource.resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { charts, conditions } = resp.data.data
          this.charts = this.formatCharts(charts)
          this.conditions = conditions
          this.conditionForm = this.formatCondition(conditions)
          this.previewVisible = true
        }
      })
    },
    // 查询条件查询
    handleFilter() {
      let charts = this.$refs.chartItems
      if (charts && charts.length) {
        charts.forEach(item => {
          item.updateData()
        })
      }
    },
    // 格式化请求返回的图表列表
    formatCharts(list) {
      return list.map(item => {
        let base = this.getChartBaseInfo(item.chartType)
        base.key = item.id
        base.isOpen = item.isOpen
        base.dataSource = item.dataSource
        base.dataSourceName = item.dataSourceName || item.dataSource
        try {
          base.options = JSON.parse(item.chartConfigExt)
          base.dataSourceParam = JSON.parse(item.dataSourceParam)
          base.staticDataSource = JSON.parse(item.staticDataSource)
        } catch (e) {
        }
        return base
      })
    },
    // 格式化请求返回的条件筛选列表，用于渲染条件控件
    formatCondition(list) {
      return list.map(item => {
        return {
          fieldName: item.fieldName,
          type: item.queryType,
          value: item.fieldType === 'date' ? { gte: '', lt: '' } : []
        }
      })
    },
    // 获取一个类型的基础配置项
    getChartBaseInfo(type) {
      return deepCopy(basicComponents.find(i => i.type === type))
    }
  }
}
</script>
