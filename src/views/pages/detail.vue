<template>
  <base-layout>
    <div class="main-wrap">
      <top-affix>
        <base-header>
          <top-search v-model="query" @on-search="handleSearch" @on-back="backToIndex"></top-search>
        </base-header>
      </top-affix>
      <div class="detail-wrap">
        <!--顶部详情-->
        <transition name="fade-scale-move">
          <div class="top-box" :class="isLeg?'faren':'ziranren'" v-if="current">
            <!--顶部详情数据-->
            <div class="inner" flex>
              <div class="left">
                <keywords cls="color-0" :font-size="32" :radius="20" :size="isLeg ? 100:90">{{ keyword }}</keywords>
                <div v-if="isLeg" class="search-count mt-15" :title="logTotal">查询量：{{logTotal}}</div>
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
              <div v-if="!isLeg">
                <div class="search-count" style="width: 100px;" :title="logTotal">查询量：{{logTotal}}</div>
              </div>
            </div>
            <!--正负面信息和下载报告-->
            <div class="pn-box" flex="main:justify">
              <div>
                <span class="btn red mr-10" @click="handleClickAggs(ENUM.Positive)">正面信息 ({{ pnInfo.p }})</span>
                <span class="btn black" @click="handleClickAggs(ENUM.Negative)">负面信息 ({{ pnInfo.n }})</span>
              </div>
              <a href="#" class="download">
                下载信用报告
              </a>
            </div>
          </div>
        </transition>
        <!--分类信息详情-->
        <transition name="fade-scale-move">
          <div class="info-box" v-if="classifyTabs">
            <div class="classify"><span class="active">标准分类</span><span>大数据分类</span></div>
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
            <div class="classify-box" v-if="current">
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
                          <img v-if="isLeg" src="../../assets/images/qiyejiagou.png" alt="gq"/>
                          <img v-else src="../../assets/images/touzirenzhi.png" alt="gq"/>
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
                  <key-label label="证件号码">{{ current.id_sfz | valueFilter }}</key-label>
                  <key-label label="出生日期">{{ current.csrq | valueFilter }}</key-label>
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
                    <table-page :resource-key="item.resourceKey" :title="item.resourceName"></table-page>
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
    ></detail-pn>
  </base-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/search'
  import animations from 'bin-animation'
  import DetailPn from './detail-pn'
  import Keywords from '../../components/keywords/keywords'
  import TablePage from '../../components/table-page/table-page'

  export default {
    name: 'detail',
    components: { DetailPn, Keywords, TablePage },
    data () {
      return {
        query: {
          q: '',
          type: '',
          reason: '1'
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
          { title: '查询原因', key: 'queryReason', align: 'center' },
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
        showResources: false
      }
    },
    computed: {
      ...mapGetters(['currentDetailId', 'queryData']),
      type () {
        return this.queryData.type
      },
      // 当前是否是法人
      isLeg () {
        return this.queryData.type === this.ENUM.Leg
      },
      keyword () {
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
      floatTabs () {
        return this.classifyMap[this.activeCode] ? this.classifyMap[this.activeCode] : []
      },
      // 当前打开正负面信息的标题
      currentPnTitle () {
        return this.current ? (this.isLeg ? this.current.comp_name : this.current.name) : '标题'
      },
      // 当前的法定代表人，如是法人这是fddbr字段，自然人即是自身name
      currentPerson () {
        if (this.isLeg) {
          return this.current.fddbr ? this.current.fddbr : ''
        } else {
          return this.current.name ? this.current.name : ''
        }
      },
      // 当前开启的code值是否是基本信息或者户籍信息
      baseInfoActive () {
        return this.activeFloatCode === 'C0102' || this.activeFloatCode === 'C0103'
      }
    },
    created () {
      const { id, reason, type } = this.$route.query
      // 判断是否携带参数，如有参数则缓存vuex，如无参数则默认退回首页
      if (id && reason && type) {
        this.query = Object.assign(this.query, { reason, type })
        this.$store.dispatch('setQuery', { id, reason, type })
        this.getDetailData()
      } else {
        this.$router.push({ name: 'index' })
      }
    },
    watch: {
      floatTabs () {
        let el = this.$refs['floatTable']
        if (el) {
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
          // 运行动画
          animations.run(el, 'move', () => {
            animations.remove('move')
          })
        }
      }
    },
    methods: {
      // 顶部查询事件
      handleSearch () {
        if (this.query.q.length === 0) {
          this.$message({ type: 'danger', content: '请输入查询条件！' })
          return
        }
        let query = { id: '', q: this.query.q, type: this.query.type, reason: this.query.reason }
        this.$store.dispatch('setQuery', query)
        this.$router.push('/index')
      },
      // 返回查询列表
      backToIndex () {
        let query = { id: '', q: '', type: '1', reason: '' }
        this.$store.dispatch('setQuery', query)
        this.$router.push('/index')
      },
      // 字段显示函数
      fieldShow (name) {
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
      getDetailData () {
        // 1.获取顶部详情数据填充
        api.getDetail(this.currentDetailId, this.type, this.queryData.reason).then(res => {
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
        // 3.获取统计（聚集）查询接口（大小类）
        api.getAggs(this.currentDetailId, this.type).then(res => {
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
              let tabs = this.classifyMap[this.activeCode]
              if (tabs.length >= 2) {
                let activeFloatTab = this.isLeg ? tabs[0] : tabs[1]
                // 子类别选中
                this.handleChangeClassifyCode(activeFloatTab) // 如果是法人则默认选中登记信息，自然人默认选中户籍信息
              }
            }
          }
        })
        // 4.获取资源信息查询日志
        this.getQueryLogs()
      },
      // 获取正负面信息条目数和正负面信息tabs列表
      async getPnAggsInfo () {
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
      getQueryLogs () {
        api.getQueryLogs(this.currentDetailId, this.logPage).then(res => {
          if (res.status === 200) {
            this.logList = res.data.rows
            this.logTotal = res.data.total
          }
        })
      },
      // 查看股权结构图
      handleCheckStock () {
        const { id, reason, type } = this.$route.query
        let title = this.isLeg ? this.current.comp_name : this.current.name
        this.$router.push({ name: 'stock', query: { id, type, reason, title } })
      },
      // 正负面信息点击事件
      handleClickAggs (pnType) {
        const tabs = pnType === this.ENUM.Positive ? this.pnInfo.pTabs : this.pnInfo.nTabs
        if ((pnType === this.ENUM.Positive && this.pnInfo.p === 0) || (pnType === this.ENUM.Negative && this.pnInfo.n === 0)) {
          this.$message({ type: 'danger', content: pnType === this.ENUM.Positive ? '暂无正面信息' : '暂无负面面信息' })
          return
        }
        const pnDetail = this.$refs.pnDetailModal
        if (pnDetail) {
          pnDetail.open(pnType, tabs)
        }
      },
      // 更改主体类别事件
      handleChangeAgg (code) {
        if (this.activeCode !== code) {
          this.activeCode = code
        }
      },
      // 子类别改变事件
      handleChangeClassifyCode (tab) {
        if (tab.amount > 0 && this.activeFloatCode !== tab.code) {
          this.activeFloatCode = tab.code
          this.resourcesText = tab.text
          if (this.baseInfoActive) {
            return
          }
          this.showResources = false
          // 获取不同类别下的资源信息
          api.getClassifyStat(this.currentDetailId, this.type, this.activeFloatCode)
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
  .main-wrap {
    background: #eaeff3;
  }
  .detail-wrap {
    width: 1300px;
    margin: 20px auto;
  }
  .top-box {
    position: relative;
    background: #fff;
    border: 1px solid #f3f6fc;
    border-radius: 10px;
    margin-bottom: 20px;
    &.faren {
      background: #fff url("../../assets/images/faren-bg.png") no-repeat 0 0;
    }
    &.ziranren {
      background: #fff url("../../assets/images/ziranren-bg.png") no-repeat 0 0;
    }
    .inner {
      padding: 30px 42px;
      border-bottom: 1px solid #f3f6fc;
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
    .right {
      padding-left: 40px;
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
    .pn-box {
      padding: 15px 42px;
    }
    .btn {
      display: inline-block;
      cursor: pointer;
      line-height: 45px;
      border-radius: 20px;
      padding: 0 20px 0 40px;
      background-color: #f9f9f9;
      background-repeat: no-repeat;
      background-position: 12px 7px;
      color: #445e83;
      &.red {
        background-image url("../../assets/images/redname.png");
      }
      &.black {
        background-image url("../../assets/images/blackname.png");
      }
    }
    .download {
      background: #f8fbfd url("../../assets/images/icon-download.png") no-repeat 15px 2px;
      line-height: 45px;
      border-radius: 20px;
      padding: 0 20px 0 60px;
      color: #1f7af6;
    }
  }
  .info-box {
    position: relative;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    .classify {
      padding: 0 35px;
      span {
        position: relative;
        display: inline-block;
        line-height: 54px;
        padding: 0 15px;
        color: #8294b1;
        font-size: 16px;
        cursor: pointer;
        &:after {
          position: absolute;
          display: none;
          content: '';
          bottom: 0;
          left: 50%;
          width: 30px;
          height: 2px;
          margin-left: -15px;
          background #2f8bfd;
        }
        &.active {
          color: #042f63;
          font-weight: bold;
          &:after {
            display: block;
          }
        }
      }
    }
    .tabs {
      padding: 10px 20px;
      background #f3f6fc;
      text-align: right;
      .tab {
        display: inline-block;
        cursor: pointer;
        padding: 10px 22px;
        border-radius: 20px;
        color: #445e83;
        margin-left: 6px;
        &.active {
          background-color: #1f7af6;
          color: #fff;
        }
      }
    }
    .float-tab {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      top: 54px;
      left: 0;
      width: 120px;
      margin-left: -121px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      overflow: hidden;
      .item {
        background: #fafcff;
        width: 100%;
        padding: 10px 12px;
        text-align: center;
        border-bottom: 1px solid #eeeeee;
        font-size: 12px;
        color: #aeb8c7;
        p {
          margin: 0;
          line-height: 25px;
        }
        &.normal {
          color: #445e83;
          cursor: pointer;
        }
        &.active {
          color: #ffffff;
          background: #1f7af6;
        }
      }
    }
    .classify-box {
      padding: 20px 46px;
      min-height: 800px;
    }
  }
  .classify-box {
    .comp-list {
      min-height: 240px;
      .title {
        margin: 0;
        text-align: center;
        line-height: 40px;
        background: #fbfbfa;
        font-weight: normal;
        color: #445e83;
      }
      .left, .right {
        border: 1px solid #f5f7fd;
        border-radius: 15px;
        overflow: hidden;
      }
      .left {
        width: 382px;
        .list {
          p {
            margin: 0;
            line-height: 25px;
          }
        }
      }
      .right {
        width: 800px;
      }
      .org-tag {
        padding: 12px 22px;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
        background: #63c6fa;
      }
    }
    .page-wrap {
      padding: 15px 0;
      text-align: right;
    }
  }
</style>
