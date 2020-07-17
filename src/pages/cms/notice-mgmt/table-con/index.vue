<template>
  <div>
    <table-search v-model="query" @search="searchHandler" @reset="resetHandler">
    </table-search>

    <v-table-tool-bar>
      <b-button type="primary" icon="ios-add-circle-outline"
        @click="$emit('create')">
        添加
      </b-button>
    </v-table-tool-bar>

    <b-table :columns="columns" :data="list" :loading="loading">
      <template v-slot:title="{ row }">
        <b-button type="text" t-ellipsis :title="row.title" @click="$emit('detail', row)">
          {{ row.title }}
        </b-button>
      </template>

      <template v-slot:type="{ row }">
        {{ noticeType[row.type] }}
      </template>

      <template v-slot:isTop="{ row }">
        <b-switch v-model="row.isTop" @on-change="topSwitchHandler($evnet, row)"></b-switch>
      </template>

      <template v-slot:notifyStatus="{ row }">
        {{ noticeStatus[row.notifyStatus] }}
      </template>

      <template v-slot:action="{ row }">
        <b-button type="text" text-color="danger" @click="removeBtnHandler(row.id)">
          删除
        </b-button>

        <template v-if="row.notifyStatus === 'DRAFT'">
          <b-divider type="vertical"></b-divider>

          <b-dropdown append-to-body>
            <b-button type="text">
              更多
              <b-icon name="ios-arrow-down"></b-icon>
            </b-button>
            <b-dropdown-menu slot="list">
              <b-dropdown-item style="color: #0d85ff;" @click.native="editBtnHandler(row)">
                编辑
              </b-dropdown-item>
              <b-dropdown-item style="color: #0d85ff;" @click.native="pubBtnHandler(row.id)">
                发布
              </b-dropdown-item>
            </b-dropdown-menu>
          </b-dropdown>
        </template>

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
  import {
    getNoticeList,
    removeNotice,
    setTop,
    setStatus
  } from '../../../../api/cms/notice-mgmt.api'
  import TableSearch from './TableSearch'

  /**
   * @typedef {import('../../../../api/cms/notice-mgmt.api').Notice} Notice
   */

  export default {
    name: 'NoticeMgmtTableCon',
    mixins: [permission],
    props: [],
    components: {
      TableSearch
    },
    data () {
      return {
        loading: false,
        total: 0,
        query: {
          title: '',
          type: '',
          notifyStatus: '',
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '通知标题', slot: 'title', ellipsis: true, tooltip: true },
          { title: '通知类型', slot: 'type' },
          { title: '置顶', slot: 'isTop' },
          { title: '状态', slot: 'notifyStatus' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        list: []
      }
    },
    computed: {
      ...mapState({
        noticeType: state => state.noticeMgmt.noticeType,
        noticeStatus: state => state.noticeMgmt.noticeStatus
      })
    },
    created () {
      this.getNoticeList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取内容(新闻)列表
       */
      async getNoticeList () {
        this.loading = true
        try {
          const res = await getNoticeList(this.query)
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
        this.getNoticeList()
      },

      /**
       * @author haodongdong
       * @description 搜索组件触发重置按钮reset事件回调
       */
      resetHandler () {
        this.getNoticeList()
      },

      /**
       * @author haodongdong
       * @description 置顶开关组件回调
       * @param {boolean} status 开关状态
       * @param {Content} row 当前内容(新闻)
       */
      async topSwitchHandler (status, row) {
        try {
          await setTop(row.id, status)
          this.getNoticeList()
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          row.isTop = !status
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 状态栏b-select组件改变的回调
       * @param {string} contentStatus 改变后的值
       * @param {string} id 当前行内容(新闻)id
       */
      async contentStatusChangeHandler (contentStatus, id) {
        try {
          // await setStatus(id, contentStatus)
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          this.getNoticeList()
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
       * @description 发布按钮回调
       * @param {string} id 通知id
       */
      async pubBtnHandler (id) {
        try {
          await setStatus(id, 'PUBLISHED')
          this.getNoticeList()
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 删除按钮回调
       * @param {string} id 内容(新闻)id
       */
      removeBtnHandler (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前通知？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await removeNotice(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.getNoticeList()
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作失败', desc: error })
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
        this.getNoticeList()
      },

      /**
       * @author haodongdong
       * @description 分页组件，页面尺寸切换事件
       * @param {number} size
       */
      pageSizeChangeHandler (size) {
        this.query.page = 1
        this.query.size = size
        this.getNoticeList()
      }
    }
  }
</script>
