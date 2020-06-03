<template>
  <div class="res-detail-dialog">
    <b-modal v-model="showDialog"
      :title="diffDetail.resourceName + ' 详情'"
      :width="640"
      :styles="{ top: '5%'}"
      footer-hide
      :body-styles="{ padding: '5px' }"
      @on-visible-change="handleVisibleChange">
      <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
      <div class="table-con">
        <table>
          <tr v-for="item in detailArr" :key="item.label">
            <td>
              {{ item.label }}：
            </td>
            <td>
              {{ item.value }}
            </td>
          </tr>
        </table>
      </div>

    </b-modal>
  </div>
</template>

<script>
  import { Decode, MaskCode } from '../../../../common/utils/secret'
  import { getResourceInfo, show } from '../../../../api/data-manage/gather.api'

  export default {
    name: 'ResDetailDialog',
    props: [
      'open',
      'diffDetail'
    ],
    data () {
      return {
        loading: false,
        detailArr: []
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
          this.init()
        } else {
          this.loading = false
        }
      },
      async getData () {
        this.loading = true
        try {
          const [resourceInfo, showRes] = await Promise.all([
            getResourceInfo(this.diffDetail.resourceKey),
            show(this.diffDetail.recordId, this.diffDetail.resourceKey)
          ])

          const labels = resourceInfo.data.data.items.filter(item => item.id)
          const fieldObj = showRes.data.data
          const detailArr = []

          labels.forEach(item => {
            const obj = {
              label: item.fieldTitle,
              value: fieldObj[item.fieldName]
            }
            if (item.isEncrypt === '1') obj.value = Decode(obj.value)
            if (item.maskModel) obj.value = MaskCode(obj.value, item.maskModel)
            if (item.fieldName !== 'person_id') detailArr.push(obj)
          })

          this.detailArr = detailArr
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
        this.loading = false
      },
      init () {
        this.getData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
.res-detail-dialog {
  .table-con {
    min-height: 300px;
    max-height: 600px;
    overflow: auto;

    table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;

      td {
        height: 40px;
        width: 50%;
        padding: 5px 12px
      }
    }
  }
}
</style>
