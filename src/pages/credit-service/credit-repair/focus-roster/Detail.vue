<template>
  <div class="repair-apply-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="重点关注名单">
          <div style="position: relative;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
            <table class="table">
              <tr>
                <td>主体名称：</td>
                <td>{{ detail.name }}</td>
                <td>录入类型：</td>
                <td>{{ detail.lrlx }}</td>
              </tr>
              <tr>
                <td>关注部门名称：</td>
                <td>{{ detail.departName }}</td>
                <td>数据资源名称：</td>
                <td>{{ detail.resourceName }}</td>
              </tr>
              <tr>
                <td>数据资源ID：</td>
                <td>{{ detail.resourceId }}</td>
                <td>状态：</td>
                <td>{{ detail.zt }}</td>
              </tr>
              <tr>
                <td>关注时间：</td>
                <td>{{ detail.lrrq }}</td>
                <td>关注截止日期：</td>
                <td>{{ detail.jzrq }}</td>
              </tr>
            </table>
          </div>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  export default {
    name: 'FocusRosterDetail',
    props: [
      'title',
      'detail'
    ],
    components: {

    },
    data () {
      return {
        loading: false,
        open: false // 打开res-detail-dialog
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

    },
    methods: {

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
