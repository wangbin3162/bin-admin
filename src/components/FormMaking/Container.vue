<template>
  <div>
    <transition name="move-right">
      <div v-if="visible" class="fm-container">
        <div class="fm-header">
          <div class="title">
            <span class="logo">F</span>
            {{ topTitle }}
            <b-icon name="ios-radio-button-on" v-if="isEdit" color="#fea638" size="14" style="margin-left: 8px;"/>
          </div>
          <div class="right">
            <b-icon name="close" @click.native="close"/>
          </div>
        </div>
        <div class="fm-content">
          <div class="components-list">components-list</div>
          <div class="center-container">
            <div class="top-fix">
              <b-button type="text" @click="handleClear">
                <b-icon name="ios-trash"/>&nbsp;清空
              </b-button>
              <b-button type="text">
                <b-icon name="ios-eye"/>&nbsp;预览
              </b-button>
              <b-button type="text">
                <b-icon name="ios-paper"/>&nbsp;编辑JSON
              </b-button>
            </div>
            <div class="scroll-content">
              <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
            </div>
          </div>
          <div class="widget-config-container">
            <div class="top-fix">
              <div v-for="item in tabs" :key="item.key"
                   class="tab-item" :class="{'active':item.key === activeTab}"
                   @click="activeTab=item.key">
                {{ item.title }}
              </div>
            </div>
            <div class="scroll-content">
              {{ activeTab }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import scrollbarMixin from 'bin-ui/src/mixins/scrollbar-mixin'
import { deepCopy } from '@/common/utils/assist'
import WidgetForm from '@/components/FormMaking/WidgetForm'

export default {
  name: 'fm-container',
  components: { WidgetForm },
  mixins: [scrollbarMixin],
  provide() {
    return { ConfigRoot: this }
  },
  data() {
    return {
      visible: false,
      widgetForm: {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      tabs: [
        { key: 'tab1', title: '字段属性' },
        { key: 'tab2', title: '表单属性' }
      ],
      activeTab: 'tab1',
      widgetFormSelect: null,
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
    topTitle() {
      return `表单设计 - ${this.widgetForm.config.name}`
    },
    isEdit() {
      return false
    }
  },
  methods: {
    // 打开弹窗参数为配置数据
    open(data) {
      this.visible = true
      this.widgetForm = deepCopy(data)
    },
    // 关闭
    close() {
      if (this.isEdit) { // 如果已经修改过，则弹窗提示是否保存
        this.closeModal = true
      } else {
        this.visible = false
      }
    },
    // btn-bar
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      }
      this.widgetFormSelect = {}
    }
  }
}
</script>

<style lang="stylus">
@import './style.styl'
</style>
