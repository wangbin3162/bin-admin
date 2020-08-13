<template>
  <b-modal v-model="open" title="添加监管" width="1000"
    :append-to-body="false" :body-styles="{ padding: 0 }"
    @on-visible-change="handleVisibleChange">
    <v-table-wrap>
      <v-filter-bar @keyup-enter="handleSearchBtn">
        <v-filter-item title="名称" :span="8">
          <b-input v-model="listQuery.typeName" placeholder="输入名称" clearable></b-input>
        </v-filter-item>

        <v-filter-item @on-search="handleSearchBtn" @on-reset="resetQuery">
        </v-filter-item>
      </v-filter-bar>

      <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
        <template v-slot:typeName="{ row }">
          <span class="t-ellipsis" :title="row.typeName">{{ row.typeName }}</span>
        </template>

        <template v-slot:action="{ row }">
          <b-button type="text" @click.stop="handleSelectBtn(row)">
            选择
          </b-button>
        </template>
      </b-table>
    </v-table-wrap>

    <div slot="footer">
      <!--下方分页器-->
      <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
    </div>
  </b-modal>
</template>

<script>

  export default {
    name: 'IAAddsupervision',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        treeLoading: false,
        curTreeNode: null,
        treeData: [],
        total: 0,
        listQuery: {
          parentId: '',
          typeName: '',
          typeCode: '',
          size: 10,
          page: 1
        },
        listLoading: false,
        list: [],
        columns: [
          { type: 'index', width: 50 },
          { title: '名称', key: '' },
          { title: '主体类别', key: '' },
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
       * @description 查询列表
       */
      async searchList() {
        // this.setListData()
        // try {
        //   const res = await getConTypeList(this.listQuery)
        //   this.setListData({
        //     list: res.rows,
        //     total: res.total
        //   })
        // } catch (error) {
        //   console.error(error)
        //   this.$notice.danger({ title: '加载失败', desc: error })
        // }
      },

      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.listQuery.typeName = ''
          this.listQuery.typeCode = ''
          this.listQuery.size = 10
          this.listQuery.page = 1
          this.curTreeNode = null
          this.treeData = []
          this.list = []
        }
      },

      async init () {
        this.searchList()
      },

      handleSearchBtn () {

      },

      /**
       * @author haodongdong
       * @description 重置按钮回调
       */
      resetQuery () {
        this.listQuery.typeName = ''
        this.listQuery.typeCode = ''
        this.listQuery.size = 10
        this.listQuery.page = 1
        this.handleSearchBtn()
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.typeName 类别名称
       * @param {string} row.typeCode 类别编码
       */
      handleSelectBtn (row) {
        this.$emit('selected', row)
        this.open = false
      },

      handleCurrentChange () {

      }

    }
  }
</script>

<style lang="stylus" scoped>

</style>
