<template>
  <!--法人选择框 for form-control -->
  <div flex>
    <b-input v-model="current" :placeholder="placeholder" readonly clearable @clear="handleClear"></b-input>
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
        // 法人六码【for 双公示，法人行政许可和法人行政处罚】
        let codes = {
          idShxym: leg.idShxym || '', // 统一社会信用代码
          idGszc: leg.idGszc || '', // 工商注册号
          idZzjg: leg.idZzjg || '', // 组织机构代码
          idSwdj: leg.idSwdj || '', // 税务登记号
          idSydw: leg.idSydw || '', // 事业单位证书号
          idShzz: leg.idShzz || '' // 社会组织登记号
        }
        let result = {
          id: leg.id,
          name: leg.compName,
          idType: leg.idType,
          idCode: leg.idCode
        }
        this.$emit('select', result, 'leg', codes)
      },
      // 清空时触发调用
      handleClear() {
        this.$emit('select',
          {
            id: '',
            name: '',
            idType: '',
            idCode: ''
          },
          'leg',
          {
            idShxym: '', // 统一社会信用代码
            idGszc: '', // 工商注册号
            idZzjg: '', // 组织机构代码
            idSwdj: '', // 税务登记号
            idSydw: '', // 事业单位证书号
            idShzz: '' // 社会组织登记号
          })
      }
    }
  }
</script>
