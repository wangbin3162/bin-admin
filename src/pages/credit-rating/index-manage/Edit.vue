<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <template slot="full">
          <b-collapse v-model="collapseValue" simple>
            <b-collapse-panel title="基本信息" name="index">
              <EditBaseInfo></EditBaseInfo>
            </b-collapse-panel>

            <b-collapse-panel title="指标配置规则" name="rules">
              <EditIndexRule></EditIndexRule>
            </b-collapse-panel>

            <b-collapse-panel title="信息资源配置" name="resources">
              <EditSourceInfo></EditSourceInfo>
            </b-collapse-panel>
          </b-collapse>
        </template>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import EditBaseInfo from '@/pages/credit-rating/index-manage/EditBaseInfo'
  import EditIndexRule from '@/pages/credit-rating/index-manage/EditIndexRule'
  import EditSourceInfo from '@/pages/credit-rating/index-manage/EditSourceInfo'

  export default {
    name: 'IndexManageEdit',
    props: ['title'],
    components: {
      EditBaseInfo,
      EditIndexRule,
      EditSourceInfo
    },
    data () {
      return {
        collapseValue: ['index'], // 控制手风琴展开
        form: {
          index: {},
          rules: [],
          resources: []
        }
      }
    },
    created () {

    },
    methods: {
      handleSubmit () {

      }
    }
  }
</script>
