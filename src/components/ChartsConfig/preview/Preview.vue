<template>
  <div>
    <!--预览弹窗-->
    <b-modal v-model="previewModal" :title="'预览-' + resource.resourceName || ''" fullscreen footer-hide width="100%"
             stop-remove-scroll>
      <div class="ctrl" style="margin-bottom: 24px;border:1px solid #e9e9e9;">
        <div style="padding: 8px 16px;">
          <b-button v-if="!isOpen" type="primary" plain @click="handleChangeDynamic">切换动态渲染</b-button>
          <b-button v-else type="info" plain @click="handleChangeStatic">切换静态渲染</b-button>
        </div>
        <render-filter v-if="isOpen" v-model="conditionForm" :conditions="conditions" @on-change="handleFilter"/>
        <p>conditionForm: {{ conditionForm }}</p>
      </div>
      <div class="preview-wrapper" v-if="previewModal">
        <template v-for="chart in charts">
          <charts-preview-item v-if="chart && chart.key" :key="chart.key"
                               ref="chartItems"
                               :element="chart" :wrap-style="wrapStyle"
                               :dynamic="isOpen" :conditions="conditionForm" log/>
        </template>
      </div>
      <b-ace-editor :value="JSON.stringify(charts, null, 2)" readonly></b-ace-editor>
    </b-modal>
  </div>
</template>

<script>
import ChartsPreviewItem from './ChartsPreviewItem'
import { deepCopy } from '@/common/utils/assist'
import { getRenderingConfig } from '@/api/excavate-analyze/excavate-cfg.api'
import { basicComponents } from '../utils/util'
import RenderFilter from './RenderFilter'

export default {
  name: 'Preview',
  components: { RenderFilter, ChartsPreviewItem },
  props: {
    wrapStyle: {
      type: Object,
      default() {
        return { margin: '8px' }
      }
    }
  },
  data() {
    return {
      resource: {},
      previewModal: false,
      isOpen: false,
      charts: [],
      conditions: [],
      conditionForm: []
    }
  },
  methods: {
    open(list, resource) {
      // 缓存静态原始数据
      this.staticList = deepCopy(list)
      this.charts = deepCopy(list)
      this.resource = deepCopy(resource)
      this.previewModal = true
    },
    // 切换动态渲染
    handleChangeDynamic() {
      getRenderingConfig(this.resource.resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { charts, conditions } = resp.data.data
          this.charts = this.formatCharts(charts)
          this.conditions = conditions
          this.conditionForm = this.formatCondition(conditions)
          this.isOpen = true
        }
      })
    },
    // 切换静态渲染
    handleChangeStatic() {
      this.isOpen = false
      this.charts = deepCopy(this.staticList)
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
