<template>
  <div>
    <table-search v-model="query" @search="searchHandler" @reset="resetHandler"></table-search>

    <v-table-tool-bar>
      <b-button type="primary" icon="ios-add-circle-outline"
        @click="$emit('create')">添加</b-button>
    </v-table-tool-bar>

    <b-table :columns="columns" :data="list">
      <template v-slot:contentType="{ row }">
        {{ conType[row.contentType] }}
      </template>

      <template v-slot:publishDate="{ row }">
        {{ $util.parseTime(row.publishDate) }}
      </template>

      <template v-slot:thumbnailPath>
        <b-button type="text">新增</b-button>
      </template>

      <template v-slot:isTop="{ row }">
        <b-switch v-model="row.isTop">
        </b-switch>
      </template>

      <template v-slot:contentStatus="{ index }">
        <b-select appendToBody
          v-model="list[index].contentStatus" @on-change="conStatusChangeHandler">
          <b-option v-for="(value, key) in conStatus" :key="key" :value="key">
            {{ value }}
          </b-option>
        </b-select>
      </template>

      <template v-slot:action>
        <b-button type="text">
          编辑
        </b-button>
        <b-button type="text" text-color="danger">
          删除
        </b-button>
      </template>
    </b-table>

    <b-page :total="total" show-sizer :current.sync="query.page"
      @on-change="pageChangeHandler"
      @on-page-size-change="pageSizeChangeHandler">
    </b-page>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import permission from '../../../../common/mixins/permission'
  import { getConList } from '../../../../api/cms/news-mgmt.api'
  import TableSearch from './table-search'

  export default {
    name: 'newsMgmtTableCon',
    mixins: [permission],
    props: [
      'columnId'
    ],
    components: {
      TableSearch
    },
    data () {
      return {
        total: 0,
        query: {
          columnId: this.columnId,
          title: '',
          contentType: '',
          contentStatus: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '新闻标题', key: 'title', ellipsis: true, tooltip: true },
          { title: '内容类型', slot: 'contentType' },
          { title: '发布时间', slot: 'publishDate' },
          { title: '缩略图', slot: 'thumbnailPath' },
          { title: '置顶', slot: 'isTop' },
          { title: '状态', slot: 'contentStatus' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        list: [],
        curRow: null
      }
    },
    watch: {
      columnId: {
        handler (newVal, oldVal) {
          this.query.columnId = newVal
          this.searchHandler(this.query)
        }
      }
    },
    computed: {
      ...mapState({
        colType: state => state.newsMgmt.colType,
        conType: state => state.newsMgmt.conType,
        conStatus: state => state.newsMgmt.conStatus
      })
    },
    created () {
      this.getConList(this.query)
    },
    methods: {
      async getConList (query) {
        try {
          const res = await getConList(query)
          this.total = res.total
          this.list = res.rows
        } catch (error) {
          console.error(error)
        }
      },

      searchHandler () {
        this.query.page = 1
        this.getConList(this.query)
      },

      resetHandler () {

      },

      conStatusChangeHandler (val) {
        console.log(val)
      },

      pageChangeHandler () {

      },

      pageSizeChangeHandler () {

      }
    }
  }
</script>
