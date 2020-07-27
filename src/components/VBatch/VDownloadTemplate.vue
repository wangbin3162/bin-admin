<template>
  <b-button type="text" @click="handleDownloadTemplate">
    <slot>模板下载</slot>
  </b-button>
</template>

<script>
  import Util from '../../common/utils/util'
  import { downloadUserTemplate } from '../../api/sys/user.api'
  import { downloadDepartTemplate } from '../../api/sys/depart.api'
  import { downloadMeasureTemplate } from '../../api/urp/measure.api'

  const moduleNameEnum = { USER: 'SysUserController', DEPART: 'SysDepartController', MEASURE: 'UrpMeasureController' }
  const fileNameMap = { SysUserController: '用户模板.xlsx', SysDepartController: '部门模板.xlsx', UrpMeasureController: '奖惩措施.xlsx' }
  export default {
    name: 'VDownloadTemplate',
    props: {
      moduleName: {
        type: String,
        validate(val) {
          return ['SysUserController', 'SysDepartController', 'UrpMeasureController'].indexOf(val) > -1
        },
        required: true
      }
    },
    methods: {
      // 下载用户模板
      handleDownloadTemplate() {
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce(() => {
            let requestFun = this.moduleName === moduleNameEnum.USER ? downloadUserTemplate : this.moduleName === moduleNameEnum.DEPART
              ? downloadDepartTemplate : downloadMeasureTemplate
            let fileName = fileNameMap[this.moduleName]
            requestFun && requestFun().then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, fileName)
              }
            })
          }, 1000)
        }
        this.downloadEvent()
      }
    }
  }
</script>
