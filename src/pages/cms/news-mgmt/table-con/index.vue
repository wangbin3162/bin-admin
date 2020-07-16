<template>
  <div>
    <table-search v-model="query" @search="searchHandler" @reset="resetHandler">
    </table-search>

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

      <template v-slot:thumbnailPath="{ row }">
        <b-button type="text" @click="thumbnailBtnHandler(row)">
          {{ Boolean(row.thumbnailPath) ? '更新' : '新增' }}
        </b-button>
      </template>

      <template v-slot:isTop="{ row }">
        <b-switch v-model="row.isTop"
          @on-change="topSwitchHandler($event, row)">
        </b-switch>
      </template>

      <template v-slot:contentStatus="{ row }">
        <b-select appendToBody v-model="row.contentStatus"
          @on-change="contentStatusChangeHandler($event, row.id)">
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

    <thumbnail v-model="openThumbnail"
     :thumbnailData="thumbnailData"
     @success="getContentList">
    </thumbnail>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import permission from '../../../../common/mixins/permission'
  import {
    getContentList, removeContent,
    setTop, setStatus
  } from '../../../../api/cms/news-mgmt.api'
  import TableSearch from './TableSearch'
  import Thumbnail from './Thumbnail'

  /**
   * @typedef {import('../../../../api/cms/news-mgmt.api').Content} Content
   */
  /**
   * @typedef {import('../../../../api/cms/news-mgmt.api').ContentThumbnail} ContentThumbnail
   */

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
          publishDateStart: '',
          publishDateEnd: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '新闻标题', key: 'title', ellipsis: true, tooltip: true },
          { title: '内容类型', slot: 'contentType' },
          // { title: '发布时间', slot: 'publishDate' },
          { title: '缩略图', slot: 'thumbnailPath' },
          { title: '置顶', slot: 'isTop' },
          { title: '状态', slot: 'contentStatus' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        list: [],
        thumbnailData: null // 缩略图数据对象
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
        this.getContentList()
      },

      /**
       * @author haodongdong
       * @description 搜索组件触发重置按钮reset事件回调
       */
      resetHandler () {
        this.getContentList()
      },

      /**
       * @author haodongdong
       * @description 置顶开关组件回调
       * @param {boolean} status 开关状态
       * @param {Content} row 当前内容(新闻)
       */
      async topSwitchHandler (status, row) {
        console.log(status)
        try {
          await setTop(row.id, status)
          this.getContentList()
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          row.isTop = !status
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 缩略图操作按钮回调
       * @param {Content} row
       */
      thumbnailBtnHandler (row) {
        this.thumbnailData = {
          id: row.id,
          thumbnailPath: row.thumbnailPath,
          thumbnailHeight: row.thumbnailHeight,
          thumbnailWidth: row.thumbnailWidth
        }
        this.openThumbnail = true
      },

      /**
       * @author haodongdong
       * @description 状态栏b-select组件改变的回调
       * @param {string} contentStatus 改变后的值
       * @param {string} id 当前行内容(新闻)id
       */
      async contentStatusChangeHandler (contentStatus, id) {
        try {
          await setStatus(id, contentStatus)
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          this.getContentList()
          console.error(error)
        }
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
              console.error(error)
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
