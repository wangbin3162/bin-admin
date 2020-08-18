<template>
  <cre-sup-layout>
    <div class="credit-supervision-detail">
      <cre-sup-header background-color="#096ded"></cre-sup-header>

      <div class="main-con">
        <!-- 基本信息 -->
        <base-info></base-info>
        <!-- 扩展信息 -->
        <extend-info class="mt-20"></extend-info>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import BaseInfo from '@/pages/credit-supervision/detail/base-info'
  import ExtendInfo from '@/pages/credit-supervision/detail/extend-info'

  export default {
    name: 'CreditSupervisionDetail',
    components: {
      CreSupLayout,
      CreSupHeader,
      BaseInfo,
      ExtendInfo
    },
    data () {
      return {
        query: {}
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .credit-supervision-detail {
    height: 100%;

    .main-con {
      width: 1300px;
      margin: 20px auto;
    }
  }
</style>
