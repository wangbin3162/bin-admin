<template>
  <div class="level-standard-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-title-bar label="等级详情" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <div>
                <v-key-label label="名称">{{ detailData.ratingName }}</v-key-label>
                <v-key-label label="编码">{{ detailData.ratingCode }}</v-key-label>
                <v-key-label label="描述" is-bottom>{{ detailData.ratingDesc }}</v-key-label>
              </div>
            </b-col>
          </b-row>

          <v-title-bar label="评分标准" class="mb-15"></v-title-bar>
          <b-table :columns="columns" :data="detailData.items" size="small"></b-table>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getDetailByRatingId } from '../../../api/credit-rating/level-standard.api'

  export default {
    name: 'LevelStandardDetail',
    props: ['id', 'title', 'ratingId'],
    data () {
      return {
        loading: false,
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
        this.loading = true
        try {
          const res = await getDetailByRatingId(this.ratingId)
          this.detailData = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '读取错误', desc: error })
        }
        this.loading = false
      }
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
