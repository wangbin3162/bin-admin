<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <template slot="full">
          <b-collapse v-model="collapseValue" simple>
            <b-collapse-panel title="基本信息" name="index">
              <EditBaseInfo ref="baseInfo" @data-update="handleUpdateBaseInfo"
                :natureOptions="natureOptions" :dataTypeOptions="dataTypeOptions"
                :calcTypeOptions="calcTypeOptions" :scaleOptions="scaleOptions"
                :treeData="treeData"></EditBaseInfo>
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
  import EditBaseInfo from './EditBaseInfo'
  import EditIndexRule from './EditIndexRule'
  import EditSourceInfo from './EditSourceInfo'
  import { saveAndUpdate } from '../../../api/credit-rating/index-manage.api'

  export default {
    name: 'IndexManageEdit',
    props: [
      'title',
      'natureOptions',
      'dataTypeOptions',
      'calcTypeOptions',
      'scaleOptions',
      'treeData'
    ],
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
      async handleSubmit () {
        // 验证子组件内的form
        const status = await this.$refs.baseInfo.$refs.form.validate()
        if (status) {
          const res = await saveAndUpdate(this.form)
          console.log(res)
        }
      },
      // 处理EditBaseInfo组件数据更新事件
      handleUpdateBaseInfo (data) {
        console.log(JSON.stringify(data))
        this.form.index = data
      }
    }
  }
</script>
