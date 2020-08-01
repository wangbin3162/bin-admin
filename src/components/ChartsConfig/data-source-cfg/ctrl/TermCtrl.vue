<template>
  <div class="term-ctrl">
    <gui-field label="字段名" label-width="60px">
      <b-select :value="current.fieldName" @on-change="handleChange" size="small">
        <b-option v-for="item in options" :key="item.id"
                  :value="item.fieldName" :label="item.fieldTitle">
          <span>{{ item.fieldTitle }}</span>
          <span style="float:right;color:#ccc">{{ item.fieldName }}</span>
        </b-option>
      </b-select>
    </gui-field>
    <dict-choose :dict="current.dict" :items="current.value" ref="dictChoose" @on-select="dictSelect"/>
  </div>
</template>

<script>
  import { deepCopy, isNotEmpty } from '../../../../common/utils/assist'
  import { getFields } from '../../../../api/data-manage/res-info.api'
  import GuiField from '../../gui/gui-field'
  import DictChoose from './DictChoose'

  export default {
    name: 'TermCtrl',
    components: { DictChoose, GuiField },
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
        options: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = val ? deepCopy(val) : {
            fieldName: '',
            dict: null,
            value: [],
            type: 'val'
          }
        },
        immediate: true
      }
    },
    methods: {
      dictSelect({ dict, value }) {
        this.current.dict = dict
        this.current.value = value
        this.valueChange()
      },
      valueChange() {
        if (!this.current.value) {
          this.current.value = []
        }
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
