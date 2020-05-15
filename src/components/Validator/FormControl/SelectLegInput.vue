<template>
  <!--法人选择框 for form-control -->
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @on-clear="handleClear"></b-input>
    <b-button type="primary" @click="handleShowModal" plain
              style="flex:0 0 auto;margin-left:0;">
      选择
    </b-button>
    <leg-person-modal ref="modal" @choose-one="handleChooseOne"/>
  </div>
</template>

<script>
  import LegPersonModal from './LegPersonModal'

  export default {
    name: 'SelectLegInput',
    components: { LegPersonModal },
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        current: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    methods: {
      handleShowModal() {
        this.$refs.modal && this.$refs.modal.open()
      },
      handleChooseOne(leg) {
        let result = {
          id: leg.id,
          name: leg.compName,
          idType: leg.idType,
          idCode: leg.idCode
        }
        this.$emit('on-select', result)
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('on-select', {
          id: '',
          name: '',
          idType: '',
          idCode: ''
        })
      }
    }
  }
</script>
