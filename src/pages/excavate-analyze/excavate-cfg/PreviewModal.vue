<template>
  <!--预览弹窗-->
  <b-modal v-model="previewModal" :title="'预览-' + resource.resourceName || ''" fullscreen footer-hide
           :body-styles="{backgroundColor:'#f9f9f9',padding:'16px 24px'}">
    <div class="preview-wrapper" v-if="previewModal">
      <render-filter v-model="conditionForm" :conditions="conditions" @on-change="handleFilter"/>
      <template v-for="element in charts">
        <template v-if="element && element.key">
          <index-card-preview-item v-if="element.type==='index'"
                                   :key="element.key"
                                   ref="chartItems"
                                   :element="element" :item-gap="16"
                                   dynamic :conditions="conditionForm">
          </index-card-preview-item>
          <charts-preview-item v-else :key="element.key"
                               ref="chartItems"
                               :element="element" :item-gap="16"
                               dynamic :conditions="conditionForm"
          ></charts-preview-item>
        </template>
      </template>
    </div>
  </b-modal>
</template>

<script>
import { deepCopy } from '@/common/utils/assist'
import { getRenderingConfig } from '@/api/excavate-analyze/excavate-cfg.api'
import { basicComponents } from '@/components/ChartsConfig/utils/util'
import RenderFilter from '@/components/ChartsConfig/preview/RenderFilter'
import ChartsPreviewItem from '@/components/ChartsConfig/preview/ChartsPreviewItem'
import IndexCardPreviewItem from '@/components/ChartsConfig/preview/IndexCardPreviewItem'

export default {
  name: 'PreviewModal',
  components: { IndexCardPreviewItem, ChartsPreviewItem, RenderFilter },
  data() {
    return {
      resource: {},
      previewModal: false,
      wrapStyle: { margin: '16px' },
      charts: [],
      conditions: [],
      conditionForm: []
    }
  },
  methods: {
    open(resource) {
      this.resource = deepCopy(resource)
      // 获取render 参数配置
      getRenderingConfig(this.resource.resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { charts, conditions } = resp.data.data
          this.charts = this.formatCharts(charts)
          this.conditions = conditions
          this.conditionForm = this.formatCondition(conditions)
          this.previewModal = true
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

<style scoped>

</style>
