<template>
  <div class="repair-apply-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="修复主体详细" collapse>
          <div style="position: relative;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
            <table class="table">
              <tr>
                <td>主体名称：</td>
                <td>{{ detail.name }}</td>
                <td>主体标识：</td>
                <td>{{ detail.personId }}</td>
              </tr>
              <tr>
                <td>申请目录：</td>
                <td>{{ detail.resourceName }}</td>
                <td>资源标识：</td>
                <td>{{ detail.resourceKey }}</td>
              </tr>
              <tr>
                <td>数据记录：</td>
                <td colspan="3">
                  <b-ace-editor
                    v-if="detail.recordJson"
                    height="200"
                    :value="JSON.stringify(JSON.parse(detail.recordJson), null, 2)" readonly>
                  </b-ace-editor>
                  <b-button type="text" @click="open = true" v-if ="detail.dealMode !='2'">
                    查看详细
                  </b-button>
                </td>
              </tr>
            </table>
          </div>
        </b-collapse-wrap>

        <b-collapse-wrap title="修复流程详细" collapse>
          <table class="table">
            <tr>
              <td>申请人姓名：</td>
              <td>{{ detail.applyName }}</td>
              <td>申请人部门：</td>
              <td>{{ detail.applyDeptName }}</td>
            </tr>
            <tr>
              <td>申请时间：</td>
              <td>{{ detail.applyDate }}</td>
              <td>资源表名：</td>
              <td>{{ detail.tableName }}</td>
            </tr>
            <tr>
              <td>流程状态：</td>
              <td colspan="3">{{ statusEnum[detail.status] }}</td>
            </tr>
            <tr>
              <td>流程附件：</td>
              <td colspan="3">
                <div v-for="item in detail.attachments" :key="item.id">
                  <attach-dl-btn
                    :id="item.id"
                    :fileName="item.fileName"
                    btnType="text">
                    {{ item.fileName }}
                  </attach-dl-btn>
                </div>
              </td>
            </tr>
            <tr>
              <td>修复原因：</td>
              <td>{{ detail.repairCause }}</td>
              <td>修复内容：</td>
              <td>{{ detail.repairContent }}</td>
            </tr>
            <tr>
              <td>审核人：</td>
              <td>{{ detail.approveUserName }}</td>
              <td>审核时间：</td>
              <td>{{ detail.approveDate }}</td>
            </tr>
            <tr>
              <td>审核结果：</td>
              <td>{{ detail.status=='2'?detail.dealMode =='2'? '同意修复':'拒绝修复':'' }}</td>
              <td>审核意见：</td>
              <td>{{ detail.approveDesc }}</td>
            </tr>
          </table>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <res-detail-dialog
      @close="open = false"
      :open="open"
      :resourceKey="detail.resourceKey"
      :resourceName="detail.resourceName"
      :recordId="detail.recordId">
    </res-detail-dialog>
  </div>
</template>

<script>
  import { getRepairApplyDetail } from '../../../../api/credit-service/credit-repair.api'
  import AttachDlBtn from '../../components/AttachDlBtn'
  import ResDetailDialog from '../../components/ResDetailDialog'

  export default {
    name: 'RepairAuditDetail',
    props: [
      'title',
      'id'
    ],
    components: {
      AttachDlBtn,
      ResDetailDialog
    },
    data () {
      return {
        loading: false,
        open: false, // 打开res-detail-dialog
        detail: {}
      }
    },
    computed: {
      statusEnum () {
        return this.$store.state.creditRepair.statusEnum
      },
      dealModeEnum () {
        return this.$store.state.creditRepair.dealModeEnum
      }
    },
    created () {
      this.getRepairApplyDetail(this.id)
    },
    methods: {
      // 获取详情
      async getRepairApplyDetail (id) {
        this.loading = true
        try {
          const res = await getRepairApplyDetail(id)
          this.detail = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载失败', desc: error })
        }
        this.loading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
.repair-apply-detail {
  .line {
    position: relative;
    left: -16px;
    height: 20px;
    width: calc(100% + 32px);
    background-color: #f0f2f5;
    margin-bottom: 24px;
  }

  .table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    width: 100%;

    td, th {
      padding: 10px;
      vertical-align: top;
      // border: 1px solid #cad9ea;
      // border: 1px solid #e8eaec;
      color: #666;
      height: 40px;
    }
    td:nth-child(odd), th:nth-child(odd) {
      width: 10%;
      padding-right: 15px;
      text-align: right;
      // font-weight: 600;
      // background: #f5fafa;
      // background: #fafafa;
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
    // tr:nth-child(odd) {
    //   background: #f5fafa;
    // }
    // tr:nth-child(even) {
    //   background: #ffffff;
    // }
  }
}
</style>
