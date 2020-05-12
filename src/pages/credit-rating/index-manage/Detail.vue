<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-loading fix show-text="loading" v-if="loading"></b-loading>
        <div>
          <v-key-label label="指标名称" is-half is-first>
            {{ detail.indexName }}
          </v-key-label>
          <v-key-label label="指标编码" is-half>
            {{ detail.indexCode }}
          </v-key-label>
          <v-key-label label="指标性质" is-half is-first>
            {{ natureEnum[detail.indexKind] }}
          </v-key-label>
          <v-key-label label="指标类型" is-half>
            {{ detail.bizTypeName }}
          </v-key-label>
          <v-key-label label="数据类型" is-half is-first>
            {{ dataTypeEnum[detail.dataType] }}
          </v-key-label>
          <v-key-label label="计算类型" is-half>
            {{ calcTypeEnum[detail.calClass] }}
          </v-key-label>
          <v-key-label label="变量" is-half is-first>
            {{ detail.varName }}
          </v-key-label>
          <v-key-label label="标度" is-half>
            {{ scaleEnum[detail.indexScale] }}
          </v-key-label>
           <v-key-label label="有效期字段" is-half is-first>
            {{ detail.validParamName }}
          </v-key-label>
          <v-key-label label="有效期" is-half>
            {{ detail.validMonth }} 月
          </v-key-label>
          <v-key-label label="描述" is-bottom>
            {{ detail.indexDesc }}
          </v-key-label>
        </div>
        <b-divider align="left">
          <h4>指标配置</h4>
        </b-divider>
        <!-- <b-table :columns="columns" :data="detail.params" size="small">
          <template v-slot:paraType="{ row }">
            {{ paramTypeEnum[row.paraType] }}
          </template>
        </b-table> -->
        <b-divider align="left">
          <h4>资源信息</h4>
        </b-divider>
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getIndeManageDetail } from '../../../api/credit-rating/index-manage.api'

  export default {
    name: 'IndexManageDetail',
    props: [
      'title',
      'id',
      'natureEnum',
      'dataTypeEnum',
      'calcTypeEnum',
      'scaleEnum'
    ],
    data () {
      return {
        loading: false,
        detail: {}
        // columns: [
        //   { type: 'index', width: 50, align: 'center' },
        //   { title: '参数名称', key: 'paraName' },
        //   { title: '参数编码', key: 'paraCode' },
        //   { title: '参数类型', slot: 'paraType' },
        //   { title: '描述', key: 'paraDesc' }
        // ]
      }
    },
    created () {
      this.getIndeManageDetail()
    },
    methods: {
      async getIndeManageDetail () {
        this.loading = true
        try {
          const { index, resources, rules } = await getIndeManageDetail(this.id)
          this.detail = index
        } catch (error) {
          console.error(error)
          this.$log.pretty('searchList Error', error, 'danger')
        }
        this.loading = false
      }
    }
  }
</script>
