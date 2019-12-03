<template>
  <base-layout>
    <div class="main-wrap">
      <top-affix>
        <base-header>
          <top-search @on-search="backToIndex" @on-back="backToIndex"></top-search>
        </base-header>
      </top-affix>
      <div class="detail-wrap">
        <!--顶部详情-->
        <transition name="fade-scale-move">
          <div class="top-box mb-20" v-if="current">
            <div class="tap report" flex="dir:top main:center cross:center">
              <em>信</em><em>用</em><em>报</em><em>告</em>
            </div>
            <div class="tap data" flex="dir:top main:center cross:center">
              <em>大</em><em>数</em><em>据</em><em>报</em><em>告</em>
            </div>
            <!--顶部详情数据-->
            <div class="inner" flex>
              <keywords :font-size="32" :radius="10" :size="isLeg ? 100:90" :words="keyword"></keywords>
              <div class="right" flex-box="1">
                <template v-if="isLeg">
                  <h2 class="title-name">{{ current.comp_name }}<span class="status ml-15">{{ current.djzt }}</span>
                  </h2>
                  <p flex="box:mean">
                    <span>统一社会信用代码：{{ current.id_shxym | valueFilter }}</span>
                    <span>地址：{{ current.zs | valueFilter }}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.fddbr }}：{{ current.fddbr | valueFilter }}</span>
                    <span>注册资本：{{  fieldShow('zczb') }}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.clrq }}：{{ current.clrq | valueFilter}}</span>
                  </p>
                  <p flex="box:mean">
                    <span>{{ mapping.jyfw }}：{{ current.jyfw | valueFilter}}</span>
                  </p>
                </template>
                <template v-else>
                  <h2 class="title-name" flex="cross:center">
                    <span class="mr-20">{{ current.name }}</span>
                    <img v-if="current.xb==='男'" src="../../assets/images/man.png" height="38" width="38" alt="xb"/>
                    <img v-else src="../../assets/images/women.png" height="38" width="38" alt="xb"/>
                  </h2>
                  <p flex="box:mean">
                    <span>身份证号码：{{ current.id_sfz | valueFilter }}</span>
                    <span>国籍：{{ current.gjdq | valueFilter }}</span>
                  </p>
                </template>
              </div>
            </div>
            <b-divider></b-divider>
            <!--正负面信息和下载报告-->
            <div flex="main:justify">
              <div>
                <span class="btn red mr-10" @click="handleClickAggs(ENUM.Positive)">正面信息 ({{ pnInfo.p }})</span>
                <span class="btn black" @click="handleClickAggs(ENUM.Negative)">负面信息 ({{ pnInfo.n }})</span>
              </div>
              <a href="#" class="download">
                <b-icon name="ios-cloud-download" size="16"></b-icon>
                下载信用报告
              </a>
            </div>
          </div>
        </transition>
        <!--分类信息详情-->
        <transition name="fade-scale-move">
          <div class="info-box" v-if="classifyTabs">
            <div class="tabs">
              <div v-for="tab in classifyTabs" :key="tab.id"
                   class="tab t-center" :class="{'active':tab.code===activeCode}"
                   @click="handleChangeAgg(tab.code)">
                <span class="txt f-s-16">{{ tab.text }}</span>
                <span class="amount f-s-12 ml-5">{{ tab.amount }}</span>
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
              <div v-show="baseInfoActive">
                <!--公司列表和股权穿透图 v-if="compList.length>0"-->
                <div class="comp-list mb-15" flex>
                  <div class="left">
                    <h4 class="title">{{ isLeg ? '法定代表人':'所有/投资公司' }}</h4>
                    <div class="p15">
                      <div flex v-if="current">
                        <keywords :size="55" back-color="#A088D2">{{ currentPerson.slice(0,1) }}</keywords>
                        <div class="pl-10" flex-box="1">
                          <div class="mb-10 f-s-20 f-color-blue">{{ currentPerson }}</div>
                          <p class="m0 f-s-12 f-color-666">
                            他(她)有<span class="f-color-red">{{ compTotal }}</span>家公司，分布如下
                          </p>
                        </div>
                      </div>
                      <div class="list pt-15">
                        <template v-for="(comp,index) in compList">
                          <p :key="comp.id" v-if="index < 3">{{ comp.comp_name }}</p>
                        </template>
                        <span class="link mt-5" v-if="compList.length > 3">更多<b-icon
                            name="doubleright"></b-icon></span>
                      </div>
                    </div>
                  </div>
                  <div class="right" flex-box="1">
                    <h4 class="title">股权穿透图</h4>
                    <div class="pb-15" flex="dir:top main:center cross:center">
                      <img src="../../assets/images/gq-test.png" alt="gq"/>
                      <b-button class="gq-btn" size="small" @click="handleCheckStock">查看详情</b-button>
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
                  <key-label label="国籍">{{ current.gj | valueFilter }}</key-label>
                  <key-label label="证件号码">{{ current.id_sfz | valueFilter }}</key-label>
                  <key-label label="出生日期">{{ current.csrq | valueFilter }}</key-label>
                  <key-label label="签发机关">{{ current.qfjg | valueFilter }}</key-label>
                  <key-label label="签发日期">{{ current.qfrq | valueFilter }}</key-label>
                  <key-label label="居住地址" is-full>{{ current.txdz | valueFilter }}</key-label>
                </key-label-wrap>
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
    <detail-pn :title="currentPnTitle" :type="type" :current="current" :mapping="mapping"
               ref="pnDetailModal"></detail-pn>
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
        mapping: {}, // 当前查询数据映射
        current: null, // 当前查询数据的信息
        baseInfo: [], // 基本信息数组
        pnInfo: { // 正负面信息数据
          p: -1, // 正面信息positive
          n: -1, // 负面信息数量negative
          pTabs: [], // 正面信息tabs
          nTabs: [] // 负面信息tabs
        }, // 正负面信息数据
        classifyTabs: null, // 7大类别代码对象，动态获取并生成tabs
        classifyMap: {}, // 类别映射，根据code存储对应子类别
        activeCode: '', // 默认选中的类别code
        compList: [], // 当前法定代表人名下的公司
        compTotal: 0, // 名下公司数量
        activeFloatCode: '', // 子类别默认选中的code
        resourcesText: '', // 缓存点击的分类信息名称
        resourcesData: [], // 点击查询资源信息列表数据绑定值
        showResources: false
      }
    },
    computed: {
      ...mapGetters(['currentDetailId', 'searchData']),
      // 当前是查询的法人还是自然人
      type () {
        return this.searchData.type
      },
      // 当前是否是法人
      isLeg () {
        return this.searchData.type === this.ENUM.Leg
      },
      keyword () {
        if (this.isLeg) {
          if (this.current && this.current.comp_name) {
            let size = this.current.comp_name.length >= 4 ? 4 : 1
            return this.current.comp_name.slice(0, size).split('')
          }
        } else {
          if (this.current && this.current.name) {
            return [this.current.name.slice(0, 1)]
          }
        }
        return ['null']
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
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData',
      floatTabs (value) {
        // let code = value.length > 0 ? value[0].code : ''
        // this.handleChangeClassifyCode(code)
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
      // 获取内容数据并填充
      fetchData () {
        const { id, q, reason, type } = this.$route.query
        // 判断是否携带参数，如携带则需要设置vux
        if (id) {
          this.$store.dispatch('setDetailId', id)
        }
        if (q && reason && type) {
          this.$store.dispatch('setSearchData', { q, reason, type })
        }
        this.getDetailData()
      },
      // 获取详情数据
      getDetailData () {
        // 1.获取顶部详情数据填充
        api.getDetail(this.currentDetailId, this.type).then(res => {
          if (res.data.code === '0') {
            this.current = res.data.data
            this.mapping = res.data.mapping
            let name = this.isLeg ? this.current.fddbr : this.current.name
            if (name) {
              api.getCompList(name).then(response => {
                this.compList = response.data.rows
                this.compTotal = response.data.total
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
            // 默认选中一个
            if (this.classifyTabs.length > 0) {
              this.activeCode = this.classifyTabs[0].code
              let tabs = this.classifyMap[this.activeCode]
              if (tabs.length > 2) {
                let activeFloatTab = this.isLeg ? tabs[0] : tabs[1]
                // 子类别选中
                this.handleChangeClassifyCode(activeFloatTab) // 如果是法人则默认选中登记信息，自然人默认选中户籍信息
              }
            }
          }
        })
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
      // 返回查询列表
      backToIndex () {
        this.$router.push('/index')
      },
      // 查看股权结构图
      handleCheckStock () {
        const { id, q, reason, type } = this.$route.query
        this.$router.push({ name: 'stock', query: { id, q, type, reason } })
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
    background: #f0f2f3;
  }
  .detail-wrap {
    width: 1300px;
    margin: 20px auto;
    .top-box {
      position: relative;
      background: #fff;
      border: 1px solid #eee;
      padding: 30px 42px;
      .tap {
        position: absolute;
        cursor pointer
        top: 0;
        left: 0;
        font-size: 15px;
        text-align: center;
        color: #4d85a2;
        background-image: url("../../assets/images/menu1-bg2.png");
        background-position: -3px 0;
        background-repeat: no-repeat;
        width: 40px;
        height: 120px;
        margin-left: -40px;
        em {
          font-style: normal;
        }
        &.report {
          background-image: url("../../assets/images/menu1-bg.png");
          color: #fff;
        }
        &.data {
          top: 115px;
        }
      }
      .inner {
        .right {
          padding-left: 40px;
          .title-name {
            margin: 0 0 20px;
            font-weight: 500;
            color: #333;
            font-size: 22px;
            .status {
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
        }
      }
      .btn {
        display: inline-block;
        cursor: pointer;
        line-height: 38px;
        border-radius: 20px;
        border: 1px solid #eee;
        padding: 0 20px 0 40px;
        background-repeat: no-repeat;
        background-position: 12px 7px;
        &.red {
          background-image url("../../assets/images/redname.png");
          color: #ff7575;
        }
        &.black {
          background-image url("../../assets/images/blackname.png");
          color: #333333;
        }
      }
      .download {
        background: #1ee6b8;
        line-height: 38px;
        border-radius: 20px;
        padding: 0 20px;
        color: #fff;
      }
    }
    .info-box {
      position: relative;
      background: #fff;
      border: 1px solid #eee;
      .tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        line-height: 54px;
        .tab {
          flex: 1;
          cursor: pointer;
          background-color: #fafbfc;
          .txt {
            color: #333333;
          }
          .amount {
            color: #999999;
          }
          &.active {
            background-color: #ffffff;
            .txt, .amount {
              color: #1badf8;
            }
          }
        }
      }
      .float-tab {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 56px;
        left: 0;
        width: 120px;
        margin-left: -121px;
        .item {
          background: #fff;
          width: 100%;
          padding: 10px 15px;
          text-align: center;
          border-bottom: 1px solid #eeeeee;
          color: #aaaaaa;
          p {
            margin: 0;
            line-height: 25px;
          }
          &.normal {
            color: #333333;
            cursor: pointer;
          }
          &.active {
            color: #ffffff;
            background: #1badf8;
          }
        }
      }
      .classify-box {
        padding: 20px 46px;
        min-height: 800px;
      }
    }
  }
  .classify-box {
    .comp-list {
      border: 1px solid #eee;
      min-height: 240px;
      .title {
        margin: 0;
        text-align: center;
        line-height: 40px;
        background: #fafbfc;
        font-weight: normal;
        color: #333;
      }
      .left {
        width: 382px;
        border-right: 1px solid #eee;
        .list {
          p {
            margin: 0;
            line-height: 25px;
          }
        }
      }
    }
  }
</style>
