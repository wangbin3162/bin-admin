<template>
  <div id="app" class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="资源信息数量（条）">资源信息数量（条）</i>
            <i class="count">{{counts.cnt}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="数据归集总量（条）">数据归集总量（条）</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="本月归集数据量（条）">本月归集数据量（条）</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="自然人数据总量（人）">自然人数据总量（人）</i>
            <i class="count">{{counts.zrpCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="法人和其他组织数据总量（个）">法人和其他组织数据总量（个）</i>
            <i class="count">{{counts.foCount}}</i>
          </span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="card-layout mb-20">
        <div class="left">
          <b-card head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding: 0, height: '310px' }" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">部门数据归集统计分析</span>
                <div flex="cross:center">
                  <quick-date-select @tab-click="handleTabClick"></quick-date-select>
                  <!-- 如果追加appendToBody的话第一次点击会直接关闭 -->
                  <b-date-picker type="daterange" placement="bottom-end"
                    class="ml-10 mr-10" size="small"
                    placeholder="请选择">
                   </b-date-picker>
                  <b-button type="text" @click="handleMoreBtn('aaa')">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-15 pr-15">
              <b-table :columns="bmsjgjfxColumns" :data="bmsjgjfxData">
                <template v-slot:percent="{ row }">
                  {{ row.percent }}%
                  <b-progress :percent="row.percent"
                    :showText="false">
                  </b-progress>
                </template>
              </b-table>
            </div>
          </b-card>
        </div>
        <div class="right">
          <b-card head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding:0, height:'310px' }" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">信息归集日历</span>
              </div>
            </template>
            <div flex="main:center">
              <b-calendar mini :body-style="{ border: 'none' }" style="padding: 0 0 15px;"
                :day-style="{ border:'none', borderRadius:'4px' }" @on-select-day="HandleCalendarChange">
              </b-calendar>
            </div>
          </b-card>
        </div>
      </div>
      <div class="card-layout mb-20">
        <div class="left">
          <div flex="main:justify">
            <div style="width: calc(100% - 345px);">
              <b-card head-tip divider="no" :bordered="false" radius="10px"
                :body-style="{ padding: 0, height: '310px' }" shadow="never">
                <template v-slot:header>
                  <div flex="main:justify cross:center" class="header-height">
                    <span class="title-text">资源信息分类统计</span>
                    <div>
                      <b-button type="info" plain round size="small" icon="ios-switch"
                        @click="handlePersonClassBtn">
                        {{ query.personClass === 'nat' ? '自然人' : '法人' }}
                      </b-button>
                    </div>
                  </div>
                </template>
                <div>
                  <b-charts :options="barChartOption" height="280px"></b-charts>
                </div>
              </b-card>
            </div>
            <div style="width: 325px;">
              <b-card head-tip divider="no" :bordered="false" radius="10px"
                :body-style="{ padding: 0, height: '310px' }" shadow="never">
                <template v-slot:header>
                  <div flex="main:justify cross:center" class="header-height">
                    <span class="title-text">最新提报部门</span>
                    <div>
                      <b-button type="text" @click="handleMoreBtn('zxtbbm')">更多>></b-button>
                    </div>
                  </div>
                </template>
                <div class="pl-20 pr-20">
                  <b-table :columns="zxtbbmColumns" :data="zxtbbmData" size="small">
                    <template v-slot:departId="{ row }">
                      <div class="t-ellipsis" :title="compTransferEnum[row.departId]">
                        {{ compTransferEnum[row.departId] }}
                      </div>
                    </template>

                    <template v-slot:resourceKey="{ row }">
                      <div class="t-ellipsis" :title="directoryTransferEnum[row.resourceKey]">
                        {{ directoryTransferEnum[row.resourceKey] }}
                      </div>
                    </template>
                  </b-table>
                </div>
              </b-card>
            </div>
          </div>
        </div>
        <div class="right">
          <b-card head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding: 0, height: '310px' }" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">信息归集记录</span>
                <div>
                  <span class="mr-10">{{ curDate }}</span>
                  <b-button type="text" @click="handleMoreBtn('xxgjjl')">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-20 pr-20">
              <b-table :columns="xxgjjlColumns" :data="xxgjjlData.slice(1)" size="small" class="mb-10" :loading="xxgjjlLoading">
                <template v-slot:resourceKey="{ row }">
                  <div class="t-ellipsis" :title="directoryTransferEnum[row.resourceKey]">
                    {{ directoryTransferEnum[row.resourceKey] }}
                  </div>
                </template>

                <template v-slot:count="{ row }">
                  {{ row.count }}
                </template>
              </b-table>
            </div>
          </b-card>
        </div>
      </div>
      <b-card head-tip divider="no" :bordered="false" radius="10px"
        :body-style="{ padding: 0, height: '310px' }" shadow="never">
        <template v-slot:header>
          <div flex="main:justify cross:center" class="header-height">
            <span class="title-text">资源信息归集趋势</span>

            <div>
              <b-date-picker type="daterange" placement="bottom-end" placeholder="Select date"
                :value="resInfoDate"
                format="yyyy-MM" @on-change="handleResDateChange">
              </b-date-picker>
            </div>
          </div>
        </template>
        <div style="width: 100%; height: 100%; position: relative;">
          <b-charts :options="lineSmoothChartOption" theme="charts-theme" height="280px"></b-charts>
        </div>
      </b-card>
    </div>
    <b-modal v-model="modal" footer-hide title="部门数据归集统计分析" width="60%">
      <b-table :columns="columns" :data="list" size="small" class="mb-10" >
      </b-table>
    </b-modal>
  </div>
</template>

<script>
  import * as api from '../../../api/data-manage/collect-analysis.api.js'
  import QuickDateSelect from '../components/QuickDateSelect'
  import { formatDataSet, formatSeries } from 'bin-charts/src/utils/util'

  require('bin-charts/src/theme/charts-theme')

  export default {
    name: 'CollectAnalysis',
    components: { QuickDateSelect },
    data() {
      return {
        directoryTransferEnum: {}, // 资源信息枚举
        compTransferEnum: {}, // 部门信息枚举
        departTabDate: [], // 部门数据归集统计分析tab时间数据
        departDate: [], // 部门数据归集统计分析日期选择框
        curDate: this.$util.parseTime(new Date(), '{y}-{m}-{d}'),
        resInfoDate: [], // 资源信息归集趋势日期选择框
        query: {
          startDate: '',
          endDate: '',
          pageSize: 5,
          pageNo: 1,
          personClass: 'nat'
        },
        counts: {
          cnt: '',
          totalCount: '',
          monthCount: '',
          zrpCount: '',
          foCount: ''
        },
        lineSmoothChartOption: {
          tooltip: { trigger: 'axis' },
            color: ['#3cd7c1', '#a2a4fe', '#6fcafa', '#18e5e6', '#1ed1b8'],
            grid: {
              top: '12%',
              left: '6%',
              right: '3%',
              bottom: '12%'
            },
            legend: {
              // bottom: 0
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              splitLine: { show: true },
              axisLabel: { formatter: '{value} 月' }
            },
            yAxis: {
              name: '（个）        ',
              type: 'value',
              splitLine: { show: true },
              nameTextStyle: {
                color: '#000000'
              }
            },
            series: [
              {
                smooth: true,
                type: 'line',
                showSymbol: false,
                areaStyle: { opacity: 0.45 }
              },
              {
                smooth: true,
                type: 'line',
                showSymbol: false,
                areaStyle: { opacity: 0.45 }
              }
            ],
            dataset: { source: [
              ['month', '自然人', '法人及其他组织'],
              ['1', '0', '0'],
              ['2', '0', '0'],
              ['3', '0', '0'],
              ['4', '0', '0'],
              ['5', '0', '0'],
              ['6', '0', '0'],
              ['7', '0', '0'],
              ['8', '0', '0'],
              ['9', '0', '0'],
              ['10', '0', '0'],
              ['11', '0', '0'],
              ['12', '0', '0']
            ] }
        },
        lineChartOption: {
          tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: '#b8b8b8'
                }
              },
              axisLabel: {
                color: '#333'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#eee'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#b8b8b8'
                }
              },
              axisLabel: {
                color: '#333'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#eee'
                }
              }
            },
            series: { type: 'line', areaStyle: { opacity: 0.45 }, color: '#a2a4fe' },
            dataset: { source: [
              ['departName', 'value'],
              ['部门1', '0'],
              ['部门2', '0'],
              ['部门3', '0'],
              ['部门4', '0']
            ] }
        },
        barChartOption: {
          color: '#3cd7c1',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: '3%',
              left: '3%',
              right: '3%',
              bottom: '1%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#b8b8b8'
                }
              },
              axisLabel: {
                color: '#333'
              }
            },
            yAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#b8b8b8'
                }
              },
              axisLabel: {
                color: '#333'
              }
            },
            series: {
              type: 'bar'
            },
            dataset: { source: [
              ['resourceName', 'value'],
              ['基本信息', '0'],
              ['业务信息', '0'],
              ['司法信息', '0'],
              ['行政执法信息', '0'],
              ['公共事业信息', '0'],
              ['信用评级信息', '0'],
              ['其他信息', '0']
            ] }
        },
        pieChartOption: {
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '20%',
              top: '20%'
            },
            series: [
              {
                color: ['#607de6', '#92d2fa'],
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                label: {
                  formatter: '{b}\n{c}',
                  position: 'inner'
                },
                labelLine: {
                  show: false
                },
                data: [
                  { name: '自然人', value: '0' },
                  { name: '法人和其他组织', value: '0' }
                ]
              },
              {
                color: ['#4065e0', '#6ac3f7'],
                type: 'pie',
                radius: ['40%', '60%'],
                label: {
                  formatter: '{b}\n{c}'
                },
                data: [
                  { name: '基础信息', value: '0' },
                  { name: '行政信息', value: '0' },
                  { name: '基础信息', value: '0' },
                  { name: '行政信息', value: '0' }
                ]
              }
            ]
        },
        columns: [], // 弹框通用
        list: [], // 弹框通用
        bmsjgjfxColumns: [ // 部门数据归集分析
          { title: '部门名称', key: 'departName' },
          { title: '归集数量（个）', key: 'value', align: 'left' },
          { title: '完整率(%)', key: 'trend', align: 'left' },
          { title: '占比', slot: 'percent', align: 'center' }
        ],
        bmsjgjfxData: [], // 部门数据归集分析
        zxtbbmColumns: [ // 最新提报部门
          { title: '部门名称', slot: 'departId' },
          { title: '资源信息', slot: 'resourceKey', align: 'right' }
        ],
        zxtbbmData: [], // 最新提报部门
        xxgjjlColumns: [ // 信息归集记录
          { title: '资源名称', slot: 'resourceKey' },
          { title: '归集数量（个）', slot: 'count', align: 'right' }
        ],
        xxgjjlData: [], // 信息归集记录
        bmsjgjfxLoading: false,
        zxtbbmLoadig: false,
        xxgjjlLoading: false,
        modal: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 生成当前年月
      newMonth(param = 1) {
        if (param === 1) {
          return new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
        } else if (param === 3) {
          let getDate = (length) => new Date().getFullYear() + '-' + (new Date().getMonth() + length)
          let arr = [0, 1, 2]
          let reArr = []
          arr.forEach((item) => reArr.push({ value: getDate(item), label: (new Date().getMonth() + item - 1 + '月') }))
          return reArr
        }
      },
      // 更多按钮回调
      handleMoreBtn (type) {
        console.log(type)
        // switch (type) {
        //   case 'aaa':

        //     break
        //   case 'xxgjjl':
        //     this.columns = this.
        //     .break
        //   case 'zxtbbm':

        //     break

        //   default:
        //     break
        // }
        // this.modal = true
      },
      // 年度信息归集趋势 年份按钮切换回调
      handleTabClick (curTabIndex) {
        let dateArr = []
        if (curTabIndex === 0) {
          dateArr = this.timeHandler(7, '{y}-{m}-{d}')
        }
        if (curTabIndex === 1) {
          dateArr = this.timeHandler(30, '{y}-{m}-{d}')
        }
        if (curTabIndex === 2) {
          dateArr = this.timeHandler(365, '{y}-{m}-{d}')
        }
        console.log(dateArr)
      },
      // 日历切换事件
      HandleCalendarChange (date) {
        this.curDate = this.$util.parseTime(date.date, '{y}-{m}-{d}')
        this.query.startDate = this.curDate
        this.getXxgjjl(this.query)
      },
      // 资源信息分类统计 类别按钮回调
      handlePersonClassBtn () {
        if (this.query.personClass === 'nat') {
          this.query.personClass = 'leg'
        } else {
          this.query.personClass = 'nat'
        }
      },
      // 资源信息归集趋势时间选择器回调
      handleResDateChange (date) {
        if (date[0] === '' && date[1] === '') {
          date = this.timeHandler(365)
          this.resInfoDate = date
        }
        this.query.startDate = date[0]
        this.query.endDate = date[1]
        this.getResInfoCollection(this.query)
      },
      // 获取基础数据
      getBaseData() {
        Promise.all([
          api.getClassifyDataCount(),
          api.getClassifyTotalCount(),
          api.getClassifyMonthCount(),
          api.getClassifyZrpCount(),
          api.getClassifyFoCount()
        ]).then(([zyxxsl, sjgjzl, bygjsjl, zrpcount, focount]) => {
          // 顶部数据
          this.counts = {
            cnt: zyxxsl.data.data.cnt,
            totalCount: sjgjzl.data.data.totalCount,
            monthCount: bygjsjl.data.data.monthCount,
            zrpCount: zrpcount.data.data.zrpCount,
            foCount: focount.data.data.foCount
          }
        })
      },
      // 获取图表数据
      getChartData() {
        // 获取资源信息分类统计
        this.query.startDate = this.resInfoDate[0]
        this.query.endDate = this.resInfoDate[1]
        this.query.personClass = 'nat'
        this.getResInfoClassif(this.query)
        // 获取资源信息归集趋势
        this.query.startDate = this.resInfoDate[0]
        this.query.endDate = this.resInfoDate[1]
        this.getResInfoCollection(this.query)
      },
      // 获取资源信息分类统计图表数据
      async getResInfoClassif (query) {
        try {
          const res = await api.getZyxxfltjsj(query)
          const resEnum = {
            C01: '基本信息',
            C02: '业务信息',
            C03: '司法信息',
            C04: '行政执法信息',
            C05: '公用事业信息',
            C06: '信用评价信息',
            C07: '其他信息'
          }
          res.forEach(item => {
            item.left = resEnum[item.left]
          })
          this.barChartOption.dataset = formatDataSet({ xField: 'left', yField: 'count' }, res)
        } catch (error) {
          console.error(error)
        }
      },
      // 获取资源信息归集趋势图标数据
      async getResInfoCollection (query) {
        try {
          const [fr, zrr] = await Promise.all([
            api.getFrzzxxgjqs(query),
            api.getZrpxxgjqs(query)
          ])
          const source = [
            {
              legend: '自然人',
              data: zrr
            },
            {
              legend: '法人及其他组织',
              data: fr
            }
          ]
          const dataset = formatSeries({ xField: 'month', yField: 'count', seriesField: 'legend' }, source)
          this.lineSmoothChartOption.dataset = dataset
        } catch (error) {
          console.error(error)
        }
      },
      // 获取表数据
      async getTableData() {
        this.getBmsjgjfx(this.query)
        // this.getZxtbbm(this.query)
      },
      async getBmsjgjfx (query) {
        this.bmsjgjfxLoading = true
        try {
          const res = await api.getBmsjgjfx(query)
          console.log(res)
          this.bmsjgjfxData = res
        } catch (error) {
          console.error(error)
        }
        this.bmsjgjfxLoading = false
      },
      // 获取信息归集记录
      async getXxgjjl (query) {
        this.xxgjjlLoading = true
        try {
          const res = await api.getXxgjjl(query)
          this.xxgjjlData = res
        } catch (error) {
          console.error(error)
        }
        this.xxgjjlLoading = false
      },
      // 获取最新提报部门
      async getZxtbbm (query) {
        this.zxtbbmLoadig = true
        try {
          const res = await api.getZxtbbm(query)
          this.zxtbbmData = res
        } catch (error) {
          console.error(error)
        }
        this.zxtbbmLoadig = false
      },
      async getEnum () {
        try {
          const [res, comp] = await Promise.all([
            api.getDirectoryTransfer(),
            api.getCompTransfer()
          ])
          this.directoryTransferEnum = res
          this.compTransferEnum = comp
        } catch (error) {
          console.error(error)
        }
      },
      // 处理时间，取多天之前。例如一月前 30 三月前 90类似情况。
      timeHandler(days, mode = '{y}-{m}') {
        const start = new Date()
        const end = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)

        const startDate = this.$util.parseTime(start, mode)
        const endDate = this.$util.parseTime(end, mode)

        return [startDate, endDate]
      },
      // 查询所有列表
      async init() {
        this.resInfoDate = this.timeHandler(365)
        await this.getEnum()
        this.getBaseData()
        this.getTableData()
        this.getChartData()
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
            display: inline-block;
            min-width: 50px;
            min-height: 50px;
            border-radius: 50%;
            margin-right: 20px;
          }

          .count {
            padding-top: 10px;
            font-size: 26px;
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
    .main {
      width: 100%
      height: 100%

      .area {
        border-radius: 8px
        background-color: #fff
        .resource-list {
          padding-left: 20px
          padding-bottom: 20px
          p {
            color #c5c8ce
            font-size: 12px
          }
          .list-item {
            font-size: 14px
            line-height: 26px
            font-weight: 700
          }
        }
        .title {
          font-size: 18px
          padding: 10px 20px
          font-weight: 700
          .text {
            padding-top: 5px
          }
          .my-date-picker {
            width 160px
            display inline-block
            padding 4px
            padding-right: 20px
          }
          .filter-select {
            width: 450px
            margin-right: 20px
            padding-top: 20px
          }
          .float-right {
            float: right
          }
        }
        .content {
          padding 0 20px 20px
        }
        .current-tip {
          .border-right {
            position relative
            &::after {
              position absolute
              right: 50%
              top: 50%
              transform translate(-50%, -50%)
              content ''
              display inline-block
              width: 1px
              height: 40px
              background-color: #9e9e9e
            }
          }
          .current-tip-item {
            text-align center
            width: 100px
            .g-font {
              color #9e9e9e
            }
            .b-num {
              font-size: 26px
              color #0b87ed
              font-weight: 700
              padding-top: 5px
            }
          }
        }
      }
      .trend {
        width: 100%
        position relative
        .chart-title {
          position absolute
          left 50%
          transform translateX(-50%)
          background-color: #eceffc
          border-radius: 20px
          line-height: 40px
          width: 180px
          text-align center
        }
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
