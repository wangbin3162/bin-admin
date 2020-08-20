<template>
  <div class="icon-btn">
    <template v-if="supervisionStatus !== undefined && supervisionStatus !== null">
      <template v-if="supervisionStatus === '1'">
        <b-tooltip content="已监管" placement="top-start">
          <svg-icon icon-class="visibility"
            class="icon supervision on"
            @click.native="handleSupervision(supervisionStatus)">
          </svg-icon>
        </b-tooltip>
      </template>

      <template v-else>
        <b-tooltip content="未监管" placement="top-start">
          <svg-icon icon-class="visibility off"
            class="icon supervision"
            @click.native="handleSupervision(supervisionStatus)">
          </svg-icon>
        </b-tooltip>
      </template>
    </template>
  </div>
</template>

<script>
  import { addSupervision, cancelSupervision } from '@/api/credit-supervision/my-supervision.api'

  export default {
    name: 'IconBtn',
    props: {
      supervisionStatus: { // '0' 未监管 '1' 已监管
        type: String,
        default: null
      },
      objectId: {
        type: String,
        default: ''
      },
      objectName: {
        type: String,
        default: ''
      }
    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 加入监管
       * @param {string} objectId 主体id
       * @param {string} objectName 主体名称
       * @param {string} jgType 监管类型
       */
      async supervision (objectId, objectName, jgType) {
        try {
          await addSupervision({
            objectId,
            objectName,
            jgType
          })
          this.$message({
            type: 'success',
            content: '操作成功'
          })
          this.$emit('success')
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 取消监管
       * @param {string} objectId 主体id
       * @param {string} jgType 监管类型
       */
      cancelSupervisionBtn (objectId, jgType) {
        this.$confirm({
          title: '提示',
          content: '确认要取消监管吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await cancelSupervision(objectId, jgType)
              this.$emit('success')
              this.$message({ type: 'success', content: '操作成功' })
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },

      /**
       * @author haodongdong
       * @description 监管按钮的回调
       * @param {string} supervisionStatus 是否监管
       */
      handleSupervision (supervisionStatus) {
        const { type } = this.$route.query
        const jgTypeMap = new Map([
          ['1', 'MS'],
          ['2', 'KP']
        ])
        if (supervisionStatus === '0') {
          // 未监管
          this.supervision(this.objectId, this.objectName, jgTypeMap.get(type))
        } else {
          // 已监管
          this.cancelSupervisionBtn(this.objectId, jgTypeMap.get(type))
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .icon-btn {
    display: flex;

    .icon {
      margin-left: 15px;
      height: 26px;
      width: 26px;

      &.red {
        color: #ff5733;
      }

      &.supervision {
        cursor: pointer;
        &.on {
          color: #2bcfcf;
        }
      }
    }
  }
</style>
