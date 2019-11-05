<template>
  <base-layout>
    <div class="main-wrap">
      <top-affix>
        <base-header>
          <top-search @on-search="backToIndex" @on-back="backToIndex"></top-search>
        </base-header>
      </top-affix>
      <div class="detail-wrap">
        <transition name="zoom-in-center">
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
                <span class="btn red mr-10">正面信息 ({{ redBlackNum.red }})</span>
                <span class="btn black">负面信息 ({{ redBlackNum.black }})</span>
              </div>
              <a href="#" class="download">
                <b-icon name="ios-cloud-download" size="16"></b-icon>
                下载信用报告
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </base-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/search'
  import Keywords from '../../components/keywords/keywords'

  export default {
    name: 'detail',
    components: { Keywords },
    data () {
      return {
        mapping: {},
        current: null,
        redBlackNum: { // 正负面信息数量
          red: -1,
          black: -1
        },
        type: '',
        classifyTabs: null // 7大类别代码对象，动态获取并生成tabs
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
      }
    },
    filters: {
      valueFilter (value) {
        if (!value || value.toString().length === 0) {
          return '--'
        }
        return value
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
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
        })
        // 2.获取正负面信息条目数
        api.getRedBlackNums(this.currentDetailId, this.type).then(res => {
          const result = res.data.data
          this.redBlackNum.red = result.p
          this.redBlackNum.black = result.n
        })
        // 3.获取统计（聚集）查询接口（大小类）
        api.getAggs(this.currentDetailId, this.type).then(res => {
          this.classifyTabs = res.data.data
          console.log(this.classifyTabs)
        })
      },
      backToIndex () {
        this.$router.push('/index')
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
          color: #666666;
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
  }
</style>
