<template>
  <div class="diff-app-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="异议处理流程" collapse>
          <table class="table">
            <tr>
              <td>主体名称</td>
              <td>{{ detail.name }}</td>
              <td>数源单位</td>
              <td>{{ detail.sourceDeptName }}</td>
            </tr>
            <tr>
              <td>资源标识符</td>
              <td>{{ detail.resourceKey }}</td>
              <td>数据类型</td>
              <td>{{ detail.resourceName }}</td>
            </tr>
            <tr>
              <td>申请人姓名</td>
              <td>{{ detail.applyUserName }}</td>
              <td>申请人身份证号码</td>
              <td>{{ detail.idCode }}</td>
            </tr>
              <tr>
              <td>申请人电话号码</td>
              <td>{{ detail.phone }}</td>
              <td>申请人电子邮箱</td>
              <td>{{ detail.email }}</td>
            </tr>
              <tr>
              <td>申请时间</td>
              <td>{{ detail.applyDate }}</td>
              <td>流程状态</td>
              <td>{{ detail.status }}</td>
            </tr>
            <tr>
              <td>内容描述</td>
              <td colspan="3">{{ detail.applyDescription }}</td>
            </tr>
            <tr v-for="(item, index) in detail.attachments" :key="item.id">
              <td v-if="index === 0" :rowspan="detail.attachments.length + 1">
                附件信息
              </td>
              <td colspan="3" style="padding: 5px 5px 5px 10px; background: #ffffff;">
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

        <b-collapse-wrap title="初审概况" collapse>
          <table class="table">
            <tr>
              <td>初审人姓名</td>
              <td>{{ detail.approveUserName }}</td>
              <td>初审时间</td>
              <td>{{ detail.approveDate }}</td>
            </tr>
            <tr>
              <td>初审说明</td>
              <td colspan="3">{{ detail.approveDescription }}</td>
            </tr>
          </table>
        </b-collapse-wrap>

        <b-collapse-wrap title="处理结果" collapse>
          <table class="table">
            <tr class="cust">
              <td>处理人姓名</td>
              <td>{{ detail.dealUserName }}</td>
              <td>处理时间</td>
              <td>{{ detail.dealDate }}</td>
            </tr>
            <tr>
              <td>处理结果</td>
              <td colspan="3">{{ detail.dealResult }}</td>
            </tr>
            <tr>
              <td>处理说明</td>
              <td colspan="3">{{ detail.dealDescription }}</td>
            </tr>
          </table>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import AttachDlBtn from '../../components/AttachDlBtn'

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
    // tr:nth-child(odd) {
    //   background: #f5fafa;
    // }
    // tr:nth-child(even) {
    //   background: #ffffff;
    // }
  }
}
</style>
