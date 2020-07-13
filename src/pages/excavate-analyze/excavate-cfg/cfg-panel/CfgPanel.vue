<template>
  <transition name="move-right">
    <div v-show="visible" class="resource-cfg-modal">
      <div class="header">
        <div class="title">
          <b-icon name="ios-undo" @click.native="visible = false"/>
          资源信息分析配置
        </div>
        <b-icon name="close" @click.native="visible = false"/>
      </div>
      <div class="content">
        <p style="text-align: center;">{{resourceTitle}}</p>
        <p v-for="i in 100" :key="i">填充行{{ i }}...</p>
      </div>
    </div>
  </transition>
</template>

<script>
  import scrollbarMixin from 'bin-ui/src/mixins/scrollbar-mixin'
  import './cfg-panel.styl'

  export default {
    name: 'CfgPanel',
    inject: ['Excavate'],
    mixins: [scrollbarMixin],
    data() {
      return {
        visible: false
      }
    },
    watch: {
      visible(val) {
        if (val === false) {
          // 关闭内容显示
          this.timer = setTimeout(() => {
            this.removeScrollEffect()
          }, 200)
        } else {
          if (this.timer) clearTimeout(this.timer)
          this.addScrollEffect()
        }
      }
    },
    computed: {
      resourceTitle() {
        return this.Excavate.resource.resourceName + ' - 挖掘配置'
      }
    },
    methods: {
      open() {
        this.visible = true
      }
    }
  }
</script>
