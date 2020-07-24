<template>
  <div flex>
    <b-input :placeholder="placeholder" :value="current"
      readonly clearable @on-clear="handleClear">
    </b-input>
    <b-button type="primary" plain @click="handleSelectBtn">选择</b-button>

    <region-modal v-model="openRegion" @selected="handleSelected">
    </region-modal>

    <hydm-modal v-model="openHydm" @selected="handleSelected">
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
        current: '',
        openRegion: false,
        openHydm: false
      }
    },
    watch: {
      value: {
        handler (newVal) {
          let obj = null
          if (newVal.includes('typeName')) {
            obj = JSON.parse(newVal)
            this.current = obj.typeName
            this.$emit('input', obj.typeCode)
          }
        },
        immediate: true
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
      },

      /**
       * @author haodongdong
       * @description 弹框组件selected事件回调
       * @param {Object} row 选择的行数据
       * @param {string} row.typeName
       * @param {string} row.typeCode
       */
      handleSelected (row) {
        this.current = row.typeName
        this.$emit('input', row.typeCode)
      },

      /**
       * @author haodongdong
       * @description b-input清空的回调
       */
      handleClear() {
        this.$emit('input', JSON.stringify(''))
      }
    }
  }
</script>
