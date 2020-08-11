<template>
  <div>
    <b-modal v-model="open" title="设置同步条件"
      :body-styles="{ padding: '10px 24px' }"
      @on-visible-change="handleVisibleChange">

      <b-form :label-width="90" :model="form" :rules="rules" ref="form">
        <b-form-item label="同步方式" prop="syncMode">
          <b-radio-group v-model="form.syncMode">
            <b-radio label="全量"></b-radio>
            <b-radio label="增量"></b-radio>
          </b-radio-group>
        </b-form-item>

        <b-form-item v-if="form.syncMode === '增量'" label="时间范围" prop="endDate">
          <b-date-picker type="daterange" style="width: 100%;" :value="dateStrArr"
            placement="bottom-start"
            placeholder="请选择执行时间"
            @on-change="handleDateChange">
          </b-date-picker>
        </b-form-item>
      </b-form>

      <div slot="footer">
        <b-button @click="open = false">
          取消
        </b-button>
        <b-button type="primary" :loading="btnLoading" @click="handleSubmit">
          立即执行
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { syncESData } from '@/api/data-manage/es-exchange.api'

  export default {
    name: 'SyncSetDialog',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      resourceKey: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        open: this.value,
        btnLoading: false,
        dateStrArr: ['', ''],
        form: {
          syncMode: '增量',
          beginDate: '',
          endDate: ''
        },
        rules: {
          endDate: [
            { required: true, message: '请选择执行时间', trigger: 'change' }
          ]
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
          this.$refs.form.resetFields()
          this.dateStrArr = ['', '']
          this.form.syncMode = '增量'
          this.form.beginDate = ''
          this.form.endDate = ''
        }
      },

      /**
       * @author haodongdong
       * @description 日期组件on-change事件回调
       * @param {string[]} 日期字符串数组
       */
      handleDateChange (dateStrArr) {
        this.dateStrArr = dateStrArr
        this.form.beginDate = dateStrArr[0]
        this.form.endDate = dateStrArr[1]
      },

      /**
       * @author haodongdong
       * @description 执行按钮回调
       */
      async handleSubmit () {
        this.btnLoading = true
        try {
          const valid = await this.$refs.form.validate()
          if (valid) {
            let param = {
              isAll: '',
              resourceKeys: [this.resourceKey]
            }
            if (this.form.syncMode === '增量') {
              param.beginDate = this.form.beginDate
              param.endDate = this.form.endDate
            } else {
              param.beginDate = ''
              param.endDate = ''
            }
            await syncESData(param)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.open = false
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      }
    }
  }
</script>
