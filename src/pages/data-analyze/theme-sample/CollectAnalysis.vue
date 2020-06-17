<template>
  <div id="app" class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.totalResource}}</i>
        </span>
        </div>
        <div class="tip-item" flex>
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>数据归集总量</i>
          <i class="count">{{counts.totalCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex>
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>本月归集数据量</i>
          <i class="count">{{counts.monthCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex>
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>自然人数据总量</i>
          <i class="count">{{counts.zrpCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex>
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>法人和其他组织数据总量</i>
          <i class="count">{{counts.foCount}}</i>
        </span>
        </div>
      </div>
    </div>
    <div class="main">
      <b-row :gutter="20">
        <b-col span="16">
          <div class="area mb-20">
            <div class="title">
              <span class="text">月度信息归集趋势</span>
              <span class="float-right pr-12">
              <!--保留select下拉选择备份-->
                <!--<b-select style="width:100px" v-model="monthMsgSelect" clearable>-->
                <!--  <b-option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</b-option>-->
                <!--</b-select>-->
                <!--新添加滑块选择器-->
              <GrooveSelect></GrooveSelect>
            </span>
            </div>
            <div class="content" flex="main:justify">
              <div class="trend mg-0-auto">
                <b-charts :options="lineSmoothChartOption" theme="charts-theme" height="280px"></b-charts>
              </div>
            </div>
          </div>
          <div class="mb-20" flex="main:justify">
            <div class="area" style="width: calc(100% - 345px);">
              <div class="title">
                <span class="text">资源信息分类统计</span>
                <span class="float-right pr-12">
                <b-select style="width:100px" v-model="crowdSelect" clearable>
                  <b-option v-for="item in crowdList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
                </b-select>
              </span>
              </div>
              <div class="content" flex="main:justify">
                <div class="trend">
                  <b-charts :options="barChartOption" height="280px"></b-charts>
                </div>
              </div>
            </div>
            <div class="area" style="width: 325px;">
              <div class="title">
                <span class="text">月度部门归集统计</span>
                <span class="float-right pr-12">
              <b-select style="width:100px" v-model="monthDeptSelect" clearable>
                <b-option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
              </b-select>
            </span>
              </div>
              <div class="content">
                <b-table :columns="monthDepartColumns" :data="monthDepartData"></b-table>
              </div>
            </div>
          </div>
          <div class="mb-20">
            <div class="area">
              <div class="title">
                <span class="text">部门数据归集统计分析</span>
                <span class="float-right">
                <b-button type="text" @click="modal = true">更多>></b-button>
              </span>
              </div>
              <div class="p15">
                <b-table :columns="departSumColumns" :data="departSumData" stripe border></b-table>
              </div>
            </div>
          </div>
        </b-col>
        <b-col span="8">
          <div class="area mb-20">
            <div class="title" flex="main:justify">
              <span class="text">本月数据分析</span>
            </div>
            <div class="current-tip p15" flex="main:justify; box:mean">
              <div class="current-tip-item" flex="dir:top">
                <span class="g-font">数据归集量</span>
                <span class="b-num">{{counts.gjCount}}</span>
              </div>
              <div class="border-right"></div>
              <div class="current-tip-item" flex="dir:top">
                <span class="g-font">数据归集量</span>
                <span class="b-num">{{counts.sbCount}}</span>
              </div>
              <div class="border-right"></div>
              <div class="current-tip-item" flex="dir:top">
                <span class="g-font">数据归集量</span>
                <span class="b-num">{{counts.hlCount}}</span>
              </div>
            </div>
          </div>
          <div class="area mb-20">
            <div class="title" flex="main:justify">
              <span class="text">按部门数据归集统计</span>
            </div>
            <div class="trend p15">
              <b-charts height="280px" theme="charts-theme" :options="lineChartOption"/>
            </div>
          </div>
          <div class="area mb-20">
            <div class="title" flex="main:justify">
              <span class="text">未填报部门</span>
              <span class="float-right pr-12">
              <b-select style="width:100px" v-model="monthUnGetSelect" clearable>
                <b-option v-for="item in monthList.slice(0,6)" :value="item.value"
                          :key="item.value">{{ item.label }}</b-option>
              </b-select>
            </span>
            </div>
            <div class="resource-list">
              <p>资源信息</p>
              <ul class="list">
                <li class="list-item" v-for="(item, index) in unGetDeparts.slice(0,6)" :key="index">{{ item.departName
                  }}
                </li>
              </ul>
            </div>
          </div>
          <div class="area mb-20">
            <div class="title" flex="main:justify">
              <span class="text">主体及资源数据分类数据分析</span>
            </div>
            <div class="trend p15">
              <b-charts :options="pieChartOption" height="280px"></b-charts>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-modal v-model="modal" footer-hide>
      <p>我是弹窗内容...</p>
      <p>我是弹窗内容...</p>
      <p>我是弹窗内容...</p>
    </b-modal>
  </div>
</template>

<script>
  import * as api from '../../../api/data-manage/collect-analysis.api.js'
  import GrooveSelect from '../../data-manage/data-exchange/components/Groove/GrooveSelect'
  import { formatDataSet, formatSeries } from 'bin-charts/src/utils/util'

  require('bin-charts/src/theme/charts-theme')

  export default {
    name: 'CollectAnalysis',
    data() {
      return {
        listQuery: {
          departId: '',
          month: '2019-01'
        },
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
        lineSmoothChartOption: {},
        lineChartOption: {},
        barChartOption: {},
        pieChartOption: {},
        monthDepartColumns: [
          { title: '部门', key: 'departName' },
          { title: '归集数量', key: 'value' }
        ],
        monthDepartData: [],
        departSumColumns: [
          { title: '部门', key: 'departName', width: 300 },
          { title: '归集数量', key: 'value' },
          { title: '占比', key: 'percent' },
          {
            title: '趋势分析',
            key: 'trend',
            render: (h, params) => {
              return h('b-button', {
                props: {
                  type: 'primary',
                  size: 'mini',
                  plain: true
                },
                nativeOn: {
                  click: (e) => {
                    this.modal = true
                    console.log(e)
                  }
                }
              }, '趋势')
            }
          }
        ],
        departSumData: [
          { departName: '部门1', value: 1200, percent: '10%' },
          { departName: '部门1', value: 1200, percent: '10%' },
          { departName: '部门1', value: 1200, percent: '10%' },
          { departName: '部门1', value: 1200, percent: '10%' },
          { departName: '部门1', value: 1200, percent: '10%' },
          { departName: '部门1', value: 1200, percent: '10%' }
        ],
        crowdSelect: '',
        crowdList: [{ label: '自然人', value: 'zrp' }, { label: '法人或其他', value: 'fo' }],
        monthMsgSelect: '',
        monthDeptSelect: '',
        monthUnGetSelect: '',
        monthList: [
          { value: '2020-2', label: '1月' },
          { value: '2020-3', label: '2月' },
          { value: '2020-4', label: '3月' }
        ],
        selected: '', // 三选按钮
        yearList: [],
        unGetDeparts: [
          { departId: 'aabbcc', departName: '市发改委' }
        ],
        modal: false
      }
    },
    created() {
      this.searchList()
      this.createYearList()
      this.listQuery.month = this.newMonth(1)
    },
    mounted() {
      this.monthList = this.newMonth(3)
    },
    methods: {
      choose(index) {
        this.selected = index
      },
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
      // 生成近三年列表
      createYearList() {
        this.yearList = []
        let arr = [0, 1, 2]
        let year = new Date().getFullYear()
        arr.forEach(
          item => this.yearList.push({ label: year - item + '年', value: year - item })
        )
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
          this.lineSmoothChartOption = {
            tooltip: { trigger: 'axis' },
            color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
            legend: {},
            xAxis: {
              type: 'category',
              boundaryGap: false,
              splitLine: { show: true },
              axisLabel: { formatter: '{value} 月' }
            },
            yAxis: {
              type: 'value',
              splitLine: { show: true }
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
            dataset
          }

          // 部门数据归集统计
          this.lineChartOption = {
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
            series: { type: 'line', areaStyle: { opacity: 0.45 }, color: '#4065e0' },
            dataset: formatDataSet({ xField: 'departName', yField: 'value' }, res[1].data.data)
          }

          // 资源信息分类统计
          this.barChartOption = {
            color: '#48c9b0',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '6%',
              right: '6%',
              bottom: '3%',
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
            dataset: formatDataSet({ xField: 'resourceName', yField: 'value' }, res[2].data.data)
          }

          // 主体及资源数据分析
          let subjects = []
          let subjectItems = []
          res[3].data.data.forEach(item => subjects.push({ name: item.name, value: item.value }))
          res[3].data.data.forEach(item => item.data.forEach(
            item => subjectItems.push(item))
          )
          this.pieChartOption = {
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
          }
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
            item.percent = parseInt(item.value / total * 100) + '%'
          })
          // 月度部门归集统计
          this.monthDepartData = res[1].data.data
          // 未填报部门
          this.unGetDeparts = [
            { departId: 'aabbcc', departName: '市发改委' },
            { departId: 'aabbcc', departName: '环保办' },
            { departId: 'aabbcc', departName: '市发改委' },
            { departId: 'aabbcc', departName: '环保办' },
            { departId: 'aabbcc', departName: '市发改委' },
            { departId: 'aabbcc', departName: '市发改委' }
          ]
        })
      },
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
      }
    },
    components: { GrooveSelect }
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
          // line-height: 40px
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
  }

</style>
