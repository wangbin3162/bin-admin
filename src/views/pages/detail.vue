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
            <div class="inner" flex>
              <keywords :font-size="32" :radius="10" :size="100" :words="keyword"></keywords>
              <div class="right" flex-box="1">
                <h2 class="title-name">{{ current.comp_name }}<span class="ml-15">{{ current.djzt }}</span></h2>
                <p flex="box:mean">
                  <span>统一社会信用代码：{{ current.id_shxym | valueFilter }}</span>
                  <span>地址：{{ current.zs | valueFilter }}</span>
                </p>
                <p flex="box:mean">
                  <span>{{ mapping.fddbr }}：{{ current.fddbr | valueFilter }}</span>
                  <span>{{ mapping.zczb }}：{{ current.zczb | valueFilter}}</span>
                </p>
                <p flex="box:mean">
                  <span>{{ mapping.clrq }}：{{ current.clrq | valueFilter}}</span>
                </p>
                <p flex="box:mean">
                  <span>{{ mapping.jyfw }}：{{ current.jyfw | valueFilter}}</span>
                </p>
              </div>
            </div>
            <b-divider></b-divider>
            <div flex="main:justify">
              <div>
                <span class="btn red mr-10" @click="handleClickAggs('1')">正面信息 ({{ pnInfo.p }})</span>
                <span class="btn black" @click="handleClickAggs('2')">负面信息 ({{ pnInfo.n }})</span>
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
              <div v-for="tab in currentTabs" :key="tab.id" @click="handleChangeClassifyCode(tab.code)"
                   class="item" :class="[{'normal':tab.amount>0},{'active':tab.code===activeChildCode}]">
                <p>{{ tab.text }}</p>
                <p>{{ tab.amount }}</p>
              </div>
            </div>
            <div class="classify-box">
              <div class="comp-list mb-15" flex>
                <div class="left">
                  <h4 class="title">法定代表人</h4>
                  <div class="p15">
                    <div flex v-if="current && current.fddbr">
                      <keywords :size="55" back-color="#A088D2">{{ current.fddbr.slice(0,1) }}</keywords>
                      <div class="pl-10" flex-box="1">
                        <div class="mb-10 f-s-20 f-color-blue">{{ current.fddbr }}</div>
                        <p class="m0 f-s-12 f-color-666">
                          他有<span class="f-color-red">{{ compTotal }}</span>家公司，分布如下
                        </p>
                      </div>
                    </div>
                    <div class="list pt-15">
                      <template v-for="(comp,index) in compList">
                        <p :key="comp.id" v-if="index < 3">{{ comp.comp_name }}</p>
                      </template>
                      <span class="link mt-5" v-if="compList.length > 3">更多<b-icon name="doubleright"></b-icon></span>
                    </div>
                  </div>
                </div>
                <div class="right" flex-box="1">
                  <h4 class="title">股权穿透图</h4>
                  <div flex="main:center cross:center">
                    <img src="../../assets/images/gq-test.png" height="167" width="619" alt="gq" title="查看详情"/>
                  </div>
                </div>
              </div>
              <title-bar label="基本信息" class="mb-15"></title-bar>
              <title-bar class="mb-15" tip-pos="left" :font-size="18">
                工商机构登记信息(<span class="f-color-blue">1</span>)
              </title-bar>
              <key-label-wrap>
                <key-label label="注册资本">{{ current.zczb }}万人民币</key-label>
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
            </div>
          </div>
        </transition>
      </div>
    </div>
    <detail-pn :title="currentPnTitle" :current="current" :mapping="mapping" ref="pnDetailModal"></detail-pn>
  </base-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/search'
  import Keywords from '../../components/keywords/keywords'
  import animations from 'bin-animation'
  import KeyLabelWrap from '../../components/key-label/KeyLabelWrap'
  import DetailPn from './detail-pn'

  export default {
    name: 'detail',
    components: { DetailPn, KeyLabelWrap, Keywords },
    data () {
      return {
        mapping: {},
        current: null,
        baseInfo: [], // 基本信息数组
        pnInfo: { // 正负面信息数据
          p: -1, // 正面信息positive
          n: -1, // 负面信息数量negative
          pTabs: [], // 正面信息tabs
          nTabs: [] // 负面信息tabs
        },
        type: '',
        classifyTabs: null, // 7大类别代码对象，动态获取并生成tabs
        classifyMap: {}, // 类别映射，根据code存储对应子类别
        activeCode: '', // 默认选中的类别code
        activeChildCode: '', // 子类别默认选中的code
        compList: [], // 当前法定代表人名下的公司
        compTotal: 0
      }
    },
    computed: {
      ...mapGetters(['currentDetailId', 'searchData']),
      keyword () {
        if (this.current && this.current.comp_name) {
          let size = this.current.comp_name.length >= 4 ? 4 : 1
          return this.current.comp_name.slice(0, size).split('')
        } else {
          return ['null']
        }
      },
      currentTabs () {
        return this.classifyMap[this.activeCode] ? this.classifyMap[this.activeCode] : []
      },
      currentPnTitle () {
        return this.current ? this.current.comp_name : '标题'
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData',
      currentTabs (value) {
        let code = value.length > 0 ? value[0].code : ''
        this.handleChangeClassifyCode(code)
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
      // 获取内容数据并填充
      fetchData () {
        this.type = this.searchData.type
        this.getDetailData()
      },
      // 获取详情数据
      getDetailData () {
        // 1.获取顶部详情数据填充
        api.getDetail(this.currentDetailId, this.type).then(res => {
          this.current = res.data.data
          this.mapping = res.data.mapping
          if (this.current.fddbr) {
            api.getCompList(this.current.fddbr).then(response => {
              this.compList = response.data.rows
              this.compTotal = response.data.total
            })
          }
        })
        // 2.获取正负面信息
        this.getPnAggsInfo().then(res => {
          this.pnInfo = { ...res }
        })
        // 3.获取统计（聚集）查询接口（大小类）
        api.getAggs(this.currentDetailId, this.type).then(res => {
          this.classifyTabs = res.data.data
          // 扁平化子类别对象
          this.classifyTabs.forEach(tab => {
            this.classifyMap[tab.code] = tab.children
          })
          // 默认选中一个
          if (this.classifyTabs.length > 0) {
            this.handleChangeAgg(this.classifyTabs[0].code)
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
            api.getPnStat(this.currentDetailId, this.type, '1'),
            api.getPnStat(this.currentDetailId, this.type, '2')
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
      // 正负面信息点击事件
      handleClickAggs (pnType) {
        const pnDetail = this.$refs.pnDetailModal
        const tabs = pnType === '1' ? this.pnInfo.pTabs : this.pnInfo.nTabs
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
      handleChangeClassifyCode (code) {
        if (this.activeChildCode !== code) {
          this.activeChildCode = code
          // 获取不同类别下的资源信息
          // api.getClassifyStat(this.currentDetailId, this.type, this.activeChildCode)
          //   .then(res => {
          //     console.log(code)
          //     console.log(res.data)
          //   })
        }
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
      min-height: 280px;
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
            span {
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
          background-color: #f7f7f7;
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
          cursor: pointer;
          color: #aaaaaa;
          p {
            margin: 0;
            line-height: 25px;
          }
          &.normal {
            color: #333333;
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
