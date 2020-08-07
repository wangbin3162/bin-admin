<template>
  <exc-layout>
    <div class="excavate-main-wrap">
      <exc-header/>
      <exc-tabs :active-index="activeIndex" @on-change="handleTabChange"/>
      <div class="breadcrumb">
        <b-breadcrumb separator="/">
          <b-breadcrumb-item :to="{ path: '/excavate' }">挖掘分析</b-breadcrumb-item>
          <b-breadcrumb-item> {{ resource.resourceName }}</b-breadcrumb-item>
        </b-breadcrumb>
      </div>
      <div class="content">
        <div v-if="activeIndex===0">
          <exc-analyze/>
        </div>
        <div v-if="activeIndex===1">归集分析</div>
        <div v-if="activeIndex===2">群体分析</div>
      </div>
    </div>
  </exc-layout>
</template>

<script>
import ExcLayout from '@/pages/excavate/components/ExcLayout'
import ExcHeader from '@/pages/excavate/components/ExcHeader'
import { isEmpty } from '@/common/utils/assist'
import ExcTabs from '@/pages/excavate/components/ExcTabs'
import ExcAnalyze from '@/pages/excavate/ExcAnalyze'

export default {
  name: 'RenderPage',
  components: { ExcAnalyze, ExcTabs, ExcHeader, ExcLayout },
  data() {
    return {
      resource: {
        resourceKey: '',
        resourceName: ''
      },
      activeIndex: 0
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
      if (isEmpty(resourceKey)) {
        this.$router.push('/excavate')
      }
    },
    // tab切换
    handleTabChange(current) {
      this.activeIndex = current
    }
  }
}
</script>

<style scoped lang="stylus">
.excavate-main-wrap {
  background-color: #f9f9f9;
  .content {
    width: 1300px;
    margin: 16px auto;
  }
  .breadcrumb {
    width: 1300px;
    margin: 16px auto;
    padding: 0 8px;
  }
}
</style>
