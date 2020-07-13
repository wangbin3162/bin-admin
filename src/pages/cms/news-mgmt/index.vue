<template>
  <div class="news-mgmt">
    <page-header-wrap v-show="isInfo">
      <v-table-wrap>
        <section-tree slot="tree"
         @section-change="colId => columnId = colId">
        </section-tree>

        <table-con ref="tableCon" :columnId="columnId"
          @create="setPageStatus('create')"
          @edit="editHandler">
        </table-con>
      </v-table-wrap>
    </page-header-wrap>

    <edit
      v-if="isEdit"
      :columnId="columnId"
      :editData="curRow"
      @close="editCloseHandler"
      @success="editSuccessHandler">
    </edit>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { getCmsColType, getCmsContentType, getCmsContentStatus } from '../../../api/enum.api'
  import SectionTree from './SectionTree'
  import TableCon from './table-con'
  import Edit from './Edit'

  /**
   * @typedef {import('../../../api/cms/news-mgmt.api').Content} Content
   */

  export default {
    name: 'NewsMgmt',
    components: {
      SectionTree,
      TableCon,
      Edit
    },
    data () {
      return {
        columnId: '',
        curRow: null // 存储当前行
      }
    },
    computed: {
      ...mapGetters([
        'isInfo',
        'isEdit'
      ])
    },
    created () {
      this.getEnum()
    },
    methods: {
      ...mapMutations({
        setColType: 'SET_COL_TYPE',
        setConType: 'SET_CON_TYPE',
        setConStatus: 'SET_CON_STATUS'
      }),

      ...mapActions([
        'setPageStatus'
      ]),

      /**
       * @author haodongdong
       * @description 获取内容管理下相关枚举值，并设置进vuex
       */
      async getEnum () {
        try {
          const [colType, conType, conStatus] = await Promise.all([
            getCmsColType(),
            getCmsContentType(),
            getCmsContentStatus()
          ])

          this.setColType(colType)
          this.setConType(conType)
          this.setConStatus(conStatus)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '请求失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description table-con组件edit事件回调
       * @param {Content} row 点击编辑按钮所在行数据
       */
      editHandler (row) {
        this.curRow = row
        this.setPageStatus('edit')
      },

      /**
       * @author haodongdong
       * @description edit组件close事件回调
       */
      editCloseHandler () {
        this.curRow = null
        this.setPageStatus(null)
      },

      /**
       * @author haodongdong
       * @description edit组件编辑成功回调
       */
      editSuccessHandler () {
        this.$refs.tableCon.getContentList()
        this.setPageStatus(null)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .news-mgmt {

  }
</style>
