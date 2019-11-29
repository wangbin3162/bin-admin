<template>
  <div class="stock-wrap">
    <span class="link" @click="backToDetail"><b-icon name="ios-undo"></b-icon> {{ title }}</span>
    <svg :width="width" :height="height">
      <!--水印图,后续替换掉-->
      <defs>
        <pattern id="watermark" patternUnits="userSpaceOnUse" width="280" height="180" x="0" y="0">
          <image width="280" height="180" x="0" y="0"
                 xlink:href="data:image/png;base64,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"></image>
        </pattern>
      </defs>
      <rect width="1920" id="bg" height="698" fill="url(#watermark)"></rect>
      <g transform="translate(960,500) scale(1)">
        <g>
          <svg-title transform="translate(-100,-26)" :label="title"></svg-title>
          <!--绘制箭头-->
          <svg-arrow transform="translate(119,-38),rotate(-30)"></svg-arrow>
          <svg-arrow transform="translate(120,40.2),rotate(30)"></svg-arrow>
          <svg-arrow transform="translate(-145,-53.5),rotate(30)"></svg-arrow>
          <svg-arrow transform="translate(-146.4,54.2),rotate(-30)"></svg-arrow>
          <!--股东模块-->
          <svg-node transform="translate(-260,-123)"
                    btn-transform="translate(14,28)"
                    text-transform="translate(28,10)"
                    fill-color="#E05A48" title="股东" :count="6"
                    @on-toggle="holderExpand=!holderExpand"
                    :is-expand="holderExpand">
          </svg-node>
          <!--股东模块-叶子节点-->
          <svg-leaf transform="translate(-340,-110)" color="#E05A48"
                    :data="holder" :expand="holderExpand" @on-click="handleNodeClick"
                    position="left-top"></svg-leaf>
          <!--高管-->
          <svg-node transform="translate(-260,69)"
                    btn-transform="translate(14,28)"
                    text-transform="translate(28,10)"
                    fill-color="#1B91BA" title="高管" :count="2"
                    @on-toggle="executivesExpand=!executivesExpand"
                    :is-expand="executivesExpand">
          </svg-node>
          <!--高管-叶子节点-->
          <svg-leaf transform="translate(-340,83)" color="#1B91BA"
                    :data="executives" :expand="executivesExpand" @on-click="handleNodeClick"
                    position="left-bottom"></svg-leaf>
          <!--对外投资-->
          <svg-node transform="translate(168,-123)"
                    btn-transform="translate(78,28)"
                    text-transform="translate(16,10)"
                    fill-color="#A66FC8" title="对外投资" :count="2"
                    :title-offset="{x:-1,y:14}"
                    @on-toggle="investExpand=!investExpand"
                    :is-expand="investExpand">
          </svg-node>
          <!--对外投资-叶子节点-->
          <svg-leaf transform="translate(340,-110)" color="#A66FC8"
                    :data="invest" :expand="investExpand" @on-click="handleNodeClick"
                    position="right-top"></svg-leaf>
          <!--分支机构-->
          <svg-node transform="translate(168,69)"
                    btn-transform="translate(78,28)"
                    text-transform="translate(16,10)"
                    fill-color="#4C955A" title="分支机构" :count="2"
                    :title-offset="{x:-1,y:14}"
                    @on-toggle="branchExpand=!branchExpand"
                    :is-expand="branchExpand">
          </svg-node>
          <!--分支机构-叶子节点-->
          <svg-leaf transform="translate(340,83)" color="#4C955A"
                    :data="branch" :expand="branchExpand" @on-click="handleNodeClick"
                    position="right-bottom"></svg-leaf>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  import SvgTitle from './svg-node/svg-title'
  import SvgArrow from './svg-node/svg-arrow'
  import SvgNode from './svg-node/svg-node'
  import SvgLeaf from './svg-node/svg-leaf'

  export default {
    name: 'stock',
    components: { SvgLeaf, SvgNode, SvgArrow, SvgTitle },
    data () {
      return {
        title: '徐州新云网络科技有限公司',
        width: 1000,
        height: 500,
        // title 为显示的主要文字，label为次要文字，暂时统一为一行
        holder: [
          { title: '上海雁信数据服务有限公司', type: '1', ratio: '60%' },
          { title: '邢刚', type: '2', ratio: '20%' },
          { title: '张城炜', type: '2', ratio: '12%' },
          { title: '蒋贵重', type: '2', ratio: '3%' },
          { title: '江浩', type: '2', ratio: '3%' },
          { title: '曹雷', type: '2', ratio: '2%' },
          { title: '大米科技', type: '1' }
        ],
        holderExpand: true,
        executives: [
          { title: '邢刚', type: '1', label: '监事' },
          { title: '张城炜', type: '1', label: '执行董事兼总经理' }
        ],
        executivesExpand: true,
        invest: [
          { title: '武汉雁信信息科技有限公司', type: '1' },
          { title: '江苏新蝶数字科技有限公司', type: '1' },
          { title: '大米科技', type: '1' }
        ],
        investExpand: true,
        branch: [
          { title: '大米科技', type: '1' },
          { title: '雅虎科技', type: '1' }
        ],
        branchExpand: true
      }
    },
    mounted () {
      this.resizeSvgSize()
    },
    methods: {
      // 返回上一层路由
      backToDetail () {
        this.$router.back()
      },
      resizeSvgSize () {
        this.width = document.body.clientWidth
        this.height = document.body.clientHeight
      },
      handleNodeClick (item) {
        // 设置缓存查询条件，并跳转至index路由去查询
        this.$store.dispatch('setSearchData', {
          type: item.type || '1',
          reason: '',
          q: item.title
        })
        this.$router.push('/')
      },
      // 查询
      handleSearch () {
        this.listQuery.q = this.searchData.q
        this.listQuery.type = this.searchData.type
        if (this.listQuery.q.length > 0) {
          this.searchListData()
        } else {
          this.$message({ type: 'danger', content: '请输入查询条件后查询' })
        }
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
    z-index: 1040;
    .link {
      position: absolute;
      top: 30px;
      left: 120px;
      color: #0084ff;
    }
  }
</style>
