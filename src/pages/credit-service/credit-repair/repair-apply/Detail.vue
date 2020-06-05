<template>
  <div class="repair-apply-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
          <b-collapse :value="['1', '2']" simple>
            <b-collapse-panel title="修复主体详细" name="1">
              <table class="table">
                <tr>
                  <td>主体名称：</td>
                  <td>{{ detail.name }}</td>
                  <td>主体唯一标识：</td>
                  <td>{{ detail.personId }}</td>
                </tr>
                <tr>
                  <td>申请目录：</td>
                  <td>{{ detail.resourceName }}</td>
                  <td>目录资源ID：</td>
                  <td>{{ detail.resourceKey }}</td>
                </tr>
                <tr>
                  <td>数据记录：</td>
                  <td colspan="3">
                    <b-input type="textarea" :value="detail.recordJson" :rows="4" disabled></b-input>
                    <b-button type="text" @click="open = true">
                      查看详细
                    </b-button>
                  </td>
                </tr>
              </table>
            </b-collapse-panel>

            <div class="line"></div>

            <b-collapse-panel title="修复流程详细" name="2">
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
                  <td>数据资源表名：</td>
                  <td>{{ detail.tableName }}</td>
                </tr>
                <tr>
                  <td>流程状态：</td>
                  <td>{{ statusEnum[detail.status] }}</td>
                </tr>
                <tr>
                  <td>修复申请附件：</td>
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
                  <td>{{ detail.x }}</td>
                  <td>审核意见：</td>
                  <td>{{ detail.approveDesc }}</td>
                </tr>
              </table>
            </b-collapse-panel>
          </b-collapse>
        </div>

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
    name: 'RepairApplyDetail',
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
    width: 100%;
    font-size: 13px;
    border-collapse: collapse;

    td {
      height: 40px;
      width: 35%;
      padding: 5px 12px;
      vertical-align: top;
    }

    td:nth-child(2n+1) {
      width: 15%;
    }
  }
}
</style>
