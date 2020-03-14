<template>
  <!--选择模板 for SwitchingMission.vue -->
  <div>
    <div flex="box:last">
      <b-input v-model="current" placeholder="选择模板" readonly clearable
               @on-clear="handleClear"></b-input>
      <b-button type="primary"  @click="handleShowModal"
                style="padding: 10px;margin-left: 0;font-size: 12px;">
        选择模板
      </b-button>
    </div>
    <biz-temp-choose ref="bizTempModal" @on-choose="handleChooseTemp"/>
  </div>
</template>

<script>
  import BizTempChoose from '../DaInnerTemplate/BizTempChoose'

  export default {
    name: 'TemplateChoose',
    components: { BizTempChoose },
    props: {
      value: {
        type: String,
        default: ''
      },
      defaultName: {
        type: String,
        default: ''
      }
    },
    watch: {
      defaultName: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    data() {
      return {
        current: ''
      }
    },
    methods: {
      handleShowModal() {
        this.$refs.bizTempModal && this.$refs.bizTempModal.open()
      },
      handleChooseTemp(temp) {
        this.current = temp.tempName
        this.$emit('input', temp.id)
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
        this.$emit('on-change', { resourceKey: '', resourceName: '', metadataKey: '', fields: [] })
      }
    }
  }
</script>
