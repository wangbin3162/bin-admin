<template>
  <b-modal v-model="open" title="添加监管" width="1000"
    :append-to-body="false" :body-styles="{ padding: 0 }"
    @on-visible-change="handleVisibleChange">
    <v-table-wrap>
      <v-filter-bar @keyup-enter="handleSearchBtn">
        <v-filter-item title="名称" :span="8">
          <b-input v-model="query.keyValues.name" placeholder="输入名称" clearable></b-input>
        </v-filter-item>

        <v-filter-item @on-search="handleSearchBtn" @on-reset="resetBtn">
        </v-filter-item>
      </v-filter-bar>

      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <template v-slot:action="{ row }">
          <b-button type="text" @click.stop="handleAddSupervisionBtn(row)">
            加入监管
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>

    <div slot="footer">
      <b-page :total="total"
        :current.sync="query.page"
        :page-size="query.size"
        @on-change="handlePageChange"/>
    </div>
  </b-modal>
</template>

<script>
  import {
    getCompAndPerson, addSupervision
  } from '@/api/credit-supervision/my-supervision.api'

  export default {
    name: 'KPAddsupervision',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        total: 0,
        query: {
          resourceKey: 'DIR-20191014-173845-746', // 重点人群的resourceKey
          keyValues: {
            name: ''
          },
          ops: {
            name: 'LIKE'
          },
          size: 10,
          page: 1
        },
        listLoading: false,
        list: [],
        columns: [
          { type: 'index', width: 50 },
          { title: '名称', key: 'name' },
          { title: '证件类型', key: 'id_type', ellipsis: true, tooltip: true },
          { title: '证件号码', key: 'id', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 70 }
        ]
      }
    },
    watch: {
      value (newVal) {
        this.open = newVal
      },
      open (newVal) {
        this.$emit('input', newVal)
      }
    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      handleVisibleChange (visible) {
        if (visible) {
          this.getList()
        } else {
          this.query.page = 1
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @description 获取需要添加监管的市场主体列表
       */
      async getList () {
        this.listLoading = true
        try {
          const { total, rows } = await getCompAndPerson(this.query)
          this.total = total
          this.list = rows
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description 搜索按钮回调
       */
      handleSearchBtn () {
        this.query.page = 1
        this.getList(this.query)
      },

      /**
       * @author haodongdong
       * @description 重置按钮回调
       */
      resetBtn () {
        this.query.size = 10
        this.query.page = 1
        this.query.keyValues.name = ''
        this.handleSearchBtn()
      },

      /**
       * @author haodongdong
       * @description 加入监管按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.id 主体id
       * @param {string} row.name 主体名称
       */
      async handleAddSupervisionBtn (row) {
        try {
          await addSupervision({
            objectId: row.id,
            objectName: row.name,
            jgType: 'KP'
          })
          this.$message({
            type: 'success',
            content: '操作成功'
          })
          this.$emit('success')
          this.open = false
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       * @param {number} page
       */
      handlePageChange (page) {
        this.query.page = page
        this.getList()
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
