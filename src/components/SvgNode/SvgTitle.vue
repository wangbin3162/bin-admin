<template>
  <g :transform="transform">
    <rect :width="nodeWidth" :height="nodeHeight" x="0" y="0" rx="2" ry="2"
          style="fill: rgb(0, 132, 255); opacity: 0.8;"></rect>
    <text y="16" style="fill: rgb(255, 255, 255); font-size: 14px; font-weight: bold;">
      <tspan class="text" x="16" dy="1em">{{ label }}</tspan>
    </text>
  </g>
</template>

<script>
  export default {
    name: 'SvgTitle',
    props: {
      label: {
        type: String,
        required: true
      },
      transform: {
        type: String,
        default: null
      },
      width: Number,
      height: Number
    },
    computed: {
      // 宽高根据字数和字体大小自动计算，如传入了则直接返回对应宽高
      nodeWidth () {
        if (this.width) return this.width
        return this.label.length * 14 + 16 * 2
      },
      nodeHeight () {
        if (this.height) return this.height
        return 14 + 2 + 16 * 2
      }
    }
  }
</script>
