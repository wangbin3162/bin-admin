<template>
  <div id="app" class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_xxsl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="资源信息数量（条）">资源信息数量（条）</i>
            <i class="count">{{counts.cnt}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="数据归集总量（条）">数据归集总量（条）</i>
            <i class="count">{{counts.dataMergeContentValue}}</i>
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
            <i t-ellipsis title="自然人数据总量（人）">自然人数据总量（人）</i>
            <i class="count">{{counts.zrpCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_frsjzl.png" alt="">
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
                  <quick-date-select @tab-click="handleTabClick" :selected="tabSelected"></quick-date-select>
                  <!-- 如果追加appendToBody的话第一次点击会直接关闭 -->
                  <b-date-picker type="daterange" placement="bottom-end"
                    class="ml-10 mr-10" size="small"
                    format="yyyy-MM-dd" @on-change="handleDepartDateChange"
                    placeholder="请选择">
                   </b-date-picker>
                  <b-button type="text" :disabled="bmsjgjfxLoading" @click="handleMoreBtn('bmsjgjfx', '部门数据归集统计分析')">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-15 pr-15">
              <b-table :columns="bmsjgjfxColumns" :data="bmsjgjfxData.slice(2, 7)" :loading="bmsjgjfxLoading">
                <template v-slot:departId="{ row }">
                  <div class="t-ellipsis" :title="compTransferEnum[row.key]">
                    {{ compTransferEnum[row.key] }}
                  </div>
                </template>

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
                      <b-button type="primary" plain round size="small" icon="ios-switch"
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
                      <b-button type="text" :disabled="zxtbbmLoadig" @click="handleMoreBtn('zxtbbm', '最新提报部门')">更多>></b-button>
                    </div>
                  </div>
                </template>
                <div class="pl-20 pr-20">
                  <b-table :columns="zxtbbmColumns" :data="zxtbbmData.slice(0, 6)" size="small" :loading="zxtbbmLoadig">
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
                  <b-button type="text" :disabled="xxgjjlLoading" @click="handleMoreBtn('xxgjjl', '信息归集记录')">更多>></b-button>
                </div>
              </div>
            </template>
            <div class="pl-20 pr-20">
              <b-table :columns="xxgjjlColumns" :data="xxgjjlData.slice(1, 7)" size="small" class="mb-10" :loading="xxgjjlLoading">
                <template v-slot:resourceKey="{ row }">
                  <div class="t-ellipsis" :title="directoryTransferEnum[row.key]">
                    {{ directoryTransferEnum[row.key] }}
                  </div>
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
    <b-modal v-model="modal" footer-hide :title="title" width="60%">
      <b-table :columns="columns" :data="list" size="small" class="mb-10" max-height="500">
        <template v-slot:departId="{ row }">
          <div class="t-ellipsis" :title="row.departId === 'other' ? '其他' : compTransferEnum[row.departId]">
            {{ row.departId === 'other' ? '其他' : compTransferEnum[row.departId] }}
          </div>
        </template>

        <template v-slot:resourceKey="{ row }">
          <div class="t-ellipsis" :title="directoryTransferEnum[row.resourceKey]">
            {{ directoryTransferEnum[row.resourceKey] }}
          </div>
        </template>

        <template v-slot:percent="{ row }">
          {{ row.percent }}%
          <b-progress :percent="row.percent"
            :showText="false">
          </b-progress>
        </template>

        <template v-slot:count="{ row }">
          {{ row.count }}
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
  import { formatDataSet, formatSeries } from 'bin-charts/src/utils/util'
  import { getTimeRange } from '../../../common/utils/util'

  import * as api from '../../../api/data-manage/collect-analysis.api.js'

  import QuickDateSelect from '../components/QuickDateSelect'

  require('bin-charts/src/theme/charts-theme')

  export default {
    name: 'CollectAnalysis',
    components: { QuickDateSelect },
    data() {
      return {
        directoryTransferEnum: {}, // 资源信息枚举
        compTransferEnum: {}, // 部门信息枚举
        commonDate: [], // 部门数据归集统计分析、资源信息分类统计、最新提报部门使用的时间参数
        departDate: [], // 部门数据归集统计分析日期选择框
        curDate: this.$util.parseTime(new Date(), '{y}-{m}-{d}'),
        resInfoDate: [], // 资源信息归集趋势日期选择框
        tabSelected: 2,
        query: {
          startDate: '',
          endDate: '',
          pageSize: 20,
          personClass: 'nat'
        },
        counts: {
          cnt: '',
          dataMergeContentValue: '',
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
              name: '（条）        ',
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
              name: '数量',
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
        bmsjgjfxParams: {}, // 存储部门数据归集统计分析需要用到的参数
        bmsjgjfxColumns: [ // 部门数据归集分析统计
          { title: '部门名称', slot: 'departId' },
          { title: '归集数量（条）', key: 'count', align: 'left' },
          { title: '完整率(%)', key: 'wzl', align: 'left' },
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
          { title: '归集数量（条）', key: 'count', align: 'right' }
        ],
        xxgjjlData: [], // 信息归集记录
        bmsjgjfxLoading: false,
        zxtbbmLoadig: false,
        xxgjjlLoading: false,
        title: '',
        modal: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 更多按钮回调
       * @param {string} type 用于确认是哪个模块的更多按钮
       * @param {string} title 用于设置打开的弹框标题
       */
      handleMoreBtn (type, title) {
        let list = []
        switch (type) {
          case 'bmsjgjfx':
            this.columns = this.bmsjgjfxColumns
            list = this.bmsjgjfxData.slice(2)
            if (this.bmsjgjfxData.length > 22) {
              list.push({
                departId: 'other',
                count: this.bmsjgjfxData[1].otherNum,
                wzl: '',
                percent: Number(((this.bmsjgjfxData[1].otherNum / this.bmsjgjfxData[0].totalNum) * 100).toFixed(2))
              })
            }
            break
          case 'zxtbbm':
            this.columns = this.zxtbbmColumns
            list = this.zxtbbmData
            break
          case 'xxgjjl':
            this.columns = this.xxgjjlColumns
            list = this.xxgjjlData.slice(1)
            break

          default:
            break
        }
        this.title = title
        this.list = list
        this.modal = true
      },
      /**
       * @author haodongdong
       * @description 部门数据归集统计分析 tab切换按钮回调，设置时间后调用uniteRequest发起需更新的请求
       * @param {Object} dateObj 组件返回一个日期相关的对象
       * @param {string} dateObj.startDateStr 开始时间的日期字符串 默认为yyyy-mm-dd
       * @param {string} dateObj.endDateStr 结束时间的日期字符串 默认为yyyy-mm-dd
       */
      handleTabClick ({ startDateStr, endDateStr }) {
        this.commonDate = [startDateStr, endDateStr]
        this.uniteRequest(this.commonDate)
      },
      /**
       * @author haodongdong
       * @description 部门数据归集统计分析 时间选择器回调，
       * @param {Array} date 组件返回的一个包含开始时间与结束时间字符串的数组，下标0为开始时间，1为结束时间。型式为['yyyy-mm-dd', 'yyyy-mm-dd']
       */
      handleDepartDateChange (date) {
        if (date[0] === '' && date[1] === '') {
          date = this.timeHandler(365, '{y}-{m}-{d}')
          this.tabSelected = 2
        } else {
          this.tabSelected = -1
        }
        this.commonDate = date
        this.uniteRequest(this.commonDate)
      },
      /**
       * @author haodongdong
       * @description 统一请求部门数据归集统计分析、资源信息分类统计、最新提报部门
       * @param {Array} dateArr 包含开始与结束时间字符串的数组。['yyyy-mm-dd', 'yyyy-mm-dd']
       */
      uniteRequest (dateArr) {
        const [startDate, endDate] = dateArr
        const params = {
          startDate,
          endDate,
          pageSize: this.query.pageSize,
          pageNo: 1
        }
        this.getBmsjgjfx(params)
        this.getResInfoClassif(params)
        this.getZxtbbm(params)
      },
      /**
       * @author haodongdong
       * @description 日历组件日期变更事件
       * @param {Object} dateObj 组件返回的一个包含多种日期参数的对象
       * @param {Date} dateObj.date js的标准日期对象
       */
      HandleCalendarChange (date) {
        this.curDate = this.$util.parseTime(date.date, '{y}-{m}-{d}')
        this.query.startDate = this.curDate
        this.getXxgjjl(this.query)
      },
      /**
       * @author haodongdong
       * @description 资源信息分类统计 法人、自然人类别按钮回调，用于切换不同类型的查询。
       */
      handlePersonClassBtn () {
        if (this.query.personClass === 'nat') {
          this.query.personClass = 'leg'
        } else {
          this.query.personClass = 'nat'
        }
        this.getResInfoClassif({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          personClass: this.query.personClass
        })
      },
      /**
       * @author haodongdong
       * @description 资源信息归集趋势 时间选择器回调
       * @param {Array} date 包含开始与结束时间字符串的数组。['yyyy-mm', 'yyyy-mm']
       */
      handleResDateChange (date) {
        if (date[0] === '' && date[1] === '') {
          date = this.timeHandler(365)
          this.resInfoDate = date
        }
        this.getResInfoCollection({
          startDate: date[0],
          endDate: date[1]
        })
      },
      /**
       * @author haodongdong
       * @description 获取t头部磁力块基础数据
       */
      getBaseData() {
        Promise.all([
          api.getZyxxsl(),
          api.getSjgjzl(),
          api.getBygjsjl(),
          api.getZrpcount(),
          api.getFocount()
        ]).then(([zyxxsl, sjgjzl, bygjsjl, zrpcount, focount]) => {
          // 顶部数据
          this.counts = {
            cnt: zyxxsl.data.cnt,
            dataMergeContentValue: sjgjzl.data[0].dataMergeContentValue,
            monthCount: bygjsjl.data[0].monthCount,
            zrpCount: zrpcount.data[0].zrpCount,
            foCount: focount.data[0].foCount
          }
        })
      },
      /**
       * @author haodongdong
       * @description 用于初始获取模块内图表数据
       */
      getChartData() {
        // 获取资源信息分类统计
        this.getResInfoClassif({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          personClass: 'nat'
        })
        // 获取资源信息归集趋势
        this.getResInfoCollection({
          startDate: this.resInfoDate[0],
          endDate: this.resInfoDate[1]
        })
      },
      /**
       * @author haodongdong
       * @description 获取资源信息分类统计图表数据
       * @param {Object} query 查询参数对象
       * @param {string} query.startDate 开始时间 yyyy-mm-dd
       * @param {string} query.endDate 结束时间 yyyy-mm-dd
       * @param {string} query.personClass 主体类别，nat 自然人 leg 法人
       */
      async getResInfoClassif (query) {
        try {
          const kv = {
            'C01': '基本信息',
            'C02': '业务信息',
            'C03': '司法信息',
            'C04': '行政执法信息',
            'C05': '公用事业信息',
            'C06': '信用评价信息',
            'C07': '其他信息'
          }
          const res = await api.getZyxxfltjsj(query)
          res.data.forEach(item => { item.key = kv[item.key] })
          this.barChartOption.dataset = formatDataSet({ xField: 'key', yField: 'count' }, res.data)
        } catch (error) {
          console.error(error)
        }
      },
      /**
       * @author haodongdong
       * @description 获取资源信息归集趋势图表数据，会分别请求法人、自然人的趋势数据
       * @param {Object} query 查询参数对象
       * @param {string} query.startDate 开始时间 yyyy-mm
       * @param {string} query.endDate 结束时间 yyyy-mm
       */
      async getResInfoCollection (query) {
        try {
          const [fr, zrr] = await Promise.all([
            api.getFrzzxxgjqs(query),
            api.getZrpxxgjqs(query)
          ])
          const source = [
            {
              legend: '自然人',
              data: zrr.data
            },
            {
              legend: '法人及其他组织',
              data: fr.data
            }
          ]
          const dataset = formatSeries({ xField: 'month', yField: 'count', seriesField: 'legend' }, source)
          this.lineSmoothChartOption.dataset = dataset
        } catch (error) {
          console.error(error)
        }
      },
      /**
       * @author haodongdong
       * @description 获取模块内初始表格数据，只请求部门数据归集统计分析、最新提报部门。信息归集记录由日历组件事件默认发出请求。
       * @param {Object} query 查询参数对象
       * @param {string} query.startDate 开始时间 yyyy-mm
       * @param {string} query.endDate 结束时间 yyyy-mm
       */
      async getTableData() {
        this.getBmsjgjfx({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          pageSize: this.query.pageSize
        })
        this.getZxtbbm({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          pageSize: this.query.pageSize,
          pageNo: 1
        })
      },
      /**
       * @author haodongdong
       * @description 获取部门数据归集统计分析
       * @param {Object} query 查询参数
       * @param {string} query.startDate 开始时间 yyyy-mm-dd
       * @param {string} query.endDate 结束时间 yyyy-mm-dd
       * @param {number} query.pageSize 获取多少条
       */
      async getBmsjgjfx (query) {
        this.bmsjgjfxLoading = true
        try {
          const res = await api.getBmsjgjfx(query)
          const totalNum = res.data[0].totalNum
          this.bmsjgjfxData = res.data.map((item, index) => {
            if (index > 1) {
              item.wzl = item.wzl.toFixed(2) + '%'
              item.percent = Number(((item.count / totalNum) * 100).toFixed(2))
            }
            return item
          })
        } catch (error) {
          console.error(error)
        }
        this.bmsjgjfxLoading = false
      },
      /**
       * @author haodongdong
       * @description 获取信息归集记录
       * @param {Object} query 查询参数
       * @param {string} query.startDate 开始时间 yyyy-mm-dd
       * @param {number} query.pageSize 获取多少条
       */
      async getXxgjjl (query) {
        this.xxgjjlLoading = true
        try {
          const res = await api.getXxgjjl(query)
          this.xxgjjlData = res.data
        } catch (error) {
          console.error(error)
        }
        this.xxgjjlLoading = false
      },
      /**
       * @author haodongdong
       * @description 获取最新提报部门
       * @param {Object} query 查询参数
       * @param {string} query.startDate 开始时间 yyyy-mm-dd
       * @param {string} query.endDate 结束时间 yyyy-mm-dd
       * @param {number} query.pageSize 获取多少条
       * @param {number} query.pageNo 获取第几页
       */
      async getZxtbbm (query) {
        this.zxtbbmLoadig = true
        try {
          const res = await api.getZxtbbm(query)
          this.zxtbbmData = res.data
        } catch (error) {
          console.error(error)
        }
        this.zxtbbmLoadig = false
      },
      /**
       * @author haodongdong
       * @description 获取部门、资源枚举值。用于取出部门、资源名称
       */
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
      /**
       * @author haodongdong
       * @description 时间处理函数，获取某个范围的开始与结束时间的字符串
       * @param {number} 间隔天数
       * @param {string} [mode = {y}-{m}] 返回的时间字符串格式
       * @returns {[startDateStr, endDateStr]}
       */
      timeHandler(days, mode = '{y}-{m}') {
        const { startDateStr, endDateStr } = getTimeRange(days, mode)
        return [startDateStr, endDateStr]
      },
      /**
       * @author haodongdong
       * @description 初始化函数，处理初始时间参数后统一调用数据接口
       */
      async init() {
        // 初始化查询做需要的时间参数
        this.commonDate = this.timeHandler(365, '{y}-{m}-{d}')
        this.resInfoDate = this.timeHandler(365)
        // 获取对应枚举
        await this.getEnum()
        // 获取初始数据
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
