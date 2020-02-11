<template>
  <g :transform="transform" class="svg-leaf">
    <g v-for="(item,index) in data" :key="index" class="svg-node pointer"
       :transform="getTrans(index)" @click="handleClick(item)">
      <!--item边框线-->
      <rect class="node-rect" rx="2" ry="2" height="30"
            :width="getRectWidth(item)" :x="rectX(item)" :style="{stroke:color}"></rect>
      <!--一级标题-->
      <text font-size="12px" y="20" :x="titleX(item)" class="node-text" style="opacity: 1;">
        {{ item.title }}
      </text>
      <!--二级标题-->
      <text v-if="item.label" font-size="12px" y="20" :x="labelX(item)" class="node-text2"
            style="opacity: 1;fill: rgb(102,102,102);">
        {{ item.label }}
      </text>
      <!--item横向线条-->
      <line x1="0" y1="15" :x2="lineX2" y2="15" class="node-line" :style="{stroke:color}"></line>
      <!--百分比数字-->
      <text v-if="item.ratio" font-size="12px" class="node-percent" :x="ratioX" y="8"
            :style="{fill:color,opacity: 0.8}">
        {{ item.ratio }}
      </text>
    </g>
    <!--竖向线条-->
    <line :x1="lineX2" y1="15" :x2="lineX2" :y2="lineVerticalY2" class="node-line" :style="{stroke:color}"></line>
    <!--横向线条-->
    <line :x1="lineX2" y1="15" :x2="lineHorizontalX2" y2="15" class="node-line" :style="{stroke:color}"></line>
  </g>
</template>

<script>
  export default {
    name: 'SvgLeaf',
    props: {
      transform: {
        type: String,
        default: null
      },
      data: {
        type: Array,
        required: true
      },
      position: {
        type: String,
        default: 'left-top', // 方向类型
        validator (value) {
          return ['left-top', 'left-bottom', 'right-top', 'right-bottom'].indexOf(value) > -1
        }
      },
      color: {
        type: String,
        default: '#fff'
      }
    },
    computed: {
      // 百分比位置
      ratioX () {
        return this.position.includes('left-') ? 8 : -32
      },
      // 节点线x2坐标
      lineX2 () {
        return this.position.includes('left-') ? 60 : -60
      },
      // 竖向线Y2坐标
      lineVerticalY2 () {
        const height = (this.data.length - 1) * 40
        return this.position.includes('-top') ? -(height - 15) : height + 15
      },
      // 横向线 X2坐标
      lineHorizontalX2 () {
        return this.position.includes('left-') ? this.lineX2 + 20 : this.lineX2 - 20
      }
    },
    methods: {
      // 根据索引获取每个item的偏移量
      getTrans (index) {
        const offsetY = 30 + 10 // 38 为高度28+偏移量10
        return this.position.includes('-top') ? `translate(0,-${index * offsetY})` : `translate(0,${index * offsetY})`
      },
      getRectWidth (item) {
        let t = item.title ? item.title.length * 12 : 0
        let l = item.label ? (item.label.length * 12 + 8) : 0
        return t + l + 30
      },
      // rect偏移量
      rectX (item) {
        return this.position.includes('left-') ? -this.getRectWidth(item) : 0
      },
      // 一级标题偏移量
      titleX (item) {
        return this.rectX(item) + 15
      },
      // 二级标题偏移量
      labelX (item) {
        // 等于一级标题的偏移量+一级标题的长度+8
        return this.titleX(item) + item.title.length * 12 + 8
      },
      handleClick (item) {
        this.$emit('on-click', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .pointer {
    cursor: pointer;
  }
  .svg-leaf {
    transition: .3s;
  }
  .node-line {
    stroke-opacity: 0.5;
  }
  .svg-node {
    .node-rect {
      fill: rgb(255, 255, 255);
      fill-opacity: 0.3;
      opacity: 1;
      stroke-width: 1;
      stroke-opacity: 0.5;
      transition: .3s;
    }
    &:hover {
      .node-rect {
        stroke-opacity: 1;
      }
      .node-text {
        font-weight: bold;
      }
    }
  }
</style>
