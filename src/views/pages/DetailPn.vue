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
                      <img v-if="current.xb==='男'" src="../../assets/images/man.png" height="38" width="38" alt="xb"/>
                      <img v-else src="../../assets/images/women.png" height="38" width="38" alt="xb"/>
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
      </base-layout>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import TitleHeader from '../../components/TitleHeader/index'
  import Keywords from '../../components/Keywords/index'
  import { deepCopy } from '../../common/utils/assist'
  import TablePage from '../../components/TablePage/index'

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
      }
    },
    data () {
      return {
        visible: false,
        pnType: '1', // 正负面信息:1/2
        tabs: [],
        activeResourceKey: '',
        activeTitle: ''
      }
    },
    computed: {
      ...mapGetters(['queryData']),
      // 当前是查询的法人还是自然人
      type () {
        return this.queryData.type
      },
      // 当前是否是法人
      isLeg () {
        return this.queryData.type === this.ENUM.Leg
      },
      keyword () {
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
      open (pnType, tabs) {
        this.pnType = pnType // 缓存开启的是正面信息还是负面信息
        this.tabs = deepCopy(tabs) // 缓存正面负面信息的tabs数组
        // 默认选中第一个tab展示列表
        if (tabs.length > 0) {
          this.handleTabChange(tabs[0])
          // 根据resourceKey动态生成表格分页组件
        }
        this.visible = true
      },
      close () {
        this.visible = false
      },
      // 字段显示函数
      fieldShow (name) {
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
      handleTabChange (tab) {
        if (this.activeResourceKey !== tab.resourceKey) {
          this.activeResourceKey = tab.resourceKey
          this.activeTitle = tab.resourceName
        }
      }
    },
    filters: {
      valueFilter (value) {
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
        border-radius: 10px;
        overflow: hidden;
      }
    }
    .top-box {
      padding: 30px 42px;
      border-bottom: 1px solid #eeeeee;
      &.faren {
        background: #fff url("../../assets/images/faren-bg.png") no-repeat 0 0;
      }
      &.ziranren {
        background: #fff url("../../assets/images/ziranren-bg.png") no-repeat 0 0;
      }
      .right {
        padding: 0 40px;
        .icon {
          padding-left: 40px;
          background-repeat: no-repeat;
          background-position: 0 0;
          line-height: 24px;
          background-image: url("../../assets/images/icon-1.png")
          &.icon-1 {
            background-image: url("../../assets/images/icon-1.png")
          }
          &.icon-2 {
            background-image: url("../../assets/images/icon-2.png")
          }
          &.icon-3 {
            background-image: url("../../assets/images/icon-3.png")
          }
          &.icon-4 {
            background-image: url("../../assets/images/icon-4.png")
          }
          &.icon-5 {
            background-image: url("../../assets/images/icon-5.png")
          }
          &.icon-6 {
            background-image: url("../../assets/images/icon-6.png")
          }
          &.icon-7 {
            background-image: url("../../assets/images/icon-7.png")
          }
          &.icon-8 {
            background-image: url("../../assets/images/icon-8.png")
          }
        }
      }
      .title-name {
        margin: 0 0 20px;
        font-weight: 500;
        color: #042f63;
        font-size: 24px;
        .status {
          position: relative;
          top: 2px;
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
      .search-count {
        background: #f3f6fc url("../../assets/images/query-bg.png") no-repeat center 5px;
        padding: 30px 10px 10px;
        border-radius: 5px;
        font-size: 12px;
        text-align: center;
        color: #445e83;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .info-box {
      h2 {
        font-weight: bold;
        margin: 0;
        text-align: center;
        color: #042f63;
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
            border-color: #1ba6ee;
            color: #fff;
          }
        }
      }
    }
  }

</style>
