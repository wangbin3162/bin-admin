<template>
  <exc-layout>
    <div class="excavate-main-wrap">
      <exc-header>
        <res-search-input/>
      </exc-header>
      <exc-tabs v-model="activeCode"/>
      <div class="breadcrumb">
        <b-breadcrumb separator="/">
          <b-breadcrumb-item :to="{ path: '/excavate' }">挖掘分析</b-breadcrumb-item>
          <b-breadcrumb-item> {{ tabs[activeCode] }}</b-breadcrumb-item>
          <b-breadcrumb-item> {{ resource.resourceName }}</b-breadcrumb-item>
        </b-breadcrumb>
      </div>
      <div class="content">
        <exc-analyze v-if="activeCode==='resource'"/>
        <person-analyze v-if="activeCode==='person'"/>
        <gather-analyze v-if="activeCode==='gather'"/>
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
import ResSearchInput from '@/pages/excavate/components/ResSearchInput'
import GatherAnalyze from '@/pages/excavate/GatherAnalyze'
import PersonAnalyze from '@/pages/excavate/PersonAnalyze'

export default {
  name: 'RenderPage',
  components: { PersonAnalyze, GatherAnalyze, ResSearchInput, ExcAnalyze, ExcTabs, ExcHeader, ExcLayout },
  data() {
    return {
      resource: {
        resourceKey: '',
        resourceName: ''
      },
      activeCode: 'resource',
      tabs: {
        resource: '业务分析',
        person: '群体分析',
        gather: '归集分析'
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
      if (isEmpty(resourceKey)) {
        this.$router.push('/excavate')
      } else {
        this.activeCode = 'resource'
      }
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
