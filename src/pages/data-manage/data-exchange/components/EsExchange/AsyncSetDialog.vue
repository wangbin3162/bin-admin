<template>
  <div>
    <b-modal v-model="open" title="设置同步条件"
      :body-styles="{ padding: '10px 24px' }"
      @on-visible-change="handleVisibleChange">

      <b-form :label-width="70" :model="form" :rules="rules" ref="form">
        <b-form-item label="同步方式">
          <b-radio-group>
            <b-radio label="全量"></b-radio>
            <b-radio label="增量"></b-radio>
          </b-radio-group>
        </b-form-item>

        <b-form-item label="时间范围">
          <b-date-picker type="daterange" style="width: 100%;"
            placement="bottom-start"
            placeholder="Select date">
          </b-date-picker>
        </b-form-item>
      </b-form>

      <div slot="footer">
        <b-button @click="open = false">
          取消
        </b-button>
        <b-button type="primary" @click="open = false">
          立即执行
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'AsyncSetDialog',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      id: {
        type: String
      }
    },
    data () {
      return {
        open: this.value,
        form: {
          startDate: '',
          endDate: ''
        },
        rules: {

        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {Boolean} visible 显示状态
       */
      handleVisibleChange (visible) {
        if (visible) {

        } else {

        }
      }
    }
  }
</script>
