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
              <td>异议内容：</td>
              <td>{{ detail.applyDescription }}</td>
            </tr>
            <tr v-for="(item, index) in detail.attachments" :key="item.id">
              <td v-if="index === 0" :rowspan="detail.attachments.length + 1">附件信息</td>
              <td colspan="3" class="td-cover">
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
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    width: 100%;

    td, th {
      border: 1px solid #cad9ea;
      border: 1px solid #e8eaec;
      color: #666;
      height: 40px;
    }
    td:nth-child(odd), th:nth-child(odd) {
      width: 20%;
      padding-right: 15px;
      text-align: right;
      background: #f5fafa;
      background: #fafafa;
    }
    td:nth-child(even), th:nth-child(even) {
      width: 30%;
      padding: 5px;
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
