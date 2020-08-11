<template>
  <div class="batch-async-set-dialog set-con">
    <b-card head-tip>
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>已选资源信息</span>
        </div>
      </template>

      <div flex="main:justify cross:center" class="mb-5">
        <b-checkbox v-model="isAllRes">
          <span style="color: rgba(0,0,0,.85);">
            全部资源
          </span>
        </b-checkbox>
      </div>

      <div class="tag-con">
        <b-tag type="info" v-for="(item, index) in resourceList" :key="index"
          :closable="!isAllRes" @on-close="handleTagClose(index)">
          {{ item.resourceName }}
        </b-tag>
      </div>

      <div class="form-con">
        <div flex="main:justify cross:center">
          <span style="color: rgba(0,0,0,.85); margin-left: 11px;">同步方式：</span>
          <b-radio-group v-model="form.syncMode">
            <b-radio label="全量"></b-radio>
            <b-radio label="增量"></b-radio>
          </b-radio-group>
        </div>

        <b-form label-position="top" :model="form" :rules="rules" ref="form">
          <b-form-item label="时间范围" prop="endDate" v-if="form.syncMode === '增量'">
            <b-date-picker type="datetimerange" style="width: 100%;" :value="dateStrArr"
              placement="top-end"
              placeholder="请选择执行时间"
              @on-change="handleDateChange">
            </b-date-picker>
          </b-form-item>

          <!-- 此处传递prop，防止需要校验的item项全被if隐藏后，b-form表单校验函数锁死 -->
          <b-form-item prop="hack">
            <div flex="main:justify">
              <b-button style="width: 49%;" @click="$emit('close')">
                取消
              </b-button>
              <b-button type="primary" style="width: 49%;" :loading="btnLoading"
                :disabled="btnLoading || (!isAllRes && resourceList.length === 0)"
                @click="handleSubmit">
                执行同步
              </b-button>
            </div>
          </b-form-item>

        </b-form>
      </div>
    </b-card>
  </div>
</template>

<script>
  import { syncESData } from '@/api/data-manage/es-exchange.api'

  export default {
    name: 'SetCon',
    props: {
      modalVisible: {
        type: Boolean,
        required: true
      },
      initResources: {
        type: Array,
        reauired: true
      }
    },
    data () {
      return {
        btnLoading: false,
        resourceList: this.initResources,
        isAllRes: false,
        dateStrArr: ['', ''],
        form: {
          syncMode: '增量',
          beginDate: '',
          endDate: ''
        },
        rules: {
          endDate: [
            { required: true, message: ' ', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      modalVisible: {
        handler (newVal) { // 用于弹框关闭后清理状态
          if (!newVal) {
            this.isAllRes = false
            this.$refs.form.resetFields()
            this.dateStrArr = ['', '']
            this.form.syncMode = '增量'
            this.form.beginDate = ''
            this.form.endDate = ''
          }
        }
      },
      initResources: {
        handler (newVal) {
          this.resourceList = newVal
        },
        deep: true
      },
      resourceList: {
        handler (newVal) {
          this.$emit('res-change', newVal)
        },
        deep: true
      },
      isAllRes: {
        handler (newVal) {
          this.$emit('select-status-change', newVal)
        }
      }
    },
    created () {

    },
    methods: {

      /**
       * @author haodongdong
       * @description 标签关闭事件回调
       * @param {number} index
       */
      handleTagClose (index) {
        this.resourceList.splice(index, 1)
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
              isAll: 'all',
              resourceKeys: []
            }
            if (!this.isAllRes) { // 不是选择全部资源时调整传递的参数
              param.isAll = ''
              this.resourceList.forEach(res => {
                param.resourceKeys.push(res.resourceKey)
              })
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
            this.$emit('close')
            this.open = false
          } else {
            this.$message({ type: 'warning', content: '请选择执行时间' })
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

<style lang="stylus">
  .batch-async-set-dialog.set-con {
    .bin-card .bin-card__body {
      padding: 4px;
      max-height: 450px;
      overflow: auto;
    }

    .form-con .bin-form-item-content {
      position: initial;
    }
  }
</style>

<style lang="stylus" scoped>
  .batch-async-set-dialog.set-con {
    .tag-con {
      max-height: 200px;
      overflow: auto;
    }

    .form-con {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #d9d9d9;
    }
  }
</style>
