<template>
  <div>
    <table-search v-model="query" @search="searchHandler" @reset="resetHandler"></table-search>

    <v-table-tool-bar>
      <b-button type="primary" icon="ios-add-circle-outline"
        @click="$emit('create')" :disabled="!Boolean(columnId)">
        添加
      </b-button>
    </v-table-tool-bar>

    <b-table :columns="columns" :data="list" :loading="loading">
      <template v-slot:contentType="{ row }">
        {{ contentType[row.contentType] }}
      </template>

      <template v-slot:publishDate="{ row }">
        {{ $util.parseTime(row.publishDate) }}
      </template>

      <template v-slot:thumbnailPath>
        <b-button type="text" @click="openThumbnail = true">
          set
        </b-button>
      </template>

      <template v-slot:isTop="{ row }">
        <b-switch v-model="row.isTop">
        </b-switch>
      </template>

      <template v-slot:contentStatus="{ index }">
        <b-select appendToBody
          v-model="list[index].contentStatus" @on-change="contentStatusChangeHandler">
          <b-option v-for="(value, key) in contentStatus" :key="key" :value="key">
            {{ value }}
          </b-option>
        </b-select>
      </template>

      <template v-slot:action="{ row }">
        <b-button type="text" @click="editBtnHandler(row)">
          编辑
        </b-button>
        <b-button type="text" text-color="danger" @click="removeBtnHandler(row.id)">
          删除
        </b-button>
      </template>
    </b-table>

    <b-page :total="total" show-sizer :current.sync="query.page"
      @on-change="pageChangeHandler"
      @on-page-size-change="pageSizeChangeHandler">
    </b-page>

    <thumbnail v-model="openThumbnail" :newsId="newsId"></thumbnail>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import permission from '../../../../common/mixins/permission'
  import { getContentList, removeContent } from '../../../../api/cms/news-mgmt.api'
  import TableSearch from './TableSearch'
  import Thumbnail from './Thumbnail'

  export default {
    name: 'newsMgmtTableCon',
    mixins: [permission],
    props: [
      'columnId'
    ],
    components: {
      TableSearch,
      Thumbnail
    },
    data () {
      return {
        openThumbnail: false,
        loading: false,
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
        newsId: null
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
        contentType: state => state.newsMgmt.contentType,
        contentStatus: state => state.newsMgmt.contentStatus
      })
    },
    created () {
      this.getContentList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取内容(新闻)列表
       */
      async getContentList () {
        this.loading = true
        try {
          const res = await getContentList(this.query)
          this.total = res.total
          this.list = res.rows
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 搜索组件触发搜索按钮search事件回调
       */
      searchHandler () {
        this.query.page = 1
        console.log(this.query)
        // this.getContentList()
      },

      /**
       * @author haodongdong
       * @description 搜索组件触发重置按钮reset事件回调
       */
      resetHandler () {

      },

      contentStatusChangeHandler (val) {
        console.log(val)
      },

      /**
       * @author haodongdong
       * @description 编辑按钮回调
       * @param {Content} row
       */
      editBtnHandler (row) {
        this.$emit('edit', this.$util.deepClone(row))
      },

      /**
       * @author haodongdong
       * @description 删除按钮回调
       * @param {string} id 内容(新闻)id
       */
      removeBtnHandler (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前内容？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await removeContent(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.getContentList()
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },

      /**
       * @author haodongdong
       * @description 分页组件切换分页按钮回调
       * @param {number} page 当前页面
       */
      pageChangeHandler (page) {
        this.query.page = page
        this.getContentList()
      },

      /**
       * @author haodongdong
       * @description 分页组件，页面尺寸切换事件
       * @param {number} size
       */
      pageSizeChangeHandler (size) {
        this.query.page = 1
        this.query.size = size
        this.getContentList()
      }
    }
  }
</script>
