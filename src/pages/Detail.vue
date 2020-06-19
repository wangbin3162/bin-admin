<template>
  <base-layout>
    <div class="detail-wrapper" v-show="!hideDetail">
      <base-header show-search v-model="topSearchToggle">
        <top-search v-model="query" @on-search="handleSearch" @on-back="topSearchToggle=false"></top-search>
      </base-header>
      <div class="detail-wrap">
        <!--顶部详情-->
        <transition name="fade-scale-move">
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
                    <span class="icon icon-3">{{ mapping.hzrq }}：{{ current.hzrq | valueFilter}}</span>
                  </p>
                  <p flex="box:mean">
                    <span class="icon icon-4">{{ mapping.jyfw }}：{{ current.jyfw | valueFilter }}</span>
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
                    <span class="icon icon-8">民族：{{ current.mz | valueFilter }}</span>
                  </p>
                  <p flex="box:mean">
                    <span class="icon icon-9">签发机关：{{ current.qfjg | valueFilter }}</span>
                    <span class="icon icon-3">签发日期：{{ current.qfrq | valueFilter }}</span>
                  </p>
                </template>
              </div>
              <div>
                <div class="search-count" style="width: 100px;" :title="logTotal">查询量：{{logTotal}}</div>
              </div>
            </div>
            <!--正负面信息和下载报告-->
            <div class="pn-box" flex="main:justify">
              <div>
                <span class="btn red mr-10" @click="handleClickAggs(ENUM.Positive)">正面信息 ({{ pnInfo.p }})</span>
                <span class="btn black" @click="handleClickAggs(ENUM.Negative)">负面信息 ({{ pnInfo.n }})</span>
              </div>
              <a class="download" @click.stop.prevent="handleDownloadExport()">
                下载信用报告
              </a>
            </div>
          </div>
        </transition>
        <!--分类信息详情-->
        <transition name="fade-scale-move">
          <div class="info-box clear-fix" v-if="classifyTabs&&current">
            <div class="classify">
              <span :class="categoryType === 'BASE'? 'active' : '' "
                    @click="chooseCategory('BASE')">标准分类</span>
              <span :class="categoryType === 'BG'? 'active' : '' "
                    @click="chooseCategory('BG')">大数据分类</span>
            </div>
            <div class="tabs">
              <div v-for="tab in classifyTabs" :key="tab.id"
                   class="tab" :class="{'active':tab.code===activeCode}"
                   @click="handleChangeAgg(tab.code)">
                <span class="txt">{{ tab.text }}</span>
                <span class="amount ml-5">{{ tab.amount }}</span>
              </div>
            </div>
            <div class="float-tab" ref="floatTable">
              <div v-for="tab in floatTabs" :key="tab.id" @click="handleChangeClassifyCode(tab)"
                   class="item" :class="[{'normal':tab.amount>0},{'active':tab.code===activeFloatCode}]">
                <p>{{ tab.text }}</p>
                <p>{{ tab.amount }}</p>
              </div>
            </div>
            <div class="classify-box">
              <!--基本信息图-->
              <div v-show="baseInfoActive">
                <!--公司列表和股权穿透图 v-if="compList.length>0"-->
                <div class="comp-list mb-15" flex="main:justify">
                  <div class="left">
                    <h4 class="title">{{ isLeg ? '法定代表人':'所有/投资公司' }}</h4>
                    <div class="p15">
                      <div flex>
                        <keywords :size="55" back-color="#A088D2">{{ currentPerson.slice(0,1) }}</keywords>
                        <div class="pl-20" flex-box="1">
                          <div class="mb-10 f-s-20" style="color: #244470;">{{ currentPerson }}</div>
                          <p class="m0 f-s-12 f-color-666">
                            他(她)有<span class="f-color-red">{{ compList.length }}</span>家公司，分布如下
                          </p>
                        </div>
                      </div>
                      <div class="list pt-15">
                        <template v-for="(comp,index) in compList">
                          <p :key="comp.id" v-if="index < 3">{{ comp.comp_name }}</p>
                        </template>
                        <p>
                          <span class="link mt-5" v-if="compList.length > 3"
                                @click="handleCheckStock">更多<b-icon name="doubleright"></b-icon></span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <h4 class="title">{{ isLeg ? '组织架构图':'投资、任职结构' }}</h4>
                    <div class="pt-20 pb-15" flex="main:center">
                      <b-tooltip content="查看详情" theme="dark" placement="bottom">
                        <div class="mt-20 link" @click="handleCheckStock" flex="dir:top cross:center">
                          <span class="org-tag" @click="handleCheckStock">
                            {{ isLeg ? current.comp_name:current.name }}
                          </span>
                          <img v-if="isLeg" src="../assets/images/qiyejiagou.png" alt="gq"/>
                          <img v-else src="../assets/images/touzirenzhi.png" alt="gq"/>
                        </div>
                      </b-tooltip>
                    </div>
                  </div>
                </div>
                <title-bar :label="isLeg ? '基本信息':'登记信息'" class="mb-15"></title-bar>
                <title-bar class="mb-15" tip-pos="left" :font-size="18">
                  {{ isLeg?'工商机构登记信息':'户籍人口信息' }}(<span class="f-color-blue">1</span>)
                </title-bar>
                <key-label-wrap v-if="isLeg">
                  <key-label label="注册资本">{{ fieldShow('zczb') }}</key-label>
                  <key-label label="成立日期">{{ current.clrq | valueFilter }}</key-label>
                  <key-label label="登记状态">{{ current.djzt | valueFilter }}</key-label>
                  <key-label label="工商注册号">{{ current.id_gszc | valueFilter }}</key-label>
                  <key-label label="统一社会信用代码">{{ current.id_shxym | valueFilter }}</key-label>
                  <key-label label="组织机构代码">{{ current.id_zzjg | valueFilter }}</key-label>
                  <key-label label="纳税人识别号">{{ current.id_swdj | valueFilter }}</key-label>
                  <key-label label="公司类型">{{ current.lx | valueFilter }}</key-label>
                  <key-label label="核准日期">{{ current.hzrq | valueFilter }}</key-label>
                  <key-label label="登记机关">{{ current.djjg | valueFilter }}</key-label>
                  <key-label label="注册地址" is-full>{{ current.zs | valueFilter }}</key-label>
                </key-label-wrap>
                <key-label-wrap v-else>
                  <key-label label="姓名">{{ current.name }}</key-label>
                  <key-label label="户号">{{ current.hh | valueFilter }}</key-label>
                  <key-label label="性别">{{ current.xb | valueFilter }}</key-label>
                  <key-label label="民族">{{ current.mz | valueFilter }}</key-label>
                  <key-label label="外文姓">{{ current.wwx | valueFilter }}</key-label>
                  <key-label label="外文名">{{ current.wwm | valueFilter }}</key-label>
                  <key-label label="与户主关系">{{ current.yhzgx | valueFilter }}</key-label>
                  <key-label label="国籍">{{ current.gjdq | valueFilter }}</key-label>
                  <key-label label="证件号码" is-full>{{ current.id_sfz | valueFilter }}</key-label>
                  <key-label label="签发机关">{{ current.qfjg | valueFilter }}</key-label>
                  <key-label label="签发日期">{{ current.qfrq | valueFilter }}</key-label>
                  <key-label label="居住地址" is-full>{{ current.txdz | valueFilter }}</key-label>
                </key-label-wrap>
                <!--查询日志记录及分页-->
                <title-bar class="mt-20 mb-15" tip-pos="left" :font-size="18">查询记录</title-bar>
                <b-table :columns="logColumns"
                         :data="logList" size="small">
                </b-table>
                <div class="page-wrap">
                  <b-page v-if="logTotal>5" :total="logTotal" :current.sync="logPage" :page-size="5"
                          show-total @on-change="getQueryLogs"></b-page>
                </div>
              </div>
              <transition name="fade-transverse" mode="out-in">
                <div v-if="!baseInfoActive && showResources">
                  <title-bar :label="resourcesText" class="mb-15"></title-bar>
                  <div v-for="item in resourcesData" :key="item.resourceKey">
                    <title-bar class="mb-15" tip-pos="left" :font-size="18">
                      {{ item.resourceName }}(<span class="f-color-blue">{{ item.amount }}</span>)
                    </title-bar>
                    <table-page :resource-key="item.resourceKey" :title="item.resourceName"
                                :categoryType="categoryType"></table-page>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <detail-pn :title="currentPnTitle" :type="type" ref="pnDetailModal"
               :current="current" :log-total="logTotal" :mapping="mapping"
               @on-close="handleCloseDetailPn"
    ></detail-pn>
  </base-layout>
</template>

<script>
  import * as api from '../api/search.api'
  import animations from 'bin-animation'
  import DetailPn from './DetailPn'
  import Keywords from '../components/Keywords/index'
  import TablePage from '../components/TablePage/index'
  import Util from '../common/utils/util'
  import { isEmpty } from '../common/utils/assist'

  export default {
    name: 'Detail',
    components: { DetailPn, Keywords, TablePage },
    data() {
      return {
        topSearchToggle: false,
        currentDetailId: '',
        query: {
          q: '',
          type: '1',
          reason: ''
        },
        logColumns: [
          {
            title: '序号',
            type: 'index',
            width: 50,
            align: 'center',
            indexMethod: (row) => {
              return 10 * (this.logPage - 1) + row._index + 1
            }
          },
          {
            title: '查询原因',
            key: 'queryReason',
            align: 'center',
            render: (h, params) => {
              return h('span', this.reasonMap[params.row.queryReason] || '')
            }
          },
          { title: '查询人名称', key: 'createBy', align: 'center' },
          { title: '查询部门', key: 'createDept', align: 'center' },
          { title: '查询日期', key: 'queryDate', align: 'center' }
        ],
        logList: [], // 查询日志列表
        logPage: 1,
        logTotal: 0,
        mapping: {}, // 当前查询数据映射
        current: null, // 当前查询数据的信息
        baseInfo: [], // 基本信息数组
        pnInfo: { // 正负面信息数据
          p: 0, // 正面信息positive
          n: 0, // 负面信息数量negative
          pTabs: [], // 正面信息tabs
          nTabs: [] // 负面信息tabs
        }, // 正负面信息数据
        classifyTabs: null, // 7大类别代码对象，动态获取并生成tabs
        classifyMap: {}, // 类别映射，根据code存储对应子类别
        activeCode: '', // 默认选中的类别code
        compList: [], // 当前法定代表人名下的公司
        activeFloatCode: '', // 子类别默认选中的code
        resourcesText: '', // 缓存点击的分类信息名称
        resourcesData: [], // 点击查询资源信息列表数据绑定值
        showResources: false,
        hideDetail: false,
        categoryType: 'BASE', // 大类分为 BASE  BG
        reasonMap: {}
      }
    },
    computed: {
      type() {
        return this.$route.query.type
      },
      // 当前是否是法人
      isLeg() {
        return this.$route.query.type === this.ENUM.Leg
      },
      keyword() {
        if (this.isLeg) {
          return this.current.keywords[0] || ''
        } else {
          if (this.current && this.current.name) {
            return this.current.name.slice(0, 1)
          }
        }
        return 'null'
      },
      // 当前左侧浮动的 标签列
      floatTabs() {
        return this.classifyMap[this.activeCode] ? this.classifyMap[this.activeCode] : []
      },
      // 当前打开正负面信息的标题
      currentPnTitle() {
        return this.current ? (this.isLeg ? this.current.comp_name : this.current.name) : '标题'
      },
      // 当前的法定代表人，如是法人这是fddbr字段，自然人即是自身name
      currentPerson() {
        if (this.isLeg) {
          return this.current.fddbr ? this.current.fddbr : ''
        } else {
          return this.current.name ? this.current.name : ''
        }
      },
      // 当前开启的code值是否是基本信息或者户籍信息
      baseInfoActive() {
        return this.activeFloatCode === 'C0102' || this.activeFloatCode === 'C0103' || this.activeFloatCode === 'D01100101' ||
          this.activeFloatCode === 'D01200101'
      }
    },
    created() {
      const { id, reason, type } = this.$route.query
      // 判断是否携带参数，如有参数则缓存vuex，如无参数则默认退回首页
      if (id && reason && type) {
        this.currentDetailId = id
        this.query = Object.assign(this.query, { reason, type })
        this.getDetailData()
      } else {
        this.$router.push({ name: 'index' })
      }
    },
    mounted() {
      // 创建动画
      animations.create({
        name: 'move',
        animation: {
          '0%': {
            transform: 'translate3d(-30%, 0, 0)',
            opacity: 0
          },
          '100%': {
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          }
        },
        presets: {
          duration: 400,
          easing: 'ease-in-out'
        }
      })
    },
    watch: {
      floatTabs() {
        let el = this.$refs['floatTable']
        if (el) {
          // 运行动画
          animations.run(el, 'move', () => {
            el.style.animation = ''
          })
        }
      }
    },
    methods: {
      // 下载导出文件
      handleDownloadExport() {
        if (!this.current) {
          return
        }
        let id = this.current.id
        let name = this.isLeg ? this.current.comp_name : this.current.name
        let personClass = this.isLeg ? 'A02' : 'A01'
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((id, personClass, name) => {
            api.downloadPdf(id, personClass).then(res => {
              Util.downloadFile(res.data, `${name}-信用报告.pdf`)
            })
          }, 1000)
        }
        this.downloadEvent(id, personClass, name)
      },
      handleCloseDetailPn() {
        this.hideDetail = false
        window.scrollTo(0, 0)
      },
      // 顶部查询事件
      handleSearch() {
        if (isEmpty(this.query.q)) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        this.$router.replace({ name: 'index', query: this.query })
      },
      // 字段显示函数
      fieldShow(name) {
        if (this.current && this.current[name] && this.current[name].toString().length !== 0) {
          if (name === 'zczb') {
            let total = this.current[name]
            let bz = this.current['zczbbz'] // 注册资本币种
            return bz ? `${total}万${bz}` : `${total}万元`
          }
          return this.current[name]
        }
        return '-'
      },
      // 获取详情数据
      getDetailData() {
        // 1.获取顶部详情数据填充
        api.getDetail(this.currentDetailId, this.type, this.query.reason).then(res => {
          if (res.data.code === '0') {
            this.current = res.data.data
            this.mapping = res.data.mapping
            let name = this.isLeg ? this.current.fddbr : this.current.name
            if (name) {
              api.getCompList(name, this.type).then(response => {
                if (response.status === 200) {
                  this.compList = response.data.rows
                }
              })
            }
          }
        })
        // 2.获取正负面信息
        this.getPnAggsInfo().then(res => {
          this.pnInfo = { ...res }
        })
        // 3.获取分类
        this.getClassify()
        // 4.获取查询原因分类
        api.queryReason().then(resp => {
          if (resp.data.code === '0') {
            this.reasonMap = resp.data.data
          }
        })
      },
      // 选择标准分类或大数据分类
      chooseCategory(type) {
        this.categoryType = type
        this.getClassify()
      },
      // 获取分类等信息
      getClassify() {
        // 3.获取统计（聚集）查询接口（大小类）
        api.getAggs(this.currentDetailId, this.type, this.categoryType).then(res => {
          if (res.data.code === '0') {
            this.classifyTabs = res.data.data
            // 扁平化子类别对象
            this.classifyTabs.forEach(tab => {
              this.classifyMap[tab.code] = tab.children
            })
            // 过滤法人目录中的自然人户籍信息
            if (this.isLeg) {
              this.classifyMap['C01'].splice(1, 3)
            }
            // 默认选中一个
            if (this.classifyTabs.length > 0) {
              this.activeCode = this.classifyTabs[0].code
              // 默认选中第一个有数据的小类
              this.handleChooseFirst()
            }
          }
        })
        // 4.获取资源信息查询日志
        this.getQueryLogs()
      },
      // 获取正负面信息条目数和正负面信息tabs列表
      async getPnAggsInfo() {
        let pnInfo = { // 正负面信息数据
          p: -1, // 正面信息positive
          n: -1, // 负面信息数量negative
          pTabs: [], // 正面信息tabs
          nTabs: [] // 负面信息tabs
        }
        try {
          let result = await Promise.all([
            api.getPnAggs(this.currentDetailId, this.type),
            api.getPnStat(this.currentDetailId, this.type, this.ENUM.Positive),
            api.getPnStat(this.currentDetailId, this.type, this.ENUM.Negative)
          ])
          if (result[0].data.code === '0') { // 正负面信息条数设置
            pnInfo.p = result[0].data.data.p
            pnInfo.n = result[0].data.data.n
          }
          if (result[1].data.code === '0') { // 正面信息tabs
            pnInfo.pTabs = result[1].data.data
          }
          if (result[2].data.code === '0') { // 负面信息tabs
            pnInfo.nTabs = result[2].data.data
          }
        } catch (e) {
        }
        return pnInfo
      },
      // 资源信息查询日志
      getQueryLogs() {
        api.getQueryLogs(this.currentDetailId, this.logPage).then(res => {
          if (res.status === 200) {
            this.logList = res.data.rows
            this.logTotal = res.data.total
          }
        })
      },
      // 查看股权结构图
      handleCheckStock() {
        const { id, reason, type } = this.$route.query
        let title = this.isLeg ? this.current.comp_name : this.current.name
        this.$router.push({ name: 'Stock', query: { id, type, reason, title } })
      },
      // 正负面信息点击事件
      handleClickAggs(pnType) {
        const tabs = pnType === this.ENUM.Positive ? this.pnInfo.pTabs : this.pnInfo.nTabs
        if ((pnType === this.ENUM.Positive && this.pnInfo.p === 0) || (pnType === this.ENUM.Negative && this.pnInfo.n === 0)) {
          this.$message({ type: 'danger', content: pnType === this.ENUM.Positive ? '暂无正面信息' : '暂无负面面信息' })
          return
        }
        const pnDetail = this.$refs.pnDetailModal
        if (pnDetail) {
          this.hideDetail = true
          pnDetail.open(pnType, tabs)
        }
      },
      // 选择小类别更改主体类别事件
      handleChangeAgg(code) {
        if (this.activeCode !== code) {
          this.activeCode = code
          this.handleChooseFirst()
        }
      },
      // 根据大类code，获取对应的左侧tabs，并查询第一个amount值>0的小类信息，然后设置其tab选中状态
      handleChooseFirst() {
        // 获取对应的左侧tabs
        let tabs = this.classifyMap[this.activeCode]
        // 查找到第一个有amount数据的tab
        let first = tabs.find(tab => tab.amount > 0)// 子类别选中
        if (first) {
          this.handleChangeClassifyCode(first)
        }
      },
      // 子类别改变事件
      handleChangeClassifyCode(tab) {
        if (tab.amount > 0 && this.activeFloatCode !== tab.code) {
          this.activeFloatCode = tab.code
          this.resourcesText = tab.text
          if (this.baseInfoActive) {
            return
          }
          this.showResources = false
          // 获取不同类别下的资源信息
          api.getClassifyStat(this.currentDetailId, this.type, this.activeFloatCode, this.categoryType)
            .then(res => {
              if (res.data.code === '0') {
                this.resourcesData = res.data.data
                this.showResources = true
              }
            })
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
