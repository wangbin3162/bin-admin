<template>
  <transition name="move-right">
    <div v-show="visible" class="resource-cfg-modal">
      <div class="header">
        <div class="title">
          <b-icon name="ios-undo" @click.native="close"/>
          {{ resourceTitle }}
        </div>
        <b-icon name="close" @click.native="close"/>
      </div>
      <div class="content">
        <ctrl-panel v-model="currentList"/>
      </div>
    </div>
  </transition>
</template>

<script>
  import scrollbarMixin from 'bin-ui/src/mixins/scrollbar-mixin'
  import CtrlPanel from './CtrlPanel'
  import { deepCopy } from '../../common/utils/assist'

  export default {
    name: 'ChartsConfigPanel',
    components: { CtrlPanel },
    mixins: [scrollbarMixin],
    data() {
      return {
        visible: false,
        currentList: [],
        resource: { resourceName: '' }
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
        return `挖掘配置 - ${this.resource.resourceName}`
      }
    },
    methods: {
      // 打开弹窗，第一个为资源名称，第二个为原始数据列表（用于回显）
      open(resource, data) {
        this.visible = true
        this.resource = deepCopy(resource)
        this.currentList = deepCopy(data)
      },
      // 关闭
      close() {
        this.visible = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .resource-cfg-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    background-color: #fff;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    z-index: 1000;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      height: 54px;
      background-color: #1089ff;
      color: #f0f0f0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      padding: 16px 24px;
      .title {
        width: 90%;
        font-weight: 500;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #f0f0f0;
        white-space: nowrap;
      }
      .iconfont {
        font-size: 20px;
        cursor: pointer;
        color: #f0f0f0;
      }
    }
    .content {
      position: absolute;
      width: 100%;
      top: 55px;
      bottom: 0;
      overflow: hidden;
    }
  }
</style>
