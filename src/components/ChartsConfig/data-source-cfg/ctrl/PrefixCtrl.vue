<template>
  <div class="prefix-ctrl">
    <gui-field label="字段名" label-width="60px">
      <b-select :value="current.fieldName" @on-change="handleChange" size="small">
        <b-option v-for="item in options" :key="item.id"
                  :value="item.fieldName" :label="item.fieldTitle">
          <span>{{ item.fieldTitle }}</span>
          <span style="float:right;color:#ccc">{{ item.fieldName }}</span>
        </b-option>
      </b-select>
    </gui-field>
    <div style="padding: 6px 12px;" flex>
      <div style="width: 60px;">前缀</div>
      <div style="width: calc(100% - 60px);">
        <b-tag :key="tag" v-for="tag in dynamicTags" type="primary" size="small"
               closable @on-close="handleCloseTag(tag)" :tag-style="{padding:'0 8px'}">
          {{ tag }}
        </b-tag>
        <b-input size="small"
                 v-if="inputVisible"
                 ref="saveTagInput"
                 v-model="inputValue"
                 @on-enter="handleInputConfirm"
                 @on-blur="handleInputConfirm"
                 @on-change="inputChange"
                 style="width: 80px;"></b-input>
        <b-button v-else size="small" type="dashed" icon="ios-add" style="width: 80px;" @click="showInput">新增</b-button>
        <transition name="zoom-in-top">
          <span style="color:#ff4d4f;display: inline-block;width: 100%;" v-if="sameError">存在相同的前缀</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { deepCopy, isNotEmpty } from '../../../../common/utils/assist'
  import { getFields } from '../../../../api/data-manage/res-info.api'
  import GuiField from '../../gui/gui-field'

  export default {
    name: 'PrefixCtrl',
    components: { GuiField },
    inject: ['ConfigRoot'],
    props: {
      value: {
        type: Object,
        default() {
          return {
            fieldName: '',
            value: [],
            type: 'val'
          }
        }
      }
    },
    data() {
      return {
        current: {},
        options: [],
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        sameError: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = val ? deepCopy(val) : {
            fieldName: '',
            value: [],
            type: 'val'
          }
          this.dynamicTags = this.current.value ? [...this.current.value] : []
        },
        immediate: true
      }
    },
    methods: {
      handleCloseTag(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        this.valueChange()
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      inputChange(e) {
        this.sameError = this.dynamicTags.indexOf(e.target.value) > -1
      },
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          if (this.sameError) {
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus()
            })
            return
          }
          this.dynamicTags.push(inputValue)
          this.valueChange()
        }
        this.inputVisible = false
        this.inputValue = ''
        this.sameError = false
      },
      valueChange() {
        if (!this.current.value) {
          this.current.value = []
        }
        this.current.value = [...this.dynamicTags]
        this.emitValue()
      },
      handleChange(val) {
        this.current.fieldName = val
        this.emitValue()
      },
      emitValue() {
        this.$emit('input', this.current)
        this.$emit('on-change', this.current)
      }
    },
    created() {
      if (isNotEmpty(this.ConfigRoot.resource.resourceKey)) {
        getFields(this.ConfigRoot.resource.resourceKey).then(resp => {
          this.options = resp.data || []
        })
      }
    }
  }
</script>
