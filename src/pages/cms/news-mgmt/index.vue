<template>
  <div class="news-mgmt">
    <page-header-wrap>
      <v-table-wrap @keyup-enter="handleFilter">
        <section-tree slot="tree"></section-tree>

        <v-filter-bar>
          <v-filter-item title="新闻标题" :span="8">
            <b-input placeholder="请输入"></b-input>
          </v-filter-item>

          <v-filter-item title="内容类型" :span="8">
            <b-select>
            </b-select>
          </v-filter-item>

          <v-filter-item @on-search="handleFilter" @on-reset="resetQueryHandler" :span="8"
            :show-toggle="true" :is-opened="filterOpened"
            @on-toggle="filterOpened=!filterOpened">
          </v-filter-item>

          <collapse-transition>
            <div v-show="filterOpened" style="width: 100%;">
              <v-filter-item title="内容状态" :span="8">
                <b-select>
                </b-select>
              </v-filter-item>

              <v-filter-item title="发布时间" :span="8">
                <b-date-picker type="daterange" placement="bottom-start"
                  placeholder="请选择发布时间">
                </b-date-picker>
              </v-filter-item>
            </div>
          </collapse-transition>
        </v-filter-bar>

        <b-table :columns="columns" :data="list">
          <template v-slot:action>
            <b-button type="text">
              编辑
            </b-button>

            <b-button type="text" text-color="danger">
              删除
            </b-button>
          </template>
        </b-table>

        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange">
        </b-page>

      </v-table-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getCmsColType } from '../../../api/enum.api'
  import SectionTree from './SectionTree'

  export default {
    name: 'NewsMgmt',
    mixins: [commonMixin, permission],
    components: {
      SectionTree
    },
    data () {
      return {
        listQuery: {
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '新闻标题', key: '' },
          { title: '内容类型', key: '' },
          { title: '发布时间', key: '' },
          { title: '缩略图', key: '' },
          { title: '置顶', key: '' },
          { title: '状态', key: '' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        list: [],
        curRow: null
      }
    },
    computed: {
      colTypeEnmu () {
        return this.$store.state.cms.colType
      }
    },
    created () {
      this.getEnum()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取内容管理下相关枚举值，并设置进vuex
       */
      async getEnum () {
        try {
          const [colType] = await Promise.all([
            getCmsColType()
          ])
          this.$store.commit('SET_COL_TYPE', colType)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 重置分页查询参数listQuery
       */
      resetQueryHandler () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .news-mgmt {

  }
</style>
