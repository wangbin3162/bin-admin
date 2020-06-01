<template>
  <div class="diff-app-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <b-collapse :value="[1, 2, 3]" simple>
            <b-collapse-panel title="异议处理流程" name="1">
              <table class="table">
                <tr>
                  <td>主体名称：</td>
                  <td>{{ detail.name }}</td>
                  <td>数据单位：</td>
                  <td>{{ detail.sourceDeptName }}</td>
                </tr>
                <tr>
                  <td>资源标识符：</td>
                  <td>{{ detail.resourceKey }}</td>
                  <td>数据类型：</td>
                  <td>{{ detail.resourceName }}</td>
                </tr>
                <tr>
                  <td>申请人姓名：</td>
                  <td>{{ detail.applyUserName }}</td>
                  <td>申请人身份证号码：</td>
                  <td>{{ detail.idCode }}</td>
                </tr>
                 <tr>
                  <td>申请人电话号码：</td>
                  <td>{{ detail.phone }}</td>
                  <td>申请人电子邮箱：</td>
                  <td>{{ detail.email }}</td>
                </tr>
                 <tr>
                  <td>申请时间：</td>
                  <td>{{ detail.applyDate }}</td>
                  <td>流程状态：</td>
                  <td>{{ detail.status }}</td>
                </tr>
                <tr>
                  <td>内容描述：</td>
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
            </b-collapse-panel>

            <div class="line"></div>

            <b-collapse-panel title="初审概况" name="2">
              <table class="table">
                <tr>
                  <td>初审人姓名：</td>
                  <td>{{ detail.approveUserName }}</td>
                  <td>初审时间：</td>
                  <td>{{ detail.approveDate }}</td>
                </tr>
                <tr>
                  <td>初审说明：</td>
                  <td>{{ detail.approveDescription }}</td>
                </tr>
              </table>
            </b-collapse-panel>

            <div class="line"></div>

            <b-collapse-panel title="处理结果" name="3">
              <table class="table">
                <tr class="cust">
                  <td>处理人姓名：</td>
                  <td>{{ detail.dealUserName }}</td>
                  <td>处理时间：</td>
                  <td>{{ detail.dealDate }}</td>
                </tr>
                <tr>
                  <td>处理结果：</td>
                  <td>{{ detail.dealResult }}</td>
                </tr>
                <tr>
                  <td>处理说明：</td>
                  <td>{{ detail.dealDescription }}</td>
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
  </div>
</template>

<script>
  import AttachDlBtn from '../components/AttachDlBtn'

  export default {
    name: 'DiffAppDetail',
    props: [
      'title',
      'detail'
    ],
    components: {
      AttachDlBtn
    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

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
