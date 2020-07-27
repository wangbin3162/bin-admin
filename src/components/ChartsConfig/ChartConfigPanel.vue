<template>
  <div>
    <transition name="move-right">
      <div v-if="visible" class="resource-cfg-modal">
        <div class="header">
          <div class="title">
            <b-icon name="ios-undo" @click.native="close"/>
            {{ resourceTitle }}
          </div>
          <b-icon name="close" @click.native="close"/>
        </div>
        <div class="content">
          <ctrl-panel ref="ctrlPanel" :list="currentList" @on-save="handleSave"/>
        </div>
      </div>
    </transition>
    <b-modal v-model="closeModal" footer-hide :mask-closable="false" width="400">
      <div>
        <div style="line-height: 44px;font-size: 16px;">
          <b-icon name="ios-warning" size="28" color="#fea638"/>
          <span style="display: inline-block;vertical-align: middle;margin-left: 12px;color: rgba(0,0,0,.85);">
            确定关闭吗？
          </span>
        </div>
        <p style="padding-left: 42px;color: rgba(0,0,0,.65);">
          在关闭当前配置面板时请确保已经<span style="color: #ff4d4f;">保存</span>！
        </p>
      </div>
      <div style="text-align: right;padding-top: 16px;">
        <b-button type="danger" @click="closeSave(false)">关闭</b-button>
        <b-button type="primary" @click="closeSave(true)">保存并关闭</b-button>
      </div>
    </b-modal>
  </div>
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
        resource: { resourceName: '' },
        closeModal: false
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
        this.closeModal = true
      },
      // 是否保存并关闭
      closeSave(save) {
        if (save) {
          // 触发一下保存按钮操作
          this.$refs.ctrlPanel.handleSaveCfg()
        }
        this.closeModal = false
        this.visible = false
      },
      // 保存按钮操作，调用api
      handleSave(list) {
        this.chartsList = list
        this.saveSubmit()
      },
      saveSubmit() {
        this.$log.success('====最终保存,提交api====>')
        console.log(this.chartsList)
        this.$emit('save-success', this.chartsList)
        // 保存成功给出提示
        this.$notice.success({ title: '保存配置成功！' })
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
