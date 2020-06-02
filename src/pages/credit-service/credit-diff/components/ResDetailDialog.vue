<template>
  <div>
    <b-modal v-model="showDialog"
      title="资源详细信息"
      :width="500"
      :styles="{ top: '5%'}"
      footer-hide
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">

    </b-modal>
  </div>
</template>

<script>
  import { show } from '../../../../api/data-manage/gather.api'

  export default {
    name: 'ResDetailDialog',
    props: [],
    data () {
      return {

      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    methods: {
      // b-modal组件的可视状态事件回调，用于初始化
      handleVisibleChange (visible) {
        if (visible) {

        } else {

        }
      }
    }
  }
</script>
