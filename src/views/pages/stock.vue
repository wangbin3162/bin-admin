<template>
  <div class="stock-wrap" @mousedown="handleMoveStart">
    <span class="link" @click="backToDetail"><b-icon name="ios-undo"></b-icon> {{ title }}</span>
    <svg :width="width" :height="height" ref="wrap">
      <!--水印图,后续替换掉-->
      <defs>
        <pattern id="watermark" patternUnits="userSpaceOnUse" width="330" height="180" x="0" y="0">
          <image width="298" height="164" x="0" y="0" xlink:href="../../assets/images/shuiyin.png"></image>
        </pattern>
      </defs>
      <rect :width="width" id="bg" :height="height" fill="url(#watermark)"></rect>
      <g :transform="wrapTrans">
        <!--法人公司的-->
        <g v-if="isLeg">
          <svg-title :transform="`translate(${-this.baseOffsetX},-26)`" :label="title"></svg-title>
          <!--绘制箭头-->
          <svg-arrow :transform="`translate(${this.baseOffsetX+ 20 },-38),rotate(-30)`"></svg-arrow>
          <svg-arrow :transform="`translate(${this.baseOffsetX+ 20 },40.2),rotate(30)`"></svg-arrow>
          <svg-arrow :transform="`translate(${-(this.baseOffsetX+40)  },-53.5),rotate(30)`"></svg-arrow>
          <svg-arrow :transform="`translate(${-(this.baseOffsetX+40)  },54.2),rotate(-30)`"></svg-arrow>
          <!--股东模块-->
          <svg-node :transform="`translate(${-(this.baseOffsetX+160)},-123)`"
                    btn-transform="translate(14,28)"
                    text-transform="translate(28,10)"
                    fill-color="#E05A48" title="股东" :count="holderTotal"
                    @on-toggle="holderExpand=!holderExpand"
                    :is-expand="holderExpand">
          </svg-node>
          <!--股东模块-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="holderTotal>0&&holderExpand" :transform="`translate(${-(this.baseOffsetX+240)},-110)`"
                      :data="holder" @on-click="handleNodeClick" color="#E05A48"
                      position="left-top"></svg-leaf>
          </transition>
          <!--高管-->
          <svg-node :transform="`translate(${-(this.baseOffsetX+160)},69)`"
                    btn-transform="translate(14,28)"
                    text-transform="translate(28,10)"
                    fill-color="#1B91BA" title="高管" :count="executivesTotal"
                    @on-toggle="executivesExpand=!executivesExpand"
                    :is-expand="executivesExpand">
          </svg-node>
          <!--高管-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="executivesTotal>0&&executivesExpand"
                      :transform="`translate(${-(this.baseOffsetX+240)},83)`"
                      :data="executives" @on-click="handleNodeClick" color="#1B91BA"
                      position="left-bottom"></svg-leaf>
          </transition>
          <!--对外投资-->
          <svg-node :transform="`translate(${this.baseOffsetX+68},-123)`"
                    btn-transform="translate(78,28)"
                    text-transform="translate(16,10)"
                    fill-color="#A66FC8" title="对外投资" :count="investTotal"
                    :title-offset="{x:-1,y:14}"
                    @on-toggle="investExpand=!investExpand"
                    :is-expand="investExpand">
          </svg-node>
          <!--对外投资-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="investTotal>0&&investExpand" :transform="`translate(${this.baseOffsetX+240},-110)`"
                      :data="invest" @on-click="handleNodeClick" color="#A66FC8"
                      position="right-top"></svg-leaf>
          </transition>
          <!--分支机构-->
          <svg-node :transform="`translate(${this.baseOffsetX+68},69)`"
                    btn-transform="translate(78,28)"
                    text-transform="translate(16,10)"
                    fill-color="#4C955A" title="分支机构" :count="branchTotal"
                    :title-offset="{x:-1,y:14}"
                    @on-toggle="branchExpand=!branchExpand"
                    :is-expand="branchExpand">
          </svg-node>
          <!--分支机构-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="branchTotal>0&&branchExpand" :transform="`translate(${this.baseOffsetX+240},83)`"
                      :data="branch" @on-click="handleNodeClick" color="#4C955A"
                      position="right-bottom"></svg-leaf>
          </transition>
        </g>
        <!--自然人的任职图-->
        <g v-else>
          <svg-title :transform="`translate(${-this.baseOffsetX},-26)`" :label="title"></svg-title>
          <!--绘制箭头-->
          <svg-arrow :transform="`translate(${-(this.baseOffsetX+20)},0),rotate(180)`"></svg-arrow>
          <svg-arrow :transform="`translate(${(this.baseOffsetX+20)},0)`"></svg-arrow>
          <!--投资公司-->
          <svg-node :transform="`translate(${-(this.baseOffsetX+160)},-26)`"
                    btn-transform="translate(14,28)"
                    text-transform="translate(28,10)" :title-offset="{x:-1,y:14}"
                    fill-color="#E05A48" title="投资公司" :count="holderTotal"
                    @on-toggle="holderExpand=!holderExpand"
                    :is-expand="holderExpand">
          </svg-node>
          <!--投资公司-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="holderTotal>0&&holderExpand" :transform="`translate(${-(this.baseOffsetX+240)},-12)`"
                      :data="holder" @on-click="handleNodeClick" color="#E05A48"
                      position="left-bottom"></svg-leaf>
          </transition>
          <!--任职公司-->
          <svg-node :transform="`translate(${(this.baseOffsetX+68)},-26)`"
                    btn-transform="translate(78,28)"
                    text-transform="translate(16,10)" :title-offset="{x:-1,y:14}"
                    fill-color="#1B91BA" title="任职公司" :count="executivesTotal"
                    @on-toggle="executivesExpand=!executivesExpand"
                    :is-expand="executivesExpand">
          </svg-node>
          <!--任职公司-叶子节点-->
          <transition name="fade-in">
            <svg-leaf v-show="executivesTotal>0&&executivesExpand"
                      :transform="`translate(${(this.baseOffsetX+240)},-12)`"
                      :data="executives" @on-click="handleNodeClick" color="#1B91BA"
                      position="right-bottom"></svg-leaf>
          </transition>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { on, off } from 'bin-ui/src/utils/dom'
  import SvgTitle from './svg-node/svg-title'
  import SvgArrow from './svg-node/svg-arrow'
  import SvgNode from './svg-node/svg-node'
  import SvgLeaf from './svg-node/svg-leaf'
  import { getCompList, getStockRightStat } from '../../api/search'

  export default {
    name: 'stock',
    components: { SvgLeaf, SvgNode, SvgArrow, SvgTitle },
    data () {
      return {
        title: '',
        width: 1000,
        height: 500,
        // title 为显示的主要文字，label为次要文字，暂时统一为一行  { title: '上海雁信数据服务有限公司', type: '1', ratio: '60%' },
        holder: [],
        holderExpand: true,
        holderTotal: 0,
        executives: [], // { title: '邢刚', type: '1', label: '监事' }
        executivesExpand: true,
        executivesTotal: 0,
        invest: [],
        investExpand: true,
        investTotal: 0,
        branch: [],
        branchExpand: true,
        branchTotal: 0,
        transformData: {
          x: 960,
          y: 500
        },
        scale: 1,
        dragData: {
          startX: 0,
          startY: 0,
          dragX: 0,
          dragY: 0,
          dragging: false
        }
      }
    },
    created () {
      const { id, reason, type, title } = this.$route.query
      // 判断是否携带参数，如有参数则缓存vuex，如无参数则默认退回首页
      if (title) {
        this.title = title
      }
      if (id && reason && type) {
        this.$store.dispatch('setQuery', { id, reason, type })
        this.getStockData()
      } else {
        this.$router.push({ name: 'index' })
      }
    },
    mounted () {
      this.resizeSvgSize()
    },
    computed: {
      ...mapGetters(['queryData']),
      wrapTrans () {
        return `translate(${this.transformData.x},${this.transformData.y}) scale(${this.scale})`
      },
      type () {
        return this.queryData.type
      },
      isLeg () {
        return this.type === this.ENUM.Leg
      },
      baseOffsetX () {
        let fontWidth = this.title.length * 14 + 16 * 2
        return Math.floor(fontWidth / 2)
      }
    },
    methods: {
      // 返回上一层路由
      backToDetail () {
        this.$router.push({
          name: 'detail',
          query: {
            id: this.$route.query.id,
            type: this.$route.query.type,
            reason: this.$route.query.reason
          }
        })
      },
      resizeSvgSize () {
        this.width = document.body.clientWidth
        this.height = document.body.clientHeight
        // 408,248的最小宽高，计算居中显示
        this.transformData.x = this.width / 2
        this.transformData.y = this.height / 2
        this.mousewheelEl = this.$refs.wrap
        this.mousewheelEl.addEventListener('mousewheel', this.handleMousewheel, false)
      },
      // 获取股权分析数据
      getStockData () {
        if (this.isLeg) {
          getStockRightStat(this.queryData.id).then(res => {
            if (res.data.code === '0') {
              const { holder, executives, invest, branch } = res.data.data
              // 股东数据
              this.holder = holder.rows
              this.holderTotal = holder.total
              // 高管
              this.executives = executives.rows
              this.executivesTotal = executives.total
              // 对外投资
              this.invest = invest.rows
              this.investTotal = invest.total
              // 分支机构
              this.branch = branch.rows
              this.branchTotal = branch.total
            }
          })
        } else {
          // 如果是自然人则需要拉取任职公司列表来填充投资和任职对象
          getCompList(this.title, this.type).then(res => {
            if (res.status === 200) {
              let data = res.data.rows
              data.forEach(item => {
                if (item.type === 'holder') {
                  this.holder.push({ title: item.comp_name, type: '1', id: item.id, person_id: item.person_id })
                  this.holderTotal++
                } else {
                  this.executives.push({ title: item.comp_name, type: '1', id: item.id, person_id: item.person_id })
                  this.executivesTotal++
                }
              })
            }
          })
        }
      },
      // 点击了对应的人员或者公司，需要跳转查询
      handleNodeClick (item) {
        if (!item.person_id) {
          this.$message({ type: 'warning', content: '暂无相关信息数据！' })
          return
        }
        this.$open(`/#/detail?id=${item.person_id}&type=${item.type}&reason=${this.queryData.reason}&q=${item.title}`, true)
      },
      // 鼠标拖动事件函数
      handleMoveStart (event) {
        // 计算鼠标的相对位置
        const distance = {
          x: event.clientX,
          y: event.clientY
        }
        // 缓存鼠标点击位置，会事实更新
        this.dragData.dragX = distance.x
        this.dragData.dragY = distance.y
        // 记录开始的xy
        this.dragData.startX = this.transformData.x
        this.dragData.startY = this.transformData.y
        this.dragData.dragging = true
        on(window, 'mousemove', this.handleMoveMove)
        on(window, 'mouseup', this.handleMoveEnd)
      },
      handleMoveMove (event) {
        if (!this.dragData.dragging) return false
        const distance = {
          x: event.clientX,
          y: event.clientY
        }
        // 鼠标走的像素数需要换算成缩放画布的实际移动数
        const diffDistance = {
          x: Math.floor((distance.x - this.dragData.dragX) / this.scale) * this.scale,
          y: Math.floor((distance.y - this.dragData.dragY) / this.scale) * this.scale
        }
        // 计算间距需要除以缩放比例否则移动像素对不齐
        this.transformData.x = this.dragData.startX + diffDistance.x
        this.transformData.y = this.dragData.startY + diffDistance.y
      },
      handleMoveEnd () {
        this.dragData.dragging = false
        off(window, 'mousemove', this.handleMoveMove)
        off(window, 'mouseup', this.handleMoveEnd)
      },
      // 鼠标滚轮函数
      handleMousewheel (event) {
        let delta = Math.max(-1, Math.min(1, event.wheelDelta))
        this.scale += (delta * 0.1)
        this.scale = Math.max(1, Math.min(2, this.scale))
        return false
      }
    }
  }
</script>

<style scoped lang="stylus">
  .stock-wrap {
    position: fixed;
    background-color: #fff;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    .link {
      position: absolute;
      top: 30px;
      left: 120px;
      color: #0084ff;
    }
  }
</style>
