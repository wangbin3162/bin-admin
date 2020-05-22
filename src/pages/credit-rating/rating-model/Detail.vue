<template>
  <div class="raring-model-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full" style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
          <v-title-bar label="基本信息" class="mb-15"></v-title-bar>
          <b-row type="flex" justify="center">
            <b-col span="18">
              <div>
                <v-key-label label="模型名称" is-first is-half></v-key-label>
                <v-key-label label="模型编码" is-half></v-key-label>
                <v-key-label label="主体类别" is-first is-half></v-key-label>
                <v-key-label label="等级名称" is-half></v-key-label>
                <v-key-label label="启用/禁用" is-first is-half></v-key-label>
                <v-key-label label="缺省模型" is-half></v-key-label>
                <v-key-label label="描述" is-bottom></v-key-label>
              </div>
            </b-col>
          </b-row>

          <v-title-bar label="指标信息" class="mb-15"></v-title-bar>
          <!-- <b-table :columns="columns" :data="detailData.items" size="small"></b-table> -->
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getRatingModeDetail } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModelDetail',
    props: ['title', 'id'],
    data () {
      return {
        loading: false,
        detailData: {}
      }
    },
    created () {
      this.getRatingModeDetail()
    },
    methods: {
      async getRatingModeDetail () {
        try {
          const res = await getRatingModeDetail(this.id)
          this.detailData = res
          console.log(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '获取详情失败', desc: error })
        }
      }
    }
  }
</script>
