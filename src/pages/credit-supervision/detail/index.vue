<template>
  <cre-sup-layout>
    <div class="credit-supervision-detail">
      <cre-sup-header background-color="#096ded"></cre-sup-header>

      <div class="main-con">
        <!-- 基本信息 -->
        <transition name="fade-scale-move">
          <base-info v-show="visible"></base-info>
        </transition>
        <!-- 扩展信息 -->
        <transition name="fade-scale-move">
          <extend-info v-if="visible" class="mt-20"></extend-info>
        </transition>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import { mapMutations } from 'vuex'
  import {
    getDetail, getPersonDynamic, getRedBlackOrFocusScope
  } from '@/api/credit-supervision/detail.api'
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
        visible: false,
        query: {}
      }
    },
    created () {
      this.init()
    },
    mounted () {
      setTimeout(() => {
        this.visible = true
      }, 300)
    },
    beforeDestroy () {
      this.setDetailRes({})
      this.setRecentDynamic([])
      this.setRedBlackListInfo([])
      this.setFocusScopeSupervision([])
    },
    methods: {
      ...mapMutations({
        setDetailRes: 'SET_DETAIL_RES',
        setRecentDynamic: 'SET_RECENT_DYNAMIC',
        setRedBlackListInfo: 'SET_RED_BLACK_LIST_INFO',
        setFocusScopeSupervision: 'SET_FOCUS_SCOPE_SUPERVISION'
      }),

      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const { id, type } = this.$route.query
        this.getDetail({ id, type })
        this.getRecentDynamic({ id, type, month: 1 })
        this.getRedBlackListInfo({ personId: id })
        this.getFocusScopeSupervision({ personId: id, jgType: 'IA' })
      },

      /**
       * @author haodongdong
       * @descriptoin 获取主体详情
       * @param {Object} query 查询参数对象
       * @param {string} query.id 主体id
       * @param {number} query.type 主体类型 1 法人 2 自然人
       */
      async getDetail (query) {
        try {
          const res = await getDetail(query)
          this.setDetailRes(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @descriptoin 获取近期动态
       * @param {Object} query 查询参数对象
       * @param {string} query.id 主体id
       * @param {number} query.type 主体类型 1 法人 2 自然人
       * @param {string} query.month 查询月数
       */
      async getRecentDynamic (query) {
        try {
          const res = await getPersonDynamic(query)
          this.setRecentDynamic(res.rows)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 获取红黑名单信息
       * @param {Object} query 查询参数对象
       * @param {string} query.personId 主体id
       */
      async getRedBlackListInfo (query) {
        try {
          const res = await getRedBlackOrFocusScope(query)
          this.setRedBlackListInfo(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 获取重点领域监管
       * @param {Object} query 查询参数对象
       * @param {string} query.personId 主体id
       * @param {string} query.jgType 监管类型
       */
      async getFocusScopeSupervision (query) {
        try {
          const res = await getRedBlackOrFocusScope(query)
          this.setFocusScopeSupervision(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      }
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
