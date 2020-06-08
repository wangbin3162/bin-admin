<template>
  <svg width="100%" :height="data.length*100" ref="wrap">
    <g v-for="(item,index) in data" :key="item.id||index">
      <!--原资源-->
      <g :transform="getNodeTransform(index)">
        <rect :width="nodeWidth(index)" :height="nodeHeight(index)" x="0" y="0" rx="2" ry="2"
              style="fill: rgb(0, 132, 255); opacity: 0.8;"></rect>
        <!--      <text y="16" style="fill: rgb(255, 255, 255); font-size: 14px; font-weight: bold;">-->
        <!--        <tspan class="text" x="16" dy="1em">{{resource.resourceName}}</tspan>-->
        <!--      </text>-->
      </g>
    </g>
  </svg>
  <!--<div class="sync-item" v-for="(item,index) in resource.sync" :key="item.id||index">-->
  <!--{{resource.resourceName}} &ndash;&gt; {{ item.targetName }} {{ {A:'添加',M:'修改',D:'删除'}[item.syncType] }}-->
  <!--</div>-->
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
        typeMap: { A: '添加', M: '修改', D: '删除' }
      }
    },
    methods: {
      // 宽高根据字数和字体大小自动计算，如传入了则直接返回对应宽高
      nodeWidth(index, label) {
        return label.length * 14 + 16 * 2
      },
      nodeHeight(index) {
        return 14 + 2 + 16 * 2
      },
      // 获取偏移
      getNodeTransform(index) {
        return `translate(${index},-26)`
      }
    }
  }
</script>

<style scoped>

</style>
