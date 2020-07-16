<template>
  <div class="notice-mgmt">
    <page-header-wrap v-show="isInfo">
      <v-table-wrap>

         <table-con ref="tableCon"
            @create="createHandler"
            @detail="detailHandler"
            @edit="editHandler">
        </table-con>

      </v-table-wrap>
    </page-header-wrap>

    <detail v-if="isDetail"
      :detail="curRow"
      @close="closeHandler">
    </detail>

    <edit v-if="isEdit"
      :title="diaTitle"
      :editData="curRow"
      @success="editSuccessHandler"
      @close="closeHandler">
    </edit>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getCmsNoticeType, getCmsNoticeStatus } from '../../../api/enum.api'
  import TableCon from './table-con'
  import Detail from './Detail'
  import Edit from './edit'

  /**
   * @typedef {import('../../../api/cms/notice-mgmt.api').Notice} Notice
   */

  export default {
    name: 'NoticeMgmt',
    components: {
      TableCon,
      Detail,
      Edit
    },
    data () {
      return {
        viewStatus: 'info',
        diaTitle: '',
        curRow: null
      }
    },
    computed: {
      isInfo () {
        return this.viewStatus === 'info'
      },
      isDetail () {
        return this.viewStatus === 'detail'
      },
      isEdit () {
        return this.viewStatus === 'edit'
      }
    },
    created () {
      this.getEnum()
    },
    methods: {
      ...mapMutations({
        setNoticeType: 'SET_NOTICE_TYPE',
        setNoticeStatus: 'SET_NOTICE_STATUS'
      }),

      /**
       * @author haodongdong
       * @description 获取通知公告下相关枚举值，并设置进vuex
       */
      async getEnum () {
        try {
          const [noticeType, noticeStatus] = await Promise.all([
            getCmsNoticeType(),
            getCmsNoticeStatus()
          ])

          this.setNoticeType(noticeType)
          this.setNoticeStatus(noticeStatus)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description table-con组件create事件回调
       */
      createHandler () {
        this.diaTitle = '新增通知'
        this.viewStatus = 'edit'
      },

      /**
       * @author haodongdong
       * @description table-con组件edit事件回调
       * @param {Notice} row 点击编辑按钮所在行数据
       */
      detailHandler (row) {
        this.curRow = row
        this.diaTitle = '通知详情'
        this.viewStatus = 'detail'
      },

      /**
       * @author haodongdong
       * @description table-con组件edit事件回调
       * @param {Notice} row 点击编辑按钮所在行数据
       */
      editHandler (row) {
        this.curRow = row
        this.diaTitle = '编辑通知'
        this.viewStatus = 'edit'
      },

      /**
       * @author haodongdong
       * @description edit组件编辑成功回调
       */
      editSuccessHandler () {
        this.$refs.tableCon.getNoticeList()
      },

      /**
       * @author haodongdong
       * @description edit组件close事件回调
       */
      closeHandler () {
        this.curRow = null
        this.viewStatus = 'info'
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .notice-mgmt {

 }
</style>
