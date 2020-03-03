<template>
  <div id="app" class="my-gather-data">
    <div class="header">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex="main">
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.totalResource}}</i>
        </span>
        </div>
        <div class="tip-item" flex="main">
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.totalCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex="main">
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.monthCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex="main">
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.zrpCount}}</i>
        </span>
        </div>
        <div class="tip-item" flex="main">
        <span class="icon">
          <img src="" alt="">
        </span>
          <span class="info" flex="dir:top">
          <i>资源信息数量</i>
          <i class="count">{{counts.foCount}}</i>
        </span>
        </div>
      </div>
    </div>
    <div class="main" flex="main:justify; wrap:wrap">
      <div class="mr-20 w-percent-70">
        <div class="area mb-20 pd-10">
          <div class="title">
            <span class="text">月度信息归集趋势</span>
            <span class="float-right pr-12">
              <b-select style="width:100px" v-model="select" size="mini" clearable>
                <b-option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
              </b-select>
            </span>
          </div>
          <div class="content" flex="main:justify">
            <div class="trend mg-0-auto">
              <v-chart ref="chart1" :options="lineSmoothChartOption" style="height: 280px;width: 100%"></v-chart>
            </div>
          </div>
        </div>
        <div class="mb-20" flex>
          <div class="area mr-20 pd-10" flex-box="1">
            <div class="title">
              <span class="text">资源信息分类统计</span>
              <span class="float-right pr-12">
              <b-select style="width:100px" v-model="select" size="mini" clearable>
                <b-option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
              </b-select>
            </span>
            </div>
            <div class="content" flex="main:justify">
              <div class="trend">
                <v-chart ref="chart2" :options="barChartOption" style="height: 280px;width: 100%"></v-chart>
              </div>
            </div>
          </div>
          <div class="area pd-10" style="width: 325px;">
            <div class="title">
              <span class="text">月度部门归集统计</span>
              <span class="float-right pr-12">
              <b-select style="width:100px" v-model="select" size="mini" clearable>
                <b-option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
              </b-select>
            </span>
            </div>
            <div class="content" flex="main:justify">
              <div class="pt-12" style="width: 400px;">
                <b-table :columns="monthDepartColumns" :data="monthDepartData" size="small" width="265"></b-table>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <div class="area pd-10">
            <div class="title">
              <span class="text">部门数据归集统计分析</span>
              <span class="float-right pr-12">
              更多>>
            </span>
            </div>
            <div class="pd-12">
              <b-table :columns="departSumColumns" :data="departSumData" size="small" stripe border></b-table>
            </div>
          </div>
        </div>
      </div>
      <div class="w-percent-30">
        <div class="area mb-20 pd-10">
          <div class="title" flex="main:justify">
            <span class="text">本月数据分析</span>
          </div>
          <div class="current-tip pd-12" flex="main:justify; box:mean">
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
        <div class="area mb-20 pd-10">
          <div class="title" flex="main:justify">
            <span class="text">按部门数据归集统计</span>
          </div>
          <div class="trend pd-12">
            <v-chart ref="chart3" :options="lineChartOption" style="height: 280px;width: 100%"></v-chart>
          </div>
        </div>
        <div class="area mb-20 pd-10">
          <div class="title" flex="main:justify">
            <span class="text">未填报部门</span>
          </div>
          <div class="resource-list">
            <p>资源信息</p>
            <ul class="list">
              <li class="list-item"></li>
            </ul>
          </div>
        </div>
        <div class="area mb-20 pd-10">
          <div class="title" flex="main:justify">
            <span class="text">主体及资源数据分类数据分析</span>
          </div>
          <div class="trend pd-12">
            <v-chart ref="chart4" id="chart4" :options="pieChartOption" style="height: 280px;width: 100%"></v-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '../../../api/data-manage/collect-analysis.api.js'
  export default {
    name: 'CollectAnalysis',
    data () {
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
        lineSmoothChartOption: {
          color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
          legend: {
            data: ['自然人', '法人及其他组织'],
            icon: 'rect'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
          series: [{
            name: '自然人',
            smooth: true,
            data: [200, 300, 400, 500, 200, 300, 400, 500, 400, 500, 400, 500],
            type: 'line',
            areaStyle: {},
            symbolSize: 8
          },
          {
            name: '法人及其他组织',
            smooth: true,
            data: [100, 200, 300, 400, 400, 100, 200, 300, 400, 400, 400, 400],
            type: 'line',
            areaStyle: {},
            symbolSize: 8
          }]
        },
        lineChartOption: {
          color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
          xAxis: {
            type: 'category',
            data: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6'],
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
          series: {
            data: [],
            type: 'line',
            areaStyle: {},
            symbolSize: 8
          }
        },
        barChartOption: {
          color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
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
            data: ['基本信息', '业务信息', '司法信息', '行政执法信息', '公共事业信息', '信用评级信息', '其他信息'],
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
            type: 'bar',
            data: [ 18203, 23489, 29034, 10497, 13174, 63023, 13144 ]
          }
        },
        pieChartOption: {
          color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '40%'],
              label: {
                formatter: '{a}\n{c}',
                position: 'inner'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 335, name: '直达', selected: true },
                { value: 679, name: '营销广告' },
                { value: 1548, name: '搜索引擎' }
              ]
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                formatter: '{a}\n{c}'
              },
              data: [
                { value: 335, name: '直达' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1048, name: '百度' },
                { value: 251, name: '谷歌' },
                { value: 147, name: '必应' },
                { value: 102, name: '其他' }
              ]
            }
          ]
        },

        monthDepartColumns: [
          { title: '部门', key: 'depart' },
          { title: '归集数量', key: 'count' }
        ],
        monthDepartData: [{ depart: '部门1', count: 1200 }, { depart: '部门1', count: 1200 }, { depart: '部门1', count: 1200 }, { depart: '部门1', count: 1200 }, { depart: '部门1', count: 1200 }, { depart: '部门1', count: 1200 }],
        departSumColumns: [
          { title: '部门', key: 'departName', width: 300 },
          { title: '归集数量', key: 'value' },
          { title: '占比', key: 'percent' },
          { title: '趋势分析',
            key: 'trend',
            render: (h, params) => {
              return h('b-button', {
                props: {
                  type: 'primary',
                  size: 'mini',
                  plain: true
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
        monthList: [],
        select: '',
        date: new Date(),
        columns: [
          { title: '资源信息', key: 'resourceName' },
          { title: '归集数量', key: 'count' },
          { title: '归集日期', key: 'date' }
        ],
        historyList: [],
        resourceList: [],
        yearList: [],
        yearSelect: ''
      }
    },

    created() {
      // this.renderChart( this.lineSmoothChartOption, this.$refs.chart1 )
      // this.renderChart( this.barChartOption, this.$refs.chart2 )
      // this.renderChart( this.lineChartOption, this.$refs.chart3 )
      // this.renderChart( this.pieChartOption, this.$refs.chart4 )
      this.searchList()
    },

    methods: {
      // 查询所有列表
      searchList() {
        this.resetListQuery()
        this.getBaseData()
        this.getChartData()
        this.getTableData()
      },
      // async 获取基础数据
      getBaseData() {
        var _self = this
        Promise.all([
          api.getClassifyDataCount(),
          api.getClassifyTotalCount(),
          api.getClassifyMonthCount(),
          api.getClassifyZrpCount(),
          api.getClassifyFoCount(),
          api.getMonthCollectData(new Date().getFullYear() + '-' + (new Date().getMonth() + 1))
        ]).then(function(res) {
          // 顶部数据
          let obj = {
            totalResource: res[0].data.data.totalResource,
            totalCount: res[1].data.data.totalCount,
            monthCount: res[2].data.data.monthCount,
            zrpCount: res[3].data.data.zrpCount,
            foCount: res[4].data.data.foCount,
            gjCount: res[5].data.data.gjCount,
            sbCount: res[5].data.data.sbCount,
            hlCount: res[5].data.data.hlCount
          }
          _self.counts = obj
        })
      },
      // async 获取图表数据
      getChartData() {
        var _self = this
        Promise.all([
          api.getYearCollectData(),
          api.getDeptCollectData(),
          api.getResourceData(),
          api.getSubjectData()
        ]).then(function(res) {
          let monthCollect = res[0].data.data
          // 月度信息归集趋势
          let monthInfos = []
          let monthSubs = []
          monthCollect.forEach(item => { monthInfos.push(item.data); monthSubs.push(item.legend) })
          console.log(monthInfos)
          console.log('-------------')
          console.log(monthSubs)
          _self.lineSmoothChartOption = {
            color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
            legend: {
              data: monthSubs,
              icon: 'rect'
            },
            xAxis: {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
            series: [
              {
                name: monthSubs[0],
                smooth: true,
                data: monthInfos[0],
                type: 'line',
                areaStyle: {},
                symbolSize: 8
              },
              {
                name: monthSubs[1],
                smooth: true,
                data: monthInfos[1],
                type: 'line',
                areaStyle: {},
                symbolSize: 8
              }
            ]
          }

          // 部门数据归集统计
          let depts = []
          res[1].data.data.forEach(item => depts.push(item.departName))
          _self.lineChartOption = {
            color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
              xAxis: {
              type: 'category',
                data: depts,
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
            series: {
              data: res[1].data.data,
                type: 'line',
                areaStyle: {},
              symbolSize: 8
            }
          }

          // 资源信息分类统计
          let resourceNames = []
          res[2].data.data.forEach(item => resourceNames.push(item.resourceName))
          _self.barChartOption = {
            color: ['#4065e0', '#35a4ff', '#6fcafa', '#18e5e6', '#1ed1b8'],
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
                data: resourceNames,
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
              type: 'bar',
                data: res[2].data.data
            }
          }

          // 主体及资源数据分析
          let subjects = []
          let subjectItems = []
          res[3].data.data.forEach(item => subjects.push({ name: item.name, value: item.value }))
          res[3].data.data.forEach(item => item.data.forEach(
            item => subjectItems.push(item))
          )
          _self.pieChartOption = {
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
      //
      getTableData() {
        var _self = this
        Promise.all([
          api.getDeptCollectData()
        ]).then(res => {
          _self.departSumData = res[0].data.data
          var total = 0
          _self.departSumData.forEach(item => { total += parseInt(item.value) })
          _self.departSumData.forEach(item => {
            item.percent = parseInt(item.value / total * 100) + '%'
          })
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
  .mr-20
    margin-right: 20px
  .mt-20
    margin-top: 20px
  .mb-20
    margin-top: 20px
  .pr-12
    padding-right: 12px
  .pt-12
    padding-top: 12px
  .pd-12
    padding: 12px
  .pd-10
    padding: 10px
  .mg-0-auto
    margin: 0 auto
  i{
    font-style: normal
  }
  .my-gather-data{
    .header{
      .msg-tips{
        width: 100%
        .tip-item {
          width: 19%
          padding: 20px
          color #fff
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          border-radius: 8px;
          .icon{
            background-color: #ffffff44
            display inline-block
            width: 50px
            height: 50px
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%
            margin-right: 30px
          }
          .count{
            padding-top: 10px
            font-size: 18px
            font-weight: 700
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
    .main{
      width: 100%
      height: 100%
      .area{
        -webkit-border-radius: 8px
        -moz-border-radius: 8px
        border-radius: 8px
        background-color: #fff
        overflow hidden
        .title{
          font-size: 18px
          line-height: 40px
          padding-left: 20px
          font-weight: 700
          .text{
            padding-top: 5px
          }
          .my-date-picker{
            width 160px
            display inline-block
            padding 4px
            padding-right: 20px
          }
          .filter-select{
            width: 450px
            margin-right: 20px
            padding-top: 20px
          }
          .float-right{
            float: right
          }
        }
        .content{
          padding 0 20px 20px
        }
        .current-tip{
          .border-right{
            position relative
            &::after{
              position absolute
              right: 50%
              top: 50%
              transform translate(-50%,-50%)
              content ''
              display inline-block
              width: 1px
              height: 40px
              background-color: #9e9e9e
            }
          }
          .current-tip-item{
            text-align center
            width: 100px
            .g-font{
              color #9e9e9e
            }
            .b-num{
              font-size: 26px
              color #0b87ed
              font-weight: 700
              padding-top: 5px
            }
          }
        }
      }
      .w-percent-70{
        width: calc( 70% - 20px );
      }
      .w-percent-30{
        width: 30%;
      }
      .trend{
        width: 100%
        position relative
        .chart-title{
          position absolute
          left 50%
          transform translateX(-50%)
          background-color: #eceffc
          -webkit-border-radius: 20px
          -moz-border-radius: 20px
          border-radius: 20px
          line-height: 40px
          width: 180px
          text-align center
        }
      }
    }
  }

</style>
