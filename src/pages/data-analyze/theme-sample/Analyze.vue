<template>
  <div class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_xxsl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="资源信息数量（条）">资源信息数量（条）</i>
            <i class="count">{{counts.totalResource}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="数据归集总量（条）">数据归集总量（条）</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjsj.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="本月归集数据量（条）">本月归集数据量（条）</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_sjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="自然人数据总量（人）">上月归集数据量（人）</i>
            <i class="count">{{counts.preMonthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_frsjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>数据完整率</i>
            <i class="count">{{counts.completeRate}}%</i>
          </span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="card-layout mb-20">
        <!--本月信息归集统计-->
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
                <span><i class="summary-count">{{counts.curCount}}</i>条</span>
                <span>本月已归集数据</span>
                <span>
                  <b-progress :percent="counts.percent" color="#fff" bgColor="#ffffff55"
                    :stroke-width="14"
                    :showText="false">
                  </b-progress>
                </span>

                <span v-if="counts.curCount ===  0"
                  t-ellipsis title="本月您还未填报数据。">
                  本月您还未填报数据。
                </span>
                <span v-else-if="counts.curCount <  counts.preCount / 2"
                  t-ellipsis title="本月上报数据未到一半，请注意填报。">
                  本月上报数据未到一半，请注意填报。
                </span>
                <span v-else-if="counts.curCount >=  counts.preCount / 2 && counts.curCount < counts.preCount"
                  t-ellipsis :title="`再录${counts.preCount - counts.curCount}条就赶超上月了哦，继续加油！`">
                  再录{{counts.preCount - counts.curCount}}条就赶超上月了哦，继续加油！
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
        <!--信息归集日历-->
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
        <!-- 年度信息归集趋势-->
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
                  <!-- 年份切换tab -->
                  <groove-select @tab-click="handleTabBtn"></groove-select>
                </div>
              </div>
            </template>

            <div id="chart2" style="width: 100%;height: 100%;position: relative;">
              <b-charts height="280px" theme="charts-theme" :options="smoothLineChartOption"/>
            </div>
          </b-card>
        </div>
        <!--信息归集历史-->
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
              <b-table :columns="columns" :data="historyList.slice(0, 6)" size="small" :loading="loading">
                <template v-slot:resourceKey="{ row }">
                  {{ directoryTransferEnum[row.resourceKey] }}
                </template>
              </b-table>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <b-modal v-model="modal" footer-hide title="信息归集记录" width="60%">
      <b-table :columns="columns" :data="moreList" size="small" class="mb-10" max-height="500">
        <template v-slot:resourceKey="{ row }">
          <div class="t-ellipsis" :title="directoryTransferEnum[row.resourceKey]">
            {{ directoryTransferEnum[row.resourceKey] }}
          </div>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { formatDataSet } from 'bin-charts/src/utils/util'
  import * as api from '../../../api/data-analyze/data-analysis.api'
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
        directoryTransferEnum: {}, // 资源信息枚举
        yearsText: [],
        resources: [],
        curDate: null,
        listQuery: {
          departId: '',
          startDate: '',
          endDate: '',
          resourceKey: null
        },
        counts: {
          totalResource: '',
          totalCount: '',
          monthCount: '',
          preMonthCount: '',
          completeRate: 0.0,
          curCount: '',
          preCount: '',
          percent: 0.90
        },
        lineChartOption: {
          tooltip: { trigger: 'axis' },
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
            { xField: 'name', yField: 'value' },
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
            { xField: 'name', yField: 'value' },
            []
          )
        },
        columns: [
          { title: '资源信息', slot: 'resourceKey', tooltip: true },
          { title: '归集数量（条）', key: 'count', align: 'center' }
        ],
        loading: false,
        historyList: [],
        moreList: [],
        modal: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
      },
      // 日历切换事件
      HandleCalendarChange (date) {
        this.curDate = this.$util.parseTime(date.date, '{y}-{m}-{d}')
        // 2.4.10 信息归集历史
        this.getDataHistory({
          startDate: this.curDate,
          pageSize: 20
        })
      },
      // 更多按钮回调
      handleMoreBtn () {
        this.moreList = this.historyList.slice(0)
        this.modal = true
      },
      // 年度归集信息select回调
      handleResourceChange(val) {
        if (val) {
          this.listQuery.resourceKey = val
        } else {
          this.listQuery.resourceKey = null
        }
        this.getYearData(this.tab)
      },
      // 年度归集信息tab按钮回调
      handleTabBtn(curTab) {
        this.tab = curTab // curTab可用做计算之前的年份的偏移量
        this.getYearData(curTab)
      },
      // 查询所有数据
      searchAll() {
        this.resetListQuery()
        // 2.4.1 资源信息数量
        api.getZyxxsl(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalResource = res.data.data.data.cnt
          }
        })
        // 2.4.2 数据归集总量
        api.getSjgjzl(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalCount = res.data.data.data[0].value
          }
        })
        // 2.4.3 本月归集数据量
        api.getBygjsjl(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.monthCount = res.data.data.data[0].monthCount
          }
        })
        // 2.4.4 上月归集数据量
        api.getSygjsjl(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.preMonthCount = res.data.data.data[0].preMonthCount
          }
        })
        // 2.4.5 数据完整率
        api.getSjwzl(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.completeRate = res.data.data.data[0].completeRate.toFixed(1)
          }
        })
        // 2.4.6 本月信息归集统计
        api.getByxxgjtj(this.listQuery).then(res => {
          if (res.data.code === '0') {
            const [{ count: preCount }, { count: curCount }] = res.data.data.data
            this.counts.preCount = Number(preCount)
            this.counts.curCount = Number(curCount)
            this.counts.percent = Math.round(this.counts.curCount / this.counts.preCount * 100)
            if (this.counts.percent > 100) this.counts.percent = 100
          }
        })
        // // 2.4.7 月度信息归集趋势
        this.getMonthData()
        // // 年度信息归集趋势
        this.getYearData()
      },
      // 获取信息归集记录
      async getDataHistory (query) {
        this.loading = true
        try {
          const res = await api.getDataHistory(query)
          if (res.data.successful) {
            this.historyList = res.data.data.data
          }
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      // 2.4.7 月度信息归集趋势
      getMonthData() {
        // 取当前时间半年前
        const [startDate, endDate] = this.timeHandler(150)
        this.listQuery.startDate = startDate
        this.listQuery.endDate = endDate

        api.getMonthData(this.listQuery).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data.data
            this.lineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, data)
          }
        })
      },
      // 获取年度归集趋势
      getYearData(offset = 0) {
        // 如果是当前年则取当前时间一年前
        let [startDate, endDate] = this.timeHandler(360)
        if (offset > 0) { // 不是当前年则取之前年份的01-12
          startDate = (new Date().getFullYear() - offset) + '-01'
          endDate = (new Date().getFullYear() - offset) + '-12'
        }
        this.listQuery.startDate = startDate
        this.listQuery.endDate = endDate

        api.getYearData(this.listQuery).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data.data
            this.smoothLineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, data)
          }
        })
      },
      // 处理时间，取多天之前。例如一月前 30 三月前 90类似情况。
      timeHandler(days) {
        let getDateStr = (date) => {
          const year = date.getFullYear()
          let month = date.getMonth() + 1
          if (month < 10) month = '0' + month // 小于10补零
          return year + '-' + month
        }

        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)

        const startDate = getDateStr(start)
        const endDate = getDateStr(end)

        getDateStr = null

        return [startDate, endDate]
      },
      getRandom(start, end, fixed = 0) {
        let differ = end - start
        let random = Math.random()
        return (start + differ * random).toFixed(fixed)
      },
      // 构建月度归集信息默认图表数据
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
            name: yearStr + '-' + monthStr,
            // value: this.getRandom(100, 2000)
            value: 0
          })
        }
        dateArr.reverse()
        this.lineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, dateArr)
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
        this.smoothLineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, dateArr)
      },
      /**
       * @author haodongdong
       * @description 获取部资源枚举值。用于取出资源名称
       */
      async getEnum () {
        try {
          const res = await api.getDirectoryTransfer()
          this.directoryTransferEnum = res
        } catch (error) {
          console.error(error)
        }
      },
      // 一些初始化操作
      async init() {
        await this.getEnum()
        this.buildDefaultDataYear()
        this.buildDefaultDataMonth()
        this.searchAll()
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
