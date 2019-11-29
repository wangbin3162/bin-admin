<template>
  <g class="svg-node pointer" :transform="transform" @click="toggleExpand">
    <g>
      <rect class="button-rect" :width="width" :height="height" rx="2" ry="2"
            :style="{fill:fillColor}"></rect>
    </g>
    <g :transform="textTransform">
      <text style="font-size: 12px; font-weight: bold;" :x="titleOffset.x" :y="titleOffset.y" fill="#333">
        {{ title }}
      </text>
      <text y="32" x="20.5" fill="#666" style="font-size: 12px;">
        {{ count }}
      </text>
    </g>
    <g :transform="btnTransform" v-if="count>0">
      <circle class="button-circle" :style="{stroke:fillColor}" r="6"></circle>
      <path class="button-cross pointer" x="0" y="0" id="holder-button-cross" :style="{fill:fillColor}"
            :d="nodeBtnD"></path>
    </g>
  </g>
</template>

<script>
  export default {
    name: 'svg-node',
    props: {
      transform: {
        type: String,
        default: null
      },
      btnTransform: {
        type: String,
        default: null
      },
      textTransform: {
        type: String,
        default: null
      },
      fillColor: {
        type: String,
        default: '#fff'
      },
      width: {
        type: Number,
        default: 92
      },
      height: {
        type: Number,
        default: 56
      },
      isExpand: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '标题'
      },
      titleOffset: {
        type: Object,
        default () {
          return {
            x: 11.5,
            y: 14
          }
        }
      },
      count: {
        type: Number,
        default: 0
      }
    },
    computed: {
      nodeBtnD () {
        return this.isExpand ? 'M-4 -1 H4 V1 H-4 Z' : 'M-4 -1 H-1 V-4 H1 V-1 H4 V1 H1 V4 H-1 V1 H-4 Z'
      }
    },
    methods: {
      toggleExpand () {
        if (!this.count || this.count === 0) return
        this.$emit('on-toggle')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .pointer {
    cursor: pointer;
  }
  .svg-node {
    .button-rect {
      opacity: 0.15;
      transition: opacity .3s;
    }
    .button-circle {
      fill: none;
      stroke-width: 1;
    }
    &:hover {
      .button-rect {
        opacity: 0.2;
      }
    }
  }
</style>
