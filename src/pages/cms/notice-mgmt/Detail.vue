<template>
  <div class="notice-mgmt-detail">
    <page-header-wrap show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <table class="table">
            <tr>
              <td>通知标题</td>
              <td>{{ detail.title }}</td>
              <td>通知类型</td>
              <td>{{ noticeType[detail.type] }}</td>
            </tr>
            <tr>
              <td>发布组织</td>
              <td>{{ departName }}</td>
              <td>过期时间</td>
              <td>{{ detail.validDate }}</td>
            </tr>
            <tr>
              <td>通知状态</td>
              <td>{{ noticeStatus[detail.notifyStatus] }}</td>
              <td>备注</td>
              <td>{{ detail.remark }}</td>
            </tr>
          </table>
        </b-collapse-wrap>

        <b-collapse-wrap title="通知内容" collapse>
          <div v-html="detail.content">
          </div>
          <h4>附件列表：</h4>
          <file-upload :initFileList="detail.fileList" showMode>
          </file-upload>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getNoticeDetail } from '../../../api/cms/notice-mgmt.api'
  import FileUpload from './edit/FileUpload'

  export default {
    name: 'NoticeMgmtDetail',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    components: {
      FileUpload
    },
    data () {
      return {
        detail: {}
      }
    },
    computed: {
      ...mapState({
        noticeType: state => state.noticeMgmt.noticeType,
        noticeStatus: state => state.noticeMgmt.noticeStatus,
        departName: state => state.user.info.departName
      })
    },
    created () {
      this.getNoticeDetail(this.id)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 根据通知id获取通知详情
       * @param {string} id 通知id
       */
      async getNoticeDetail (id) {
        try {
          const res = await getNoticeDetail(id)
          this.detail = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .notice-mgmt-detail {
   .table {
      border-collapse: collapse;
      margin: 0 auto;
      text-align: center;
      width: 100%;

      td, th {
        padding: 10px;
        vertical-align: top;
        border: 1px solid #cad9ea;
        border: 1px solid #e8eaec;
        color: #666;
        height: 40px;
      }
      td:nth-child(odd), th:nth-child(odd) {
        width: 10%;
        padding-right: 15px;
        text-align: right;
        background: #f5fafa;
        background: #fafafa;
      }
      td:nth-child(even), th:nth-child(even) {
        width: 30%;
        // padding: 5px;
        padding-left: 10px;
        text-align: left;
        background: #ffffff;
      }
      tr:hover {
        td {
          background: #f4f5f6;
          transition: background 0.7s;
        }
      }
      .td-cover {
        background: #ffffff!important;
        padding: 5px!important;
        padding-left: 10px!important;
      }
   }
 }
</style>
