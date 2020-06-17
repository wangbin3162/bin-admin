<template>
  <!--正负面信息弹窗组件-->
  <div class="detail-pn-wrap" v-show="visible">
    <title-header :title="title" @on-back="close"></title-header>
    <div class="detail-wrap">
      <div class="top-box" :class="isLeg?'faren':'ziranren'" v-if="current">
        <!--顶部详情数据-->
        <div class="inner" flex>
          <div class="left">
            <keywords cls="color-0" :font-size="32" :radius="20" :size="isLeg ? 100:90">{{ keyword }}</keywords>
          </div>
          <div class="right" flex-box="1">
            <template v-if="isLeg">
              <h2 class="title-name">{{ current.comp_name }}<span class="status ml-15">{{ current.djzt }}</span>
              </h2>
              <p flex="box:mean">
                <span class="icon icon-1">统一社会信用代码：{{ current.id_shxym | valueFilter }}</span>
                <span class="icon icon-5">地址：{{ current.zs | valueFilter }}</span>
              </p>
              <p flex="box:mean">
                <span class="icon icon-2">{{ mapping.fddbr }}：{{ current.fddbr | valueFilter }}</span>
                <span class="icon icon-6">注册资本：{{  fieldShow('zczb') }}</span>
              </p>
              <p flex="box:mean">
                <span class="icon icon-3">{{ mapping.clrq }}：{{ current.clrq | valueFilter}}</span>
              </p>
              <p flex="box:mean">
                <span class="icon icon-4">{{ mapping.jyfw }}：{{ current.jyfw | valueFilter}}</span>
              </p>
            </template>
            <template v-else>
              <h2 class="title-name" flex="cross:center">
                <span class="mr-20">{{ current.name }}</span>
                <img v-if="current.xb==='男'" src="../assets/images/man.png" height="38" width="38" alt="xb"/>
                <img v-else src="../assets/images/women.png" height="38" width="38" alt="xb"/>
              </h2>
              <p flex="box:mean">
                <span class="icon icon-7">身份证号码：{{ current.id_sfz | valueFilter }}</span>
                <span class="icon icon-8">国籍：{{ current.gjdq | valueFilter }}</span>
              </p>
            </template>
          </div>
          <div>
            <div class="search-count" style="width: 100px;" :title="logTotal">查询量：{{logTotal}}</div>
          </div>
        </div>
      </div>
      <div class="info-box p20">
        <h2>{{ pnType==='1'?'正面信息':'负面信息' }}</h2>
        <div class="tabs">
                <span v-for="tab in tabs" :key="tab.resourceKey"
                      :class="{'active':activeResourceKey===tab.resourceKey}"
                      @click="handleTabChange(tab)">
                  {{ tab.resourceName }} ({{ tab.amount }})
                </span>
        </div>
        <table-page :resource-key="activeResourceKey" :title="activeTitle"></table-page>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleHeader from '../components/TitleHeader/index'
  import Keywords from '../components/Keywords/index'
  import { deepCopy } from '../common/utils/assist'
  import TablePage from '../components/TablePage/index'

  export default {
    name: 'DetailPn',
    components: { TablePage, Keywords, TitleHeader },
    props: {
      title: {
        type: String,
        default: ''
      },
      logTotal: {
        type: Number,
        default: 0
      },
      current: {
        type: Object
      },
      mapping: {
        type: Object
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        visible: false,
        pnType: '1', // 正负面信息:1/2
        tabs: [],
        activeResourceKey: '',
        activeTitle: ''
      }
    },
    computed: {
      // 当前是否是法人
      isLeg() {
        return this.type === this.ENUM.Leg
      },
      keyword() {
        if (this.isLeg) {
          return this.current.keywords[0]
        } else {
          if (this.current && this.current.name) {
            return this.current.name.slice(0, 1)
          }
        }
        return 'null'
      }
    },
    methods: {
      open(pnType, tabs) {
        this.pnType = pnType // 缓存开启的是正面信息还是负面信息
        this.tabs = deepCopy(tabs) // 缓存正面负面信息的tabs数组
        // 默认选中第一个tab展示列表
        if (tabs.length > 0) {
          this.handleTabChange(tabs[0])
          // 根据resourceKey动态生成表格分页组件
        }
        window.scrollTo(0, 0)
        this.visible = true
      },
      close() {
        this.visible = false
        this.$emit('on-close')
      },
      // 字段显示函数
      fieldShow(name) {
        if (this.current && this.current[name] && this.current[name].toString().length !== 0) {
          if (name === 'zczb') {
            let total = this.current[name] / 10000
            let bz = this.current['zczbbz'] // 注册资本币种
            return bz ? `${total}万${bz}` : `${total}万元`
          }
          return this.current[name]
        }
        return '-'
      },
      // tab切换事件
      handleTabChange(tab) {
        if (this.activeResourceKey !== tab.resourceKey) {
          this.activeResourceKey = tab.resourceKey
          this.activeTitle = tab.resourceName
        }
      }
    },
    filters: {
      valueFilter(value) {
        if (!value || value.toString().length === 0) {
          return '-'
        }
        return value
      }
    }
  }
</script>

<style scoped lang="stylus">
  .full-screen-wrapper {
    .top-box {
    }
  }
</style>
