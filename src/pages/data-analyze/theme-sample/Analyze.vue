<template>
  <div class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_xxsl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis :title="`资源信息数量（${firstLineUnit}）`">
              资源信息数量（{{ firstLineUnit }}）
            </i>
            <i class="count">{{ zyxxsl }}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis :title="`数据归集总量（${firstLineUnit}）`">
              数据归集总量（{{ firstLineUnit }}）
            </i>
            <i class="count">{{ ssgjzl }}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjsj.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis :title="`本月归集数据量（${firstLineUnit}）`">
              本月归集数据量（{{ firstLineUnit }}）
            </i>
            <i class="count">{{ bygjs }}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_sjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="上月归集数据量（条）">上月归集数据量（条）</i>
            <i class="count">{{ sygjs }}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_frsjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>数据完整率</i>
            <i class="count">{{ sjwzl }}</i>
          </span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="card-layout mb-20">
        <div class="left">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">本月信息归集统计</span>
              </div>
            </template>
            <div flex="main:justify">
              <div class="summary" flex="dir:top">
                <span>归集数据汇总</span>
                <span><i class="summary-count">{{ curCount }}</i>{{ byxxgjtjUnit }}</span>
                <span>本月已归集数据</span>
                <span>
                  <b-progress :percent="percent" color="#fff" bgColor="#ffffff55"
                    :stroke-width="14"
                    :showText="false">
                  </b-progress>
                </span>

                <span v-if="curCount ===  0"
                  t-ellipsis title="本月您还未填报数据。">
                  本月您还未填报数据。
                </span>
                <span v-else-if="curCount < preCount / 2"
                  t-ellipsis title="本月上报数据未到一半，请注意填报。">
                  本月上报数据未到一半，请注意填报。
                </span>
                <span v-else-if="curCount >=  preCount / 2 && curCount < preCount"
                  t-ellipsis :title="`再录${preCount - curCount}条就赶超上月了哦，继续加油！`">
                  再录{{ preCount - curCount }}条就赶超上月了哦，继续加油！
                </span>
                <span v-else>
                  恭喜您已完成哦！
                </span>

                <span class="pr-20" style="text-align: right;">
                  <router-link to="/dataManage/dataExchange/gather" class="go-gather-btn">
                    采 集 >
                  </router-link>
                </span>
              </div>
              <div class="trend">
                <div class="chart-title">月度信息归集趋势</div>
                <div id="chart1" style="width: 100%;height: 100%;position: relative;">
                  <b-charts height="240px" theme="charts-theme" :options="lineChartOption"/>
                </div>
              </div>
            </div>
          </b-card>
        </div>

        <div class="right">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">信息归集日历</span>
              </div>
            </template>
            <div flex="main:center">
              <b-calendar mini :body-style="{border:'none'}" style="padding: 0 0 15px;"
                :day-style="{border:'none',borderRadius:'4px'}" @on-select-day="HandleCalendarChange">
              </b-calendar>
            </div>
          </b-card>
        </div>
      </div>
      <div class="card-layout">

        <div class="left">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">年度信息归集趋势</span>
                <div flex="main:justify cross:baseline">
                  <b-select style="width: 150px; margin-right: 30px;"
                    size="mini" clearable filterable @on-change="handleResourceChange">
                    <b-option v-for="(value, key) in directoryTransferEnum" :value="key" :key="key">
                      {{ value }}
                    </b-option>
                  </b-select>

                  <groove-select @tab-click="handleTabBtn"></groove-select>
                </div>
              </div>
            </template>

            <div id="chart2" style="width: 100%;height: 100%;position: relative;">
              <b-charts height="280px" theme="charts-theme" :options="smoothLineChartOption"/>
            </div>
          </b-card>
        </div>

        <div class="right">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding: 0, height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">信息归集记录</span>
                <div>
                  <span class="mr-10">{{ curDate }}</span>
                  <b-button type="text" @click="handleMoreBtn">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-20 pr-20">
              <b-table :columns="columns" :data="historyList.slice(1, 6)" size="small" :loading="loading">
              </b-table>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <b-modal v-model="modal" footer-hide title="信息归集记录" width="60%">
      <b-table :columns="columns" :data="moreList" size="small" class="mb-10" max-height="500">
      </b-table>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { formatDataSet } from 'bin-charts/src/utils/util'
  import {
    getDirectoryTransfer, firstLineStatis,
    byxxgjNew, ydxxgjNew,
    ndxxgjNew, xxgjNew
  } from '@/api/data-analyze/data-analysis.api'
  import GrooveSelect from '../components/GrooveSelect'

  require('bin-charts/src/theme/charts-theme')
  export default {
    name: 'Analyze',
    mixins: [commonMixin, permission],
    components: {
      GrooveSelect
    },
    data() {
      return {
        firstLineData: null, // 首行数据
        byxxgjtj: null, // 本月信息归集统计
        directoryTransferEnum: {}, // 资源信息枚举
        curDate: null,
        lineChartOption: {
          tooltip: {
            trigger: 'axis'
            // formatter: ({ seriesName, value }) => {
            //   return seriesName + ':' + value[1]
            // }
          },
          grid: {
            top: 20,
            bottom: 20
          },
          xAxis: { type: 'category', boundaryGap: false },
          yAxis: { type: 'value', axisLine: { show: false } },
          series: [{
            type: 'line',
            name: '数量',
            areaStyle: { opacity: 0.4 },
            itemStyle: { color: '#c7c7ff' },
            showSymbol: false
          }],
          dataset: formatDataSet(
            { xField: 'month', yField: 'value' },
            []
          )
        },
        smoothLineChartOption: {
          tooltip: { trigger: 'axis' },
          grid: {
            top: 20,
            bottom: 20
          },
          xAxis: { type: 'category', boundaryGap: false },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            name: '数量',
            showSymbol: false,
            smooth: true,
            itemStyle: { color: '#1ed1b8' },
            areaStyle: { opacity: 0.4 }
          }],
          dataset: formatDataSet(
            { xField: 'month', yField: 'value' },
            []
          )
        },
        columns: [
          { title: '资源信息', key: 'resourceKey', tooltip: true },
          { title: '归集数量（条）', key: 'docCount', align: 'center' }
        ],
        loading: false,
        historyList: [],
        moreList: [],
        modal: false
      }
    },
    computed: {
      firstLineUnit () { // 首行数据的单位
        let res = ''
        if (this.firstLineData) {
          res = this.firstLineData.unit
        }
        return res
      },
      byxxgjtjUnit () { // 本月信息归集统计单位
        let res = ''
        if (this.byxxgjtj) {
          res = this.byxxgjtj.unit
        }
        return res
      },
      zyxxsl () {
        let res = 0
        if (this.firstLineData) {
          res = this.firstLineData.zyxxsl.cnt
        }
        return res
      },
      ssgjzl () {
        let res = 0
        if (this.firstLineData) {
          res = this.firstLineData.ssgjzl[0].dataMergeTempValue
        }
        return res
      },
      bygjs () {
        let res = 0
        if (this.firstLineData) {
          res = this.firstLineData.bygjs[0].monthCount
        }
        return res
      },
      sygjs () {
        let res = 0
        if (this.firstLineData) {
          res = this.firstLineData.sygjs[0].preMonthCount
        }
        return res
      },
      sjwzl () {
        let res = 0
        if (this.firstLineData) {
          res = this.firstLineData.sjwzl[0].wzl.toFixed(2) + '%'
        }
        return res
      },
      preCount () { // 本月信息归集统计上月数据
        let res = 0
        if (this.byxxgjtj) {
          res = this.byxxgjtj.byxxgjtj[0].count
        }
        return res
      },
      curCount () { // 本月信息归集统计本月数据
        let res = 0
        if (this.byxxgjtj) {
          res = this.byxxgjtj.byxxgjtj[1].count
        }
        return res
      },
      percent () { // curCount / preCount
        let res = 0
        if (this.byxxgjtj) {
          res = Math.round(this.byxxgjtj.byxxgjtj[1].count / this.byxxgjtj.byxxgjtj[0].count * 100)
          if (res > 100) res = 100
        }
        return res
      }
    },
    created() {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      async init() {
        await this.getEnum()
        this.buildDefaultDataYear()
        this.buildDefaultDataMonth()
        // new api
        this.getFirstLineStatis()
        this.getByxxgjNew()
        this.getYdxxgjNew()
        this.getNdxxgjNew()
      },

      /**
       * @author haodongdong
       * @description 日历切换事件，组件创建时就会调用一次
       * @param {Object} date 包含相关日期数据的对象
       */
      HandleCalendarChange (date) {
        this.curDate = this.$util.parseTime(date.date, '{y}-{m}-{d}')
        this.getXxgjNew({
          startDate: this.curDate,
          pageSize: 20
        })
      },

      /**
       * @author haodongdong
       * @description 更多按钮回调
       */
      handleMoreBtn () {
        this.moreList = this.historyList.slice(1)
        this.modal = true
      },

      /**
       * @author haodongdong
       * @description 年度归集信息select回调
       * @param {string} val resourceKey
       */
      handleResourceChange(val) {
        let resourceKey = null
        if (val) resourceKey = val
        this.getNdxxgjNew(this.tab, resourceKey)
      },

      /**
       * @author haodongdong
       * @description 年度归集信息tab按钮回调
       * @param {number} curTab 当前tab的下标
       */
      handleTabBtn(curTab) {
        this.tab = curTab // curTab可用做计算之前的年份的偏移量
        this.getNdxxgjNew(this.tab)
      },

      getRandom(start, end, fixed = 0) {
        let differ = end - start
        let random = Math.random()
        return (start + differ * random).toFixed(fixed)
      },

      buildDefaultDataMonth() {
        const date = new Date()
        const year = date.getFullYear()
        const curMonth = date.getMonth() + 1

        const dateArr = []
        for (let i = 0; i < 6; i++) {
          let monthStr = curMonth - i
          let yearStr = date.getFullYear()
          if (monthStr <= 0) {
            yearStr -= 1
            monthStr = 13 - 1
          }
          dateArr.push({
            month: yearStr + '-' + monthStr,
            // value: this.getRandom(100, 2000)
            value: 0
          })
        }
        dateArr.reverse()
        this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, dateArr)
      },

      buildDefaultDataYear() {
        // 构建年度归集信息默认图表数据
        const date = new Date()
        const dateArr = []
        for (let i = 0; i < 12; i++) {
          let monthStr = i + 1
          if (monthStr < 10) monthStr = '0' + monthStr
          dateArr.push({
            name: date.getFullYear() + '-' + monthStr,
            // value: this.getRandom(100, 2000)
            value: 0
          })
        }
        this.smoothLineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, dateArr)
      },
      /**
       * @author haodongdong
       * @description 获取部资源枚举值。用于取出资源名称
       */
      async getEnum () {
        try {
          const res = await getDirectoryTransfer()
          this.directoryTransferEnum = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取首行数据
       */
      async getFirstLineStatis () {
        try {
          const res = await firstLineStatis()
          this.firstLineData = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取本月信息归集统计
       */
      async getByxxgjNew () {
        try {
          const res = await byxxgjNew()
          this.byxxgjtj = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取阅读信息归集趋势
       */
      async getYdxxgjNew () {
        const { startDateStr, endDateStr } = this.$util.rangeTime(-150, '{y}-{m}')
        try {
          const res = await ydxxgjNew({
            startDate: startDateStr,
            endDate: endDateStr
          })
          this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, res.ydxxgj)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取阅读信息归集趋势
       * @param {number} [offset = 0] 偏移量
       * @param {string} [resourceKey] 资源key
       */
      async getNdxxgjNew (offset = 0, resourceKey = undefined) {
        try {
          let { startDateStr, endDateStr } = this.$util.rangeTime(-360, '{y}-{m}')
          if (offset > 0) { // 不是当前年则取之前年份的01-12
            startDateStr = (new Date().getFullYear() - offset) + '-01'
            endDateStr = (new Date().getFullYear() - offset) + '-12'
          }

          const res = await ndxxgjNew({
            resourceKey,
            startDate: startDateStr,
            endDate: endDateStr
          })
          this.smoothLineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, res.ndxxgjqszy)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 获取信息归集记录
       * @param {Object} query 查询参数
       * @param {number} query.pageSize 查询数量
       * @param {string} querystartDate 开始时间
       */
      async getXxgjNew (query) {
        this.loading = true
        try {
          const res = await xxgjNew(query)
          this.historyList = res.xxgjls
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  i {
    font-style: normal
  }
  .my-gather-data {
    .header {
      .msg-tips {
        width: 100%;
        .tip-item {
          display: flex;
          align-items: center;
          width: 19%;
          padding: 20px;
          color: #fff;
          border-radius: 8px;
          .info {
            overflow: hidden;
          }
          .icon {
            background-color: #ffffff44;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 50px;
            min-height: 50px;
            border-radius: 50%;
            margin-right: 20px;
          }
          .count {
            padding-top: 10px;
            font-size: 22px;
            font-weight: 700;
          }
          &:nth-child(1) {
            background-color: #4065e0;
          }
          &:nth-child(2) {
            background-color: #35a4ff;
          }
          &:nth-child(3) {
            background-color: #6fcafa;
          }
          &:nth-child(4) {
            background-color: #18e5e6;
          }
          &:nth-child(5) {
            background-color: #1ed1b8;
          }
        }
      }
    }
    .title-text {
      font-weight: 500;
    }
    .summary {
      padding-top: 15px;
      position: relative;
      width: 40%;
      margin: 20px;
      margin-top: 0;
      background-color: #1fadf7;
      color #ffffff;
      border-radius: 8px;
      .tip {
        position: absolute;
        top: 10px;
        left: 10px;
        border-radius: 4px;
        border: 1px solid #fff;
        box-shadow: 0 0 2px #eeeeee22;
        line-height: 12px;
        padding: 4px 6px 6px 4px;
      }
      .summary-count {
        font-size: 42px;
        font-weight: 500;
        padding-right: 4px;
        padding-top: 15px;
        display: inline-block;
        height: 50px;
      }
      span {
        font-size: 13px;
        padding-left: 30px;
        line-height: 34px;
        &:nth-child(1) {
          font-size: 18px;
          font-weight: 700;
        }
        &:nth-child(2) {
          font-size: 20px;
          font-weight: 700;
        }
      }
      .go-gather-btn {
        display: inline-block;
        width: 70px;
        font-size: 13px;
        color: #fff;
        text-align: center;
        border-radius: 30px;
        background-color: rgba(64, 101, 224, 0.4)
      }
    }
    .trend {
      width: 60%;
      text-align: center;
      .chart-title {
        display: inline-block;
        background-color: #eceffc;
        border-radius: 20px;
        line-height: 30px;
        margin-bottom: 15px;
        width: 180px;
        text-align center;
      }
    }
    .header-height {
      height: 31.6px;
    }
    .card-layout {
      display: flex;
      justify-content: space-between;
      .left {
        width: calc(100% - 400px)
      }
      .right {
        width: 380px;
      }
    }
  }
</style>
