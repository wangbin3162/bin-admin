<template>
  <!--选择自然人控件 for form-control -->
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @on-clear="handleClear"></b-input>
    <b-button type="primary" @click="handleShowModal" plain
              style="flex:0 0 auto;margin-left: 0;">
      选择
    </b-button>
    <nat-person-modal ref="modal" @choose-one="handleChooseOne"/>
  </div>
</template>

<script>
  import NatPersonModal from './NatPersonModal'

  export default {
    name: 'SelectNatInput',
    components: { NatPersonModal },
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
      handleChooseOne(nat) {
        let result = {
          id: nat.id,
          name: nat.name,
          idType: nat.idType,
          idCode: nat.idCode
        }
        this.$emit('on-select', result, 'nat', null)
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('on-select', {
          id: '',
          name: '',
          idType: '',
          idCode: ''
        }, 'nat', null)
      }
    }
  }
</script>
