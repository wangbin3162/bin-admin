<template>
  <div class="diff-app-detail">
    <page-header-wrap v-show="isHandlePage" show-close @on-close="$emit('close')">
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
              <td v-if="index === 0 " :rowspan="detail.attachments.length + 1">附件信息</td>
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

        <b-collapse-wrap title="异议处理" collapse>
          <b-form ref="form" :model="form" :rules="rules" :label-width="100">
            <b-form-item label="处理结果" prop="dealResult">
              <b-radio-group v-model="form.dealResult">
                <b-radio label="NO">核实无误</b-radio>
                <b-radio label="CA">取消公示</b-radio>
                <b-radio label="DE">删除信息</b-radio>
                <b-radio label="UP">更新信息</b-radio>
              </b-radio-group>
            </b-form-item>
            <b-form-item label="处理说明" prop="dealDescription">
              <b-input v-model="form.dealDescription" type="textarea" :rows="4" placeholder="请输入...." ></b-input>
            </b-form-item>
            <b-form-item>
              <b-button type="primary" @click="handleSubmit">
                处理完成
              </b-button>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <!--为了触发重绘更新form字段设置 使用v-if-->
    <res-edit-dialog
      v-if="!isHandlePage"
      @close="isHandlePage = true"
      :diffDetail="detail">
    </res-edit-dialog>
  </div>
</template>

<script>
  import AttachDlBtn from '../../components/AttachDlBtn'
  import ResEditDialog from '../../components/ResEditDialog'
  import { deal } from '../../../../api/credit-service/credit-diff.api'

  export default {
    name: 'DiffAppDetail',
    props: [
      'title',
      'detail'
    ],
    components: {
      AttachDlBtn,
      ResEditDialog
    },
    data () {
      return {
        isHandlePage: true,
        form: {
          id: this.detail.id,
          dealResult: 'NO',
          dealDescription: ''
        },
        rules: {
          dealResult: [
            { required: true, message: '审核说明必填', trigger: 'blur' }
          ],
          dealDescription: [
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
        this.isHandlePage = false
      },
      async handleSubmit () {
        const valid = await this.$refs.form.validate()
        if (valid) {
          try {
            await deal(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('handle-done')
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
