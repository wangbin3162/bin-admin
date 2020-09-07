<template>
  <div class="raring-model-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <div style="position: relative;">
          <b-loading fix show-text="加载中..." v-if="loading"></b-loading>
          <b-collapse-wrap title="基本信息" collapse>
            <div>
                <v-key-label label="模型名称" is-first is-half>{{ detailData.modelName }}</v-key-label>
                <v-key-label label="模型编码" is-half>{{ detailData.modelCode }}</v-key-label>
                <v-key-label label="主体类别" is-first is-half>{{ personClassEnum[detailData.personClass] }}</v-key-label>
                <v-key-label label="等级名称" is-half>{{ detailData.ratingName }}</v-key-label>
                <v-key-label label="描述" is-bottom>{{ detailData.modelDesc }}</v-key-label>
              </div>
          </b-collapse-wrap>

          <b-collapse-wrap title="指标信息" collapse>
            <global-weight-table :modelId="id"></global-weight-table>
          </b-collapse-wrap>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import Big from 'big.js'
  import { getRatingModeDetail } from '@/api/credit-rating/rating-model.api'
  import GlobalWeightTable from '@/pages/credit-rating/rating-model/components/index-config/GlobalWeightTable'

  export default {
    name: 'RatingModelDetail',
    props: ['title', 'id'],
    components: {
      GlobalWeightTable
    },
    data () {
      return {
        loading: false,
        detailData: {}
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.ratingModel.personClassEnum
      },
      statusEnum () { // 状态枚举
        return this.$store.state.ratingModel.statusEnum
      },
      defaultEnum () { // 缺省模型枚举
        return this.$store.state.ratingModel.defaultEnum
      }
    },
    created () {
      this.getRatingModeDetail()
    },
    methods: {
      async getRatingModeDetail () {
        this.loading = true
        try {
          const res = await getRatingModeDetail(this.id)
          this.detailData = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '获取详情失败', desc: error })
        }
        this.loading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .raring-model-detail {
    width: 100%;
  }
</style>
