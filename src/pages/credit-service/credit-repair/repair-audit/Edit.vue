<template>
  <div class="repair-audit">
    <page-header-wrap title="信用修复审核" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="信用修复审核信息">
          <div style="position: relative;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>

            <div class="con">
              <table class="table">
                <tr>
                  <td>申请目录：</td>
                  <td>{{ detail.resourceName }}</td>
                  <td>主体名称：</td>
                  <td>{{ detail.name }}</td>
                </tr>
                <tr>
                  <td>申请单位：</td>
                  <td>{{ detail.applyDeptName }}</td>
                  <td>申请人：</td>
                  <td>{{ detail.applyName }}</td>
                </tr>
              </table>
            </div>

            <b-form :model="form" ref="form" :rules="rules" :label-width="100">
              <b-form-item label="数据记录">
                <b-input :value="detail.recordJson" type="textarea" :rows="4" disabled></b-input>
                <b-button type="text" @click="open = true">
                  查看详细
                </b-button>
              </b-form-item>

              <b-form-item label="修复原因">
                <b-input v-model="detail.repairCause" type="textarea" :rows="4" disabled></b-input>
              </b-form-item>

              <b-form-item label="修复内容">
                <b-input v-model="detail.repairContent" type="textarea" :rows="4" disabled></b-input>
              </b-form-item>

              <b-form-item label="审核意见" prop="approveDesc">
                <b-input v-model="form.approveDesc" type="textarea" :rows="4"></b-input>
              </b-form-item>
            </b-form>

            <div flex="main:center">
              <b-button type="primary" @click="handleSubmit('2')">同意修复</b-button>
              <b-button type="primary" plain @click="handleSubmit('3')">拒绝修复</b-button>
            </div>
          </div>
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
  import { getRepairApplyDetail, repairApprove } from '../../../../api/credit-service/credit-repair.api'
  import ResDetailDialog from '../../components/ResDetailDialog'
  export default {
    name: 'RepairAuditEdit',
    props: [
      'title',
      'id'
    ],
    components: {
      ResDetailDialog
    },
    data () {
      return {
        btnLoading: false,
        loading: false,
        detail: {},
        open: false,
        form: {
          id: this.id,
          dealMode: '',
          approveDesc: ''
        },
        rules: {
          approveDesc: [
            { required: true, message: '审核意见不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {

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
      },
      // 提交按钮回调
      async handleSubmit (dealMode) {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.btnLoading = true
          try {
            this.form.dealMode = dealMode
            await repairApprove(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.$emit('close')
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.btnLoading = false
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.repair-audit {
  .con {
    width: 70%;
    margin-left: 93px;

    .table {
      width: 100%;
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
}
</style>
