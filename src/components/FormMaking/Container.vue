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
          <div class="components-list">
            <b-scrollbar style="height: 100%;">
              <!--基础字段-->
              <template v-if="basicFields.length">
                <div class="widget-cate">基础字段</div>
                <draggable tag="ul" :list="basicComponents"
                           v-bind="{group:{ name:'form', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                           :move="handleMove"
                >
                  <template v-for="(item, index) in basicComponents">
                    <li v-if="basicFields.indexOf(item.type)>=0" class="form-edit-widget-label"
                        :class="{'no-put': item.type === 'divider'}" :key="index"
                        @click="handleAddWidget(item)">
                      <a>
                        <b-icon :name="item.icon"/>
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
              <!--布局控件-->
              <template v-if="layoutFields.length">
                <div class="widget-cate">布局控件</div>
                <draggable tag="ul" :list="layoutComponents"
                           v-bind="{group:{ name:'form', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                           :move="handleMove"
                >
                  <template v-for="(item, index) in layoutComponents">
                    <li v-if="layoutFields.indexOf(item.type) >=0" class="form-edit-widget-label no-put" :key="index"
                        @click="handleAddWidget(item)">
                      <a>
                        <b-icon :name="item.icon"/>
                        <span>{{ item.name }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </template>
            </b-scrollbar>
          </div>
          <div class="center-container">
            <div class="top-fix">
              <b-button type="text" @click="handlePreview">
                <b-icon name="ios-eye"/>&nbsp;预览
              </b-button>
              <b-button type="text" @click="handleShowJson">
                <b-icon name="ios-paper"/>&nbsp;编辑JSON
              </b-button>
              <b-button type="text" @click="handleSave">
                <b-icon name="ios-save"/>&nbsp;保存
              </b-button>
              <b-button type="text" text-color="danger" @click="handleClear">
                <b-icon name="ios-trash"/>&nbsp;清空
              </b-button>
            </div>
            <div class="scroll-content">
              <b-scrollbar style="height: 100%;">
                <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
              </b-scrollbar>
            </div>
          </div>
          <div class="right-config-container">
            <div class="top-fix">
              <div v-for="item in tabs" :key="item.key"
                   class="tab-item" :class="{'active':item.key === activeTab}"
                   @click="activeTab=item.key">
                {{ item.title }}
              </div>
            </div>
            <div class="config-content">
              <b-scrollbar style="height: 100%;">
                <widget-config v-show="activeTab==='widget'" :data="widgetFormSelect"></widget-config>
                <form-config v-show="activeTab==='form'" ref="formConfig" :data="widgetForm.config"></form-config>
              </b-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--查看json-->
    <b-modal v-model="jsonModal" title="编辑JSON" width="800px" stop-remove-scroll>
      <div v-if="jsonModal">
        <b-ace-editor v-model="jsonOptions" height="400" width="752" :snippets="false"/>
      </div>
      <div slot="footer">
        <b-button @click="jsonModal = false">取消</b-button>
        <b-button type="primary" @click="jsonChange">确定</b-button>
      </div>
    </b-modal>
    <!--预览弹窗-->
    <form-preview ref="formPreview"></form-preview>
    <b-modal v-model="closeModal" footer-hide :mask-closable="false" width="400" :styles="{top: '200px'}"
             stop-remove-scroll>
      <div flex="main:justify">
        <b-icon name="ios-warning" size="60" color="#fea638" style="padding-top: 6px;"/>
        <div style="width: 280px;">
          <div style="padding:4px 16px;color: rgba(0,0,0,.85);">
            是否保存对当前表单的操作？
          </div>
          <div style="padding:8px 16px 0;" flex="main:justify">
            <b-button size="small" @click="closeSave(false)">不保存</b-button>
            <div>
              <b-button size="small" @click="closeModal=false">取 消</b-button>
              <b-button size="small" type="primary" @click="closeSave(true)">保 存</b-button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import scrollbarMixin from 'bin-ui/src/mixins/scrollbar-mixin'
import { deepCopy } from '@/common/utils/assist'
import WidgetForm from '@/components/FormMaking/WidgetForm'
import { basicComponents, layoutComponents } from './config/componentsConfig.js'
import FormConfig from '@/components/FormMaking/FormConfig'
import WidgetConfig from '@/components/FormMaking/WidgetConfig'
import FormPreview from '@/components/FormMaking/preview/FormPreview'

export default {
  name: 'fm-container',
  components: { FormPreview, WidgetConfig, FormConfig, Draggable, WidgetForm },
  mixins: [scrollbarMixin],
  provide() {
    return { ConfigRoot: this }
  },
  props: {
    // 基础字段列表
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'select', 'time', 'date', 'switch', 'color', 'rate', 'slider']
    },
    // 布局字段列表
    layoutFields: {
      type: Array,
      default: () => ['grid', 'divider']
    },
    status: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      visible: false,
      widgetForm: {
        list: [],
        config: {
          formName: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'default'
        }
      },
      widgetFormBuffer: null,
      tabs: [
        { key: 'widget', title: '控件属性' },
        { key: 'form', title: '表单属性' }
      ],
      activeTab: 'widget',
      widgetFormSelect: null,
      closeModal: false,
      jsonOptions: '',
      jsonModal: false
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
      return `${this.status === 'create' ? '新增' : '编辑'}单据元数据
      ${this.widgetForm.config.formName ? '[' + this.widgetForm.config.formName + ']' : ''}`
    },
    isEdit() {
      return !(JSON.stringify(this.widgetForm) === JSON.stringify(this.widgetFormBuffer))
    },
    allFields() {
      let arr = []
      let mapper = (list) => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].type === 'grid') {
            list[i].columns.forEach(item => {
              mapper(item.list)
            })
          }
          if (['grid', 'divider'].indexOf(list[i].type) < 0) {
            arr.push(list[i])
          }
        }
      }
      mapper(this.widgetForm.list)
      mapper = null
      return arr
    },
    repeatModels() {
      let repeat = []
      let hash = {}
      for (let i = 0; i < this.allFields.length; i++) {
        if (hash.hasOwnProperty(this.allFields[i].model)) {
          repeat.push(this.allFields[i].model)
        } else {
          // 不存在该元素，则赋值为true
          hash[this.allFields[i].model] = true
        }
      }
      return repeat
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keypadSave)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keypadSave)
  },
  methods: {
    // 打开弹窗参数为配置数据
    open(data) {
      this.visible = true
      this.widgetForm = deepCopy(data)
      this.widgetFormBuffer = deepCopy(data)
      this.activeTab = 'form'
      if (this.widgetForm.list.length > 0) {
        this.widgetFormSelect = this.widgetForm.list[0]
      } else {
        this.widgetFormSelect = null
      }
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
        this.handleSave()
      }
      this.closeModal = false
      this.visible = false
    },
    // btn-bar
    handleClear() {
      if (this.widgetForm.list.length === 0) return
      this.widgetForm.list = []
      this.widgetFormSelect = {}
    },
    // 键盘保存
    keypadSave(e) {
      // ctrl s 保存
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.handleSave()
      }
      // esc 退出
      if (e.keyCode === 27) {
        e.preventDefault()
        this.close()
      }
    },
    // 保存按钮操作指令
    handleSave() {
      // 校验表单属性
      this.$refs.formConfig.validatorForm().then(data => {
        this.widgetFormBuffer = deepCopy(this.widgetForm)
        this.$emit('on-save', this.widgetForm, this.allFields)
      }).catch(e => {
        this.$notice.danger({ title: '校验失败', desc: '表单单据属性校验失败，请填写完整后保存。' })
        this.activeTab = 'form'
      })
    },
    // 手动点击增加一个控件
    handleAddWidget(item) {
      this.widgetForm.list.push(item)
      this.$refs.widgetForm.handleWidgetAdd({ newIndex: this.widgetForm.list.length - 1 })
      this.activeTab = 'widget'
    },
    handleMove() {
      return true
    },
    // 查看json
    handleShowJson() {
      this.jsonModal = true
      this.jsonOptions = JSON.stringify(this.widgetForm, null, 2)
    },
    // json修改
    jsonChange(val) {
      try {
        this.widgetForm = JSON.parse(val)
      } catch (err) {
      }
    },
    // 预览表单
    handlePreview() {
      if (this.widgetForm.list.length === 0) {
        this.$message({ type: 'danger', content: '没有配置信息项，请配置后预览' })
        return
      }
      this.$refs.formPreview.open(this.widgetForm)
    }
  }
}
</script>

<style lang="stylus">
@import './style.styl'
</style>
