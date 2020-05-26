<template>
  <div class="level-standard-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-title-bar label="基本信息" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <div>
                <v-key-label label="报告名称" is-first is-half>{{ detailData.reportName }}</v-key-label>
                <v-key-label label="报告类型" is-half>{{ reportTypeEnum[detailData.reportType] }}</v-key-label>
                <v-key-label label="主体类型" is-first is-half>{{ personClassEnum[detailData.personClass] }}</v-key-label>
                <v-key-label label="名称(市/区)" is-half>{{ detailData.unit }}</v-key-label>
                <v-key-label label="联系电话" is-first is-half>{{ detailData.unitPhone }}</v-key-label>
                <v-key-label label="邮箱" is-half>{{ detailData.unitEmail }}</v-key-label>
                <v-key-label label="单位名称" is-first is-half>{{ detailData.unitName }}</v-key-label>
                <v-key-label label="单位网址" is-half>{{ detailData.unitUrl }}</v-key-label>
                <v-key-label label="单位地址">{{ detailData.unitAddress }}</v-key-label>
                <v-key-label label="报告须知" is-bottom>{{ detailData.reportDesc }}</v-key-label>
              </div>
            </b-col>
          </b-row>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { } from '../../../../api/sys/credit-report-config.api'

  export default {
    name: 'CreditReportConfigDetail',
    props: [
      'title',
      'detail'
    ],
    data () {
      return {
        loading: false,
        detailData: this.detail
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.creditReportConfig.personClassEnum
      },
      reportDefaultEnum () {
        return this.$store.state.creditReportConfig.reportDefaultEnum
      },
      reportTypeEnum () {
        return this.$store.state.creditReportConfig.reportTypeEnum
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
.level-standard-detail {
  .table {
    margin-top: 40px;
    h4 {
      margin-bottom: 30px;
    }
  }
}
</style>
