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
            <i class="count">{{counts.totalResource}}</i>
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
                  <b-button type="text" @click="modal = true">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-15 pr-15">
              <b-table :columns="departSumColumns" :data="departSumData">
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
                      <b-button type="info" plain round size="small" icon="ios-switch">
                        法人
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
                      <b-button type="text" @click="modal = true">更多>></b-button>
                    </div>
                  </div>
                </template>
                <div class="pl-20 pr-20">
                  <b-table :columns="newDepartColumns" :data="[]" size="small"></b-table>
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
                  <span class="mr-10">{{ $util.parseTime(curDate, '{y}-{m}-{d}') }}</span>
                  <b-button type="text" @click="modal = true">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-20 pr-20">
              <b-table :columns="infoCollectionColumns" :data="infoCollectionData" size="small" class="mb-10" ></b-table>
            </div>
          </b-card>
        </div>
      </div>
      <b-card head-tip divider="no" :bordered="false" radius="10px"
        :body-style="{ padding: 0, height: '310px' }" shadow="never">
        <template v-slot:header>
          <div flex="cross:center" class="header-height">
            <span class="title-text">资源信息归集趋势</span>
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
        listQuery: {
          departId: '',
          month: '2019-01'
        },
        curDate: new Date(),
        counts: {
          totalResource: '',
          totalCount: '',
          monthCount: '',
          zrpCount: '',
          foCount: '',
          gjCount: '',
          sbCount: '',
          hlCount: ''
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
        departSumColumns: [ // 部门数据归集分析
          { title: '部门名称', key: 'departName' },
          { title: '归集数量（个）', key: 'value', align: 'left' },
          { title: '归集次数（次）', key: 'trend', align: 'left' },
          { title: '占比', slot: 'percent', align: 'center', width: 170 }
        ],
        departSumData: [], // 部门数据归集分析
        newDepartColumns: [ // 最新提报部门
          { title: '部门名称', key: 'departName' },
          { title: '资源信息', key: 'value', align: 'right' }
        ],
        newDepartData: [], // 最新提报部门
        infoCollectionColumns: [ // 信息归集记录
          { title: '资源名称', key: '' },
          { title: '归集数量（个）', key: '', align: 'right' }
        ],
        infoCollectionData: [], // 信息归集记录
        monthList: [
          { value: '2020-2', label: '1月' },
          { value: '2020-3', label: '2月' },
          { value: '2020-4', label: '3月' }
        ],
        modal: false
      }
    },
    created() {
      this.searchList()
      this.listQuery.month = this.newMonth(1)
    },
    mounted() {
      this.monthList = this.newMonth(3)
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
      // 年度信息归集趋势 年份按钮切换回调
      handleTabClick (curTabIndex) {
        this.getYearCollectData(curTabIndex)
      },
      // 日历切换事件
      HandleCalendarChange (date) {
        console.log(date)
        this.curDate = date.date
      },
      // 资源信息分类统计 select 回调
      handleResChange (val) {
        console.log(val)
      },
      // 月度部门归集统计 select 回调
      handleMonDepChange (val) {
        console.log(val)
      },
      // 未填报部门 select 回调
      handleUnDepChange (val) {
        console.log(val)
      },
      // 查询所有列表
      searchList() {
        this.resetListQuery()
        this.getBaseData()
        this.getChartData()
        this.getTableData()
      },
      // async 获取基础数据
      getBaseData() {
        Promise.all([
          api.getClassifyDataCount(),
          api.getClassifyTotalCount(),
          api.getClassifyMonthCount(),
          api.getClassifyZrpCount(),
          api.getClassifyFoCount(),
          api.getMonthCollectData(this.newMonth())
        ]).then(res => {
          // 顶部数据
          this.counts = {
            totalResource: res[0].data.data.totalResource,
            totalCount: res[1].data.data.totalCount,
            monthCount: res[2].data.data.monthCount,
            zrpCount: res[3].data.data.zrpCount,
            foCount: res[4].data.data.foCount,
            gjCount: res[5].data.data.gjCount,
            sbCount: res[5].data.data.sbCount,
            hlCount: res[5].data.data.hlCount
          }
        })
      },
      // async 获取图表数据
      getChartData() {
        Promise.all([
          api.getYearCollectData(),
          api.getDeptCollectData(),
          api.getResourceData(),
          api.getSubjectData()
        ]).then(res => {
          // 月度信息归集趋势
          const dataset = formatSeries({ xField: 'month', yField: 'value', seriesField: 'legend' }, res[0].data.data)
          this.lineSmoothChartOption.dataset = dataset

          // 部门数据归集统计
          this.lineChartOption.dataset = formatDataSet({ xField: 'departName', yField: 'value' }, res[1].data.data)

          // 资源信息分类统计
          this.barChartOption.dataset = formatDataSet({ xField: 'resourceName', yField: 'value' }, res[2].data.data)

          // 主体及资源数据分析
          let subjects = []
          let subjectItems = []
          res[3].data.data.forEach(item => subjects.push({ name: item.name, value: item.value }))
          res[3].data.data.forEach(item => item.data.forEach(
            item => subjectItems.push(item))
          )
          this.pieChartOption.series = [
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
                data: subjects
              },
              {
                color: ['#4065e0', '#6ac3f7'],
                type: 'pie',
                radius: ['40%', '60%'],
                label: {
                  formatter: '{b}\n{c}'
                },
                data: subjectItems
              }
            ]
        })
      },
      // async 获取表数据
      getTableData() {
        Promise.all([
          api.getDeptCollectData(),
          api.getMonthDeptCollectData(this.newMonth())
        ]).then(res => {
          // 按部门数据归集统计
          this.departSumData = res[0].data.data
          let total = 0
          this.departSumData.forEach(item => {
            total += parseInt(item.value)
          })
          this.departSumData.forEach(item => {
            item.percent = parseInt(item.value / total * 100)
          })
          // 月度部门归集统计
          // this.monthDepartData = res[1].data.data
        })
      },
      // 获取年度信息归集趋势
      getYearCollectData (offset = 0) {
        const year = new Date().getFullYear() - offset
        api.getYearCollectData(year).then(res => {
          const dataset = formatSeries({ xField: 'month', yField: 'value', seriesField: 'legend' }, res.data.data)
          this.lineSmoothChartOption.dataset = dataset
        })
      },
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
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
