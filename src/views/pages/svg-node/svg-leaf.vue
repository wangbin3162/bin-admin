<template>
  <g :transform="transform" :style="leafStyle" class="svg-leaf">
    <g v-for="(item,index) in data" :key="index" class="svg-node pointer"
       :transform="getTrans(index)" @click="handleClick(item)">
      <rect class="node-rect" rx="2" ry="2" height="30"
            :width="getWidth(item.title)" :x="rectX(item.title)" :style="{stroke:color}"></rect>
      <text font-size="12px" y="20" :x="rectX(item.title)+15" class="node-text" style="opacity: 1;">
        {{ item.title }}
      </text>
      <line x1="0" y1="15" :x2="lineX2" y2="15" class="node-line" :style="{stroke:color}"></line>
      <text v-if="item.ratio" font-size="12px" class="node-percent" x="8" y="8" :style="{fill:color,opacity: 0.8}">
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
    name: 'svg-leaf',
    props: {
      transform: {
        type: String,
        default: null
      },
      expand: {
        type: Boolean,
        required: true
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
      leafStyle () {
        return this.expand ? null : { opacity: 0 }
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
      getWidth (txt) {
        return txt.length * 12 + 30
      },
      rectX (txt) {
        return this.position.includes('left-') ? -this.getWidth(txt) : 0
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
