<template>
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @on-clear="handleClear"/>
    <b-dropdown style="flex:0 0 80px;margin-left:0;" @on-click="handleClick">
      <b-button type="primary" plain>
        {{ showText }}
        <b-icon name="ios-arrow-down"/>
      </b-button>
      <b-dropdown-menu slot="list">
        <b-dropdown-item name="nat" :selected="type==='nat'">自然人</b-dropdown-item>
        <b-dropdown-item name="leg" :selected="type==='leg'">法 人</b-dropdown-item>
      </b-dropdown-menu>
    </b-dropdown>
    <nat-person-modal ref="nat" @choose-one="handleChooseNat"/>
    <leg-person-modal ref="leg" @choose-one="handleChooseLeg"/>
  </div>
</template>

<script>
  import NatPersonModal from './NatPersonModal'
  import LegPersonModal from './LegPersonModal'

  export default {
    name: 'SelectNatOrLeg',
    components: { LegPersonModal, NatPersonModal },
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
        current: '',
        type: '' // leg nat
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
    computed: {
      showText() {
        return this.type === '' ? '选择' : { nat: '自然人', leg: '法 人' }[this.type]
      }
    },
    methods: {
      handleClick(name) {
        this.$refs[name] && this.$refs[name].open()
      },
      handleChooseNat(item) {
        this.type = 'nat'
        let result = {
          id: item.id,
          name: item.name,
          idType: item.idType,
          idCode: item.idCode
        }
        this.$emit('on-select', result, 'nat', null)
      },
      handleChooseLeg(item) {
        this.type = 'leg'
        let result = {
          id: item.id,
          name: item.compName,
          idType: item.idType,
          idCode: item.idCode
        }
        this.$emit('on-select', result)
      },
      // 清空时触发调用
      handleClear() {
        this.type = ''
        this.$emit('on-select', {
          id: '',
          name: '',
          idType: '',
          idCode: ''
        }, 'natOrLeg', null)
      }
    }
  }
</script>
