<template>
  <div class="repair-audit">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="异议申请详情信息" tipPos="left" class="mb-20"></v-title-bar>
          <b-row>
            <table class="table">
              <tr>
                <b-col span="12">
                  申请目录：
                  {{ detail.resourceName }}
                </b-col>
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
            <b-col span="12">
              申请目录：
              {{ detail.resourceName }}
            </b-col>
          </b-row>
          <b-form :model="form" ref="form" :rules="rules" :label-width="100">
            <b-form-item label="数据记录">
              <b-input :value="recordData" type="textarea" :rows="4" disabled></b-input>
            </b-form-item>

            <b-form-item label="修复原因">
              <b-input v-model="form.repairCause" type="textarea" :rows="4" disabled></b-input>
            </b-form-item>

            <b-form-item label="修复内容">
              <b-input v-model="form.repairContent" type="textarea" :rows="4" disabled></b-input>
            </b-form-item>

            <b-form-item label="审核意见">
              <b-input v-model="form.repairContent" type="textarea" :rows="4"></b-input>
            </b-form-item>
          </b-form>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <record-select ref="dirSelect"
      @selected="handleSelected"
      :resourceKey="form.resourceKey">
    </record-select>
  </div>
</template>

<script>
  import { getRepairApplyDetail } from '../../../../api/credit-service/credit-repair.api'
  import RepairApplyAttachList from '../../components/RepairApplyAttachList'
  import RecordSelect from '../../components/RecordSelect'

  export default {
    name: 'RepairAuditEdit',
    props: [
      'title',
      'editData'
    ],
    components: {
      RecordSelect
    },
    data () {
      return {
        btnLoading: false,
        loading: false,
        detail: {},
        form: {
          resourceKey: null,
          resourceName: '',
          tableName: '',
          repairCause: '',
          repairContent: '',
          recordId: '',
          name: '',
          personId: '',
          attachment: []
        },
        rules: {
          resourceKey: [
            { required: true, message: '资源ID不能为空', trigger: 'blur' }
          ],
          recordId: [
            { required: true, message: '选择记录不能为空', trigger: 'change' }
          ],
          repairCause: [
            { required: true, message: '修复原因不能为空', trigger: 'change' }
          ],
          repairContent: [
            { required: true, message: '修复内容不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {

    },
    created () {
      this.init()
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
      async handleSubmit () {
        // console.log(this.form)
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.btnLoading = true
          try {
            await repairApply(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.$emit('close')
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.btnLoading = false
        }
      },
      init () {
        this.getRepairApplyDetail(this.editData.id)
      }
    }
  }
</script>

<style lang="stylus" scoped>
.repair-audit {
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
