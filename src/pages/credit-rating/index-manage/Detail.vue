<template>
  <div class="index-manage-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap :transparent="true">
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>

      <b-collapse-wrap title="基本详情" collapse>
        <div style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
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
      </b-collapse-wrap>

      <b-collapse-wrap title="规则配置" collapse :value="!loading">
        <b-table :columns="columns" :data="rules" size="small"></b-table>
      </b-collapse-wrap>

      <b-collapse-wrap title="参数配置" collapse :value="!loading">
        <edit-source-info ref="sourceInfo"
          mode="show"
          :resources="resources"
          :personClassEnum="personClassEnum"
          :resPropertyEnum="resPropertyEnum"
          :paramTypeEnum="paramTypeEnum">
        </edit-source-info>
      </b-collapse-wrap>

    </page-header-wrap>
  </div>
</template>

<script>
  import { getIndeManageDetail } from '../../../api/credit-rating/index-manage.api'
  import EditSourceInfo from './EditSourceInfo'

  export default {
    name: 'IndexManageDetail',
    props: [
      'title',
      'id',
      'natureEnum',
      'dataTypeEnum',
      'calcTypeEnum',
      'scaleEnum',
      'personClassEnum',
      'resPropertyEnum',
      'paramTypeEnum'
    ],
    components: {
      EditSourceInfo
    },
    data () {
      return {
        loading: false,
        dataTypeCustomEnum: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        detail: {},
        rules: [],
        resources: [],
        columns: [],
        domList: []
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
          this.initColumns(index.dataType)
          this.detail = index
          this.rules = rules
          this.resources = resources
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载详情失败', desc: error })
        }
        this.loading = false
      },
      // 根据数据类型初始化不同columns
      initColumns (nature) {
        // S 字符串 N 数值
        if (nature === 'S') {
          this.columns = [
            { type: 'index', width: 50 },
            { title: '指标值', key: 'itemValue', align: 'center' },
            { title: '指标描述', key: 'itemDesc', align: 'center' },
            { title: '得分', key: 'score', align: 'center' }
          ]
        } else {
          this.columns = [
            { type: 'index', width: 50 },
            { title: '下限值 [ ', key: 'dnValue', align: 'center' },
            { title: '上限值 ) ', key: 'upValue', align: 'center' },
            { title: '得分', key: 'score', align: 'center' }
          ]
        }
      }
    }
  }
</script>

<style lang="stylus">
.index-manage-detail {
  .expandRow {
    .headers {
      font-size: 13.5px;
      span {
        cursor: pointer;
      }
      .not-clear {
        cursor: not-allowed;
        color: #C0C4CC;
      }
    }
    .table-con {
      margin-top: 10px;
      font-size: 13px;

      .title {
        color: #909399;
        text-align: center;
      }
      .body {
        margin-top: 10px;
        text-align: center;
      }
      .row {
        margin-top: 7px;
      }
    }
  }
  td.bin-table-expanded-cell {
    background: #f0f2f5;
  }
}
</style>
