<template>
  <svg width="100%" :height="totalHeight" ref="wrap">
    <g :transform="getNodeTransform(index)" v-for="(item,index) in data" :key="item.id||index">
      <g>
        <rect :width="nodeWidth(index,resourceName)" :height="nodeHeight" x="1" y="1" rx="2" ry="2"
              class="node-rect"></rect>
        <text x="18" y="27" style="font-size: 14px;">{{resourceName}}</text>
      </g>
      <g :transform="arrowTrans(index,resourceName)">
        <polygon points="0,0 100,0 100,-6 120,1 100,8 100,2 0,2"
                 style="fill: rgb(0, 132, 255); opacity: 0.5;"></polygon>
        <text x="40" y="-4" style="font-size: 14px;">{{ typeMap[item.syncType] }}</text>
      </g>
      <g :transform="targetTrans(index,resourceName)">
        <rect :width="nodeWidth(index,item.targetName)" :height="nodeHeight" x="1" y="1" rx="2" ry="2"
              class="node-rect" style="stroke: rgb(166, 111, 200);fill: rgb(166, 111, 200);"></rect>
        <text x="18" y="27" style="font-size: 14px;">{{ item.targetName }}</text>
      </g>
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'SyncSvg',
    props: {
      resourceName: {
        type: String,
        required: true
      },
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        nodeHeight: 40,
        marginBottom: 24,
        typeMap: { A: '添加', M: '修改', D: '删除' }
      }
    },
    computed: {
      totalHeight() {
        return this.data.length * (this.nodeHeight + this.marginBottom) - this.marginBottom + 2
      }
    },
    methods: {
      // 宽高根据字数和字体大小自动计算，如传入了则直接返回对应宽高
      nodeWidth(index, label) {
        return label.length * 14 + 16 * 2
      },
      // 获取偏移
      getNodeTransform(index) {
        return `translate(0,${index * this.nodeHeight + (index > 0 ? this.marginBottom : 0)})`
      },
      // 箭头偏移
      arrowTrans(index, label) {
        let x = this.nodeWidth(index, label) + 24
        return `translate(${x},20)`
      },
      // 目标资源偏移
      targetTrans(index, label) {
        let x = this.nodeWidth(index, label) + 120 + 24 * 2
        return `translate(${x},0)`
      }
    }
  }
</script>

<style scoped>
  .node-rect {
    fill: #1089ff;
    fill-opacity: .1;
    opacity: 1;
    stroke: #1089ff;
    stroke-width: 1;
    stroke-opacity: .5;
  }
</style>
