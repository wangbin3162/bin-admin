<template>
  <!--正负面信息弹窗组件-->
  <transition name="move">
    <div class="full-screen-wrapper" v-show="visible">
      <base-layout>
        <div class="main-wrap">
          <top-affix>
            <title-header :title="title" @on-back="close"></title-header>
          </top-affix>
          <div class="detail-wrap">
            <div class="top-box mb-20" v-if="current">
              <div class="inner" flex>
                <keywords :font-size="32" :radius="10" :size="100" :words="keyword"></keywords>
                <div class="right" flex-box="1">
                  <h2 class="title-name">{{ current.comp_name }}<span class="ml-15">{{ current.djzt }}</span></h2>
                  <p flex="box:mean">
                    <span>统一社会信用代码：{{ current.id_shxym | valueFilter }}</span>
                    <span>地址：{{ current.zs | valueFilter }}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.fddbr }}：{{ current.fddbr | valueFilter }}</span>
                    <span>{{ mapping.zczb }}：{{ current.zczb | valueFilter}}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.clrq }}：{{ current.clrq | valueFilter}}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.jyfw }}：{{ current.jyfw | valueFilter}}</span>
                  </p>
                </div>
              </div>
            </div>
            <b-divider></b-divider>
            <div class="info-box p20">
              <h2>{{ pnType==='1'?'正面信息':'负面信息' }}</h2>
              <div class="tabs">
                <span v-for="tab in tabs" :key="tab.resourceKey"
                      :class="{'active':activeResourceKey===tab.resourceKey}"
                      @click="activeResourceKey=tab.resourceKey">
                  {{ tab.resourceName }} ({{ tab.amount }})
                </span>
              </div>
              <table-page :resource-key="activeResourceKey"></table-page>
            </div>
          </div>
        </div>
      </base-layout>
    </div>
  </transition>
</template>

<script>
  import TitleHeader from '../../components/title-header/title-header'
  import Keywords from '../../components/keywords/keywords'
  import { deepCopy } from '../../utils/assist'
  import TablePage from '../../components/table-page/table-page'

  export default {
    name: 'detail-pn',
    components: { TablePage, Keywords, TitleHeader },
    props: {
      title: {
        type: String,
        default: ''
      },
      current: {
        type: Object
      },
      mapping: {
        type: Object
      }
    },
    data () {
      return {
        visible: false,
        pnType: '1', // 正负面信息:1/2
        tabs: [],
        activeResourceKey: ''
      }
    },
    computed: {
      keyword () {
        if (this.current && this.current.comp_name) {
          let size = this.current.comp_name.length >= 4 ? 4 : 1
          return this.current.comp_name.slice(0, size).split('')
        } else {
          return ['null']
        }
      }
    },
    methods: {
      open (pnType, tabs) {
        this.pnType = pnType // 缓存开启的是正面信息还是负面信息
        this.tabs = deepCopy(tabs) // 缓存正面负面信息的tabs数组
        // 默认选中第一个tab展示列表
        if (tabs.length > 0) {
          this.activeResourceKey = tabs[0].resourceKey
          // 根据resourceKey动态生成表格分页组件
        }
        this.visible = true
      },
      close () {
        this.visible = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  .full-screen-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    &.move-enter-active, &.move-leave-active {
      transition: all .4s ease;
    }
    &.move-enter, &.move-leave-to {
      opacity: .7;
      transform: translateX(-100%);
    }
    .main-wrap {
      background: #f4f4f4;
      .detail-wrap {
        width: 1300px;
        margin: 20px auto;
        background: #fff;
      }
    }
    .top-box {
      padding: 30px 42px;
      .inner {
        .right {
          padding-left: 40px;
          .title-name {
            margin: 0 0 20px;
            font-weight: 500;
            color: #333;
            font-size: 22px;
            span {
              display: inline-block;
              vertical-align: top;
              font-size: 15px;
              font-weight: normal;
              color: #36d8da;
              border: 1px solid #36d8da;
              border-radius: 4px;
              padding: 2px 5px;
            }
          }
        }
      }
    }
    .info-box {
      h2 {
        font-weight: normal;
        margin: 0;
        text-align: center;
        color: #333;
        margin-bottom: 20px;
      }
      .tabs {
        span {
          display: inline-block;
          cursor: pointer;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #dfdfdf;
          padding: 10px 20px;
          border-radius: 4px;
          color: #666666;
          &.active {
            background: #1ba6ee;
            color: #fff;
          }
        }
      }
    }
  }

</style>
