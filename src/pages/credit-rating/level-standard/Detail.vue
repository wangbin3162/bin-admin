<template>
  <div class="level-standard-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div>
          <v-key-label label="名称">{{ detailData.ratingName }}</v-key-label>
          <v-key-label label="编码">{{ detailData.ratingCode }}</v-key-label>
          <v-key-label label="描述" is-bottom>{{ detailData.ratingDesc }}</v-key-label>
        </div>
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>

        <div class="table">
          <b-table :columns="columns" :data="detailData.items"></b-table>
        </div>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getDetailByRatingId } from '../../../api/credit-rating/level-standard.api'

  export default {
    name: 'levelStandardDetail',
    props: ['id', 'title', 'ratingId'],
    data () {
      return {
        detailData: {},
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '等级', key: 'levelName' },
          { title: '上限值', key: 'upScore' },
          { title: '下限值', key: 'dnScore' },
          { title: '描述', key: 'levelDesc', ellipsis: true, tooltip: true }
        ]
      }
    },
    created () {
      this.getDetailByRatingId()
    },
    methods: {
      async getDetailByRatingId () {
        try {
          const res = await getDetailByRatingId(this.ratingId)
          this.detailData = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '读取错误', desc: error })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.level-standard-detail {
  .table {
    margin-top: 40px;
  }
}
</style>
