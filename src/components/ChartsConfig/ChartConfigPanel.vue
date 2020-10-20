<template>
  <div>
    <transition name="move-right">
      <div v-if="visible" class="resource-cfg-modal">
        <div class="header">
          <div class="title">
            {{ resourceTitle }}
            <b-icon name="ios-radio-button-on" v-if="isEdit" color="#fea638" size="14" style="margin-right: 16px;"/>
          </div>
          <div class="right">
            <b-icon name="close" @click.native="close"/>
          </div>
        </div>
        <div class="content">
          <ctrl-panel ref="ctrlPanel" :list="currentList" @update="handleUpdate" @save="handleSave"/>
        </div>
      </div>
    </transition>
    <b-modal v-model="closeModal" footer-hide :mask-closable="false" width="400" :styles="{top: '200px'}"
             stop-remove-scroll>
      <div flex="main:justify">
        <b-icon name="ios-warning" size="60" color="#fea638" style="padding-top: 8px;"/>
        <div>
          <div style="padding:4px 16px;color: rgba(0,0,0,.85);">
            是否保存对"{{ resourceTitle }}"的更改？
          </div>
          <div style="padding:8px 16px 0;" flex="main:justify">
            <b-button size="mini" @click="closeSave(false)">不保存</b-button>
            <div>
              <b-button size="mini" @click="closeModal=false">取消</b-button>
              <b-button size="mini" type="primary" @click="closeSave(true)">保存</b-button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import scrollbarMixin from 'bin-ui/src/mixins/scrollbar-mixin'
import CtrlPanel from './CtrlPanel'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'ChartsConfigPanel',
  components: { CtrlPanel },
  mixins: [scrollbarMixin],
  provide() {
    return { ConfigRoot: this }
  },
  data() {
    return {
      visible: false,
      currentList: [],
      updateList: [],
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
    },
    isEdit() {
      return !(JSON.stringify(this.currentList) === JSON.stringify(this.updateList))
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keypadSave)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keypadSave)
  },
  methods: {
    // 打开弹窗，第一个为资源名称，第二个为原始数据列表（用于回显）
    open(resource, data) {
      this.visible = true
      this.resource = deepCopy(resource)
      this.currentList = deepCopy(data)
      this.updateList = deepCopy(data)
    },
    // 关闭
    close() {
      if (this.isEdit) { // 如果已经修改过，则弹窗提示是否保存
        this.closeModal = true
      } else {
        this.visible = false
      }
    },
    // 是否保存并关闭
    closeSave(save) {
      if (save) {
        // 触发一下保存按钮操作,此部分会触发保存按钮操作指令handleSave
        this.$refs.ctrlPanel.handleSaveCfg()
      }
      this.closeModal = false
      this.visible = false
    },
    // 内部数据更新
    handleUpdate(list) {
      // this.$log.danger('====更新数据====>')
      // console.log(list)
      this.updateList = list
    },
    // 保存按钮操作指令
    handleSave(list) {
      this.updateList = deepCopy(list)
      this.currentList = deepCopy(list)
      this.$emit('save', this.currentList)
    },
    // 键盘保存
    keypadSave(e) {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.$refs.ctrlPanel.handleSaveCfg()
      }
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
    .right {
      display: flex;
      align-items: center
      .iconfont {
        font-size: 22px;
        cursor: pointer;
        color: #f0f0f0;
        border-radius: 50%;
      }
      .icon-close {
        padding: 4px;
        font-size: 18px;
        &:hover {
          color: #ffffff;
          background: #ff7072;
        }
      }
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
