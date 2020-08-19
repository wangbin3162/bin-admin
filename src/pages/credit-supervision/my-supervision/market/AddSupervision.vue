<template>
  <b-modal v-model="open" title="添加监管" width="1000"
    :append-to-body="false" :body-styles="{ padding: 0 }"
    @on-visible-change="handleVisibleChange">
    <v-table-wrap>
      <v-filter-bar @keyup-enter="handleSearchBtn">
        <v-filter-item title="名称" :span="8">
          <b-input v-model="query.keyValues.comp_name" placeholder="输入名称" clearable></b-input>
        </v-filter-item>

        <v-filter-item @on-search="handleSearchBtn" @on-reset="resetBtn">
        </v-filter-item>
      </v-filter-bar>

      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <template v-slot:action="{ row }">
          <b-button type="text" @click.stop="handleAddSupervisiontBtn(row)">
            加入监管
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>

    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="query.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>
  import {
    getCompAndPerson, addSupervision
  } from '@/api/credit-supervision/my-supervision.api'

  export default {
    name: 'MSAddsupervision',
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
          resourceKey: 'DIR-20191014-173239-707', // 市场主体的resourceKey
          keyValues: {
            comp_name: ''
          },
          ops: {
            comp_name: 'LIKE'
          },
          size: 10,
          page: 1
        },
        listLoading: false,
        list: [],
        columns: [
          { type: 'index', width: 50 },
          { title: '名称', key: 'comp_name' },
          { title: '统一社会信用码', key: 'id_shxym', ellipsis: true, tooltip: true },
          { title: '组织结构码', key: 'id_zzjg', ellipsis: true, tooltip: true },
          { title: '工商注册号', key: 'id_gszc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 70, align: 'center' }
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
          this.getList(this.query)
        } else {
          this.query.size = 10
          this.query.page = 1
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @description 获取需要添加监管的市场主体列表
       * @param {Object} query 查询参数
       * @param {string} query.resourceKey 资源key，市场主体：DIR-20191014-173239-707 重点人群：DIR-20191014-173845-746
       * @param {number} query.size 分页大小
       * @param {string} query.page 当前页
       */
      async getList (query) {
        this.listLoading = true
        try {
          const { total, rows } = await getCompAndPerson(query)
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
        this.query.keyValues.comp_name = ''
        this.handleSearchBtn()
      },

      /**
       * @author haodongdong
       * @description 加入监管按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.typeName 类别名称
       * @param {string} row.typeCode 类别编码
       */
      async handleAddSupervisiontBtn (row) {
        try {
          await addSupervision({
            objectId: row.id,
            objectName: row.comp_name,
            jgName: '市场主体',
            jgType: 'MS',
            jgDesc: ''
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

      handleCurrentChange () {

      }

    }
  }
</script>

<style lang="stylus" scoped>

</style>
