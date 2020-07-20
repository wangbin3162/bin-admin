<template>
  <div flex>
    <b-input v-model="current" :placeholder="placeholder"
      readonly clearable>
    </b-input>
    <b-button type="primary" plain @click="handleSelectBtn">选择</b-button>

    <region-modal v-model="openRegion" @selected="typeCode => $emit('input', typeCode)">
    </region-modal>

    <hydm-modal v-model="openHydm" @selected="typeCode => $emit('input', typeCode)">
    </hydm-modal>
  </div>
</template>

<script>
  import RegionModal from './RegionModal'
  import HydmModal from './HydmModal'

  export default {
    name: 'SelectRegionOrHydm',
    components: {
      RegionModal,
      HydmModal
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        current: this.value,
        openRegion: false,
        openHydm: false
      }
    },
    watch: {
      value (newVal) {
        this.current = newVal
      }
    },
    methods: {
      /**
       * @author haodongdong
       * @description 根据控件类型打开不同的弹框组件
       */
      handleSelectBtn () {
        if (this.type === 'REGION_SELECT') this.openRegion = true
        if (this.type === 'HYDM_SELECT') this.openHydm = true
      }
    }
  }
</script>
