<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-title-bar label="变量详情" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <div>
                <v-key-label label="变量名称" is-half is-first>
                  {{ detail.varName }}
                </v-key-label>
                <v-key-label label="变量编码" is-half>
                  {{ detail.varCode }}
                </v-key-label>
                <v-key-label label="变量类型" is-half is-first>
                  {{ varTypeEnum[detail.varType] }}
                </v-key-label>
                <v-key-label label="数据类型" is-half>
                  {{ dataTypeEnum[detail.dataType] }}
                </v-key-label>
                <v-key-label label="模板内容">
                  {{ detail.tplContent }}
                </v-key-label>
                <v-key-label label="描述" is-bottom>
                  {{ detail.varName }}
                </v-key-label>
              </div>
            </b-col>
          </b-row>

          <v-title-bar label="参数项" class="mb-15"></v-title-bar>
          <b-table :columns="columns" :data="params" size="small">
            <template v-slot:paraType="{ row }">
              {{ paramTypeEnum[row.paraType] }}
            </template>
          </b-table>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getIndexVarDetail } from '../../../api/credit-rating/index-var.api'

  export default {
    name: 'IndexVarDetail',
    props: [
      'title',
      'id',
      'varTypeEnum',
      'dataTypeEnum',
      'paramTypeEnum'
    ],
    data () {
      return {
        loading: false,
        detail: {},
        params: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', key: 'paraName' },
          { title: '参数编码', key: 'paraCode' },
          { title: '参数类型', slot: 'paraType' },
          { title: '描述', key: 'paraDesc' }
        ]
      }
    },
    created () {
      this.getIndexVarDetail()
    },
    methods: {
      async getIndexVarDetail () {
        this.loading = true
        try {
          const res = await getIndexVarDetail(this.id)
          this.detail = res
          this.params = this.detail.params.filter(item => {
            return item.paraCode !== 'person_id' // 过滤person_id，不显示在table中
          })
        } catch (error) {
          console.log(error)
        }
        this.loading = false
      }
    }
  }
</script>
