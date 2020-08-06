<template>
  <exc-layout>
    <div class="excavate-main-wrap">
      <exc-header/>
      挖掘分析详情页
      <p>{{ resource }}</p>
    </div>
  </exc-layout>
</template>

<script>
import ExcLayout from '@/pages/excavate/components/ExcLayout'
import ExcHeader from '@/pages/excavate/components/ExcHeader'
import { isNotEmpty } from '@/common/utils/assist'

export default {
  name: 'RenderPage',
  components: { ExcHeader, ExcLayout },
  data() {
    return {
      resource: {
        resourceKey: '',
        resourceName: ''
      }
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
      if (isNotEmpty(resourceKey)) {
        this.searchDetail()
      } else {
        this.$router.push('/excavate')
      }
    },
    // 查询详情
    searchDetail() {
      console.log('查询对应资源图表')
    }
  }
}
</script>

<style scoped>

</style>
