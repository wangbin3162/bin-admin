<template>
  <div class="diff-app-detail">
    <page-header-wrap show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="异议申请详情信息" collapse>
          <table class="table">
            <tr>
              <td>异议编码：</td>
              <td>{{ detail.searchCode }}</td>
              <td>异议申请人：</td>
              <td>{{ detail.applyUserName }}</td>
            </tr>
            <tr>
              <td>申请人身份证号码：</td>
              <td>{{ detail.idCode }}</td>
              <td>联系电话：</td>
              <td>{{ detail.phone }}</td>
            </tr>
            <tr>
              <td>数据类型：</td>
              <td>
                <b-button type="text" @click="handleOpenResDetail">
                  {{ detail.resourceName }}
                </b-button>
              </td>
              <td>异议申请时间：</td>
              <td>{{ detail.applyDate }}</td>
            </tr>
              <tr>
              <td>数源单位：</td>
              <td>{{ detail.sourceDeptName }}</td>
            </tr>
            <tr>
              <td>异议内容：</td>
              <td>{{ detail.applyDescription }}</td>
            </tr>
            <tr>
              <td colspan="4">
                <b-divider></b-divider>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <h4>附件信息</h4>
              </td>
            </tr>
            <tr v-for="item in detail.attachments" :key="item.id">
              <td colspan="2" >
                <div flex="main:justify">
                  <span>{{ item.fileName }}</span>
                  <attach-dl-btn
                    :id="item.id"
                    :fileName="item.fileName">
                  </attach-dl-btn>
                </div>
              </td>
            </tr>
          </table>
        </b-collapse-wrap>

        <b-collapse-wrap title="初审结果" collapse>
          <b-form ref="form" :model="form" :rules="rules" :label-width="100">
            <b-form-item label="初审结果" prop="status">
              <b-radio-group v-model="form.status">
                <b-radio label="T1">初审通过</b-radio>
                <b-radio label="TR">驳回</b-radio>
              </b-radio-group>
            </b-form-item>
            <b-form-item label="初审说明" prop="approveDescription">
              <b-input v-model="form.approveDescription" type="textarea" :rows="4" placeholder="请输入...." ></b-input>
            </b-form-item>
            <b-form-item>
              <b-button type="primary" @click="handleSubmit">
                初审完成
              </b-button>
            </b-form-item>
          </b-form>
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
  import AttachDlBtn from '../../components/AttachDlBtn'
  import ResDetailDialog from '../../components/ResDetailDialog'
  import { approve } from '../../../../api/credit-service/credit-diff.api'

  export default {
    name: 'DiffAppDetail',
    props: [
      'title',
      'detail'
    ],
    components: {
      AttachDlBtn,
      ResDetailDialog
    },
    data () {
      return {
        open: false, // 打开res-detail-dialog
        form: {
          id: this.detail.id,
          status: 'T1',
          approveDescription: ''
        },
        rules: {
          status: [
            { required: true, message: '审核说明必填', trigger: 'blur' }
          ],
          approveDescription: [
            { required: true, message: '审核说明必填', trigger: 'blur' }
          ]
        }
      }
    },
    created () {

    },
    methods: {
      // 数据类型查看详情btn的回调
      handleOpenResDetail () {
        this.open = true
      },
      async handleSubmit () {
        const valid = await this.$refs.form.validate()
        if (valid) {
          try {
            await approve(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('approve-done')
            this.$emit('close')
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.diff-app-detail {
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
      width: 25%;
      padding: 5px 12px
    }
  }
}
</style>
