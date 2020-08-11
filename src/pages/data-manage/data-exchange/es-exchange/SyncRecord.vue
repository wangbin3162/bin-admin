<template>
  <div>
    <page-header-wrap title="ES数据同步记录" show-close @on-close="$emit('close')">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="执行时间">
            <b-date-picker type="datetimerange" :value="dateStrArr"
              placement="bottom-start"
              placeholder="请选择执行时间"
              @on-change="handleDateChange">
            </b-date-picker>
          </v-filter-item>
          <v-filter-item title="执行状态">
            <b-select v-model="listQuery.esSyncStatus" clearable>
              <b-option v-for="(value, key) in esSyncStatusEnum" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:jobBeginDate="{ row }">
            {{ row.jobBeginDate }}
          </template>

          <template v-slot:jobEndDate="{ row }">
            {{ row.jobEndDate }}
          </template>

          <template v-slot:queryTimeCondtions="{ row }">
            <span v-if="row.queryTimeCondtions.length > 0" t-ellipsis
              :title="row.queryTimeCondtions[0] + '~' + row.queryTimeCondtions[1]">
              <span>
                {{ $util.parseTime(new Date(row.queryTimeCondtions[0]), '{y}-{m}-{d}') }}
              </span>
               ~
               <span>
                 {{ $util.parseTime(new Date(row.queryTimeCondtions[1]), '{y}-{m}-{d}') }}
               </span>
            </span>
          </template>

          <template v-slot:exeStatus="{ row }">
            <b-tag :type="{
              COMPLETED: 'success',
              STARTED: 'primary',
              FAILED: 'danger'
            }[row.exeStatus]" dot no-border :key="row.exeStatus">
              {{ esSyncStatusEnum[row.exeStatus] }}
            </b-tag>
          </template>

          <!-- 操作栏 -->
          <template v-slot:action="{ row, index }">
            <b-button type="text" :disabled="row.exeStatus !== 'FAILED' || btnLoading"
              @click="handleRebootBtn(row, index)" >
              <template v-if="btnLoading && curRowIndex === index">
                <b-icon name="loading2" class="icon-is-rotating"></b-icon>
              </template>
              重启
            </b-button>
            <!-- <b-button type="text" :loading="btnLoading">测试</b-button> -->
          </template>
        </b-table>

        <!-- 下方分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import commonMixin from '../../../../common/mixins/mixin'
    import permission from '../../../../common/mixins/permission'
    import {getSingleResourceResult, syncESData} from '@/api/data-manage/es-exchange.api'

    export default {
    name: 'SyncRecord',
    mixins: [commonMixin, permission],
    props: {
      resourceKey: {
        type: String,
        required: true
      }
    },
    components: {

    },
    data () {
      return {
        btnLoading: false,
        curRowIndex: null,
        dateStrArr: ['', ''],
        listQuery: {
          resourceKey: '',
          esSyncStatus: '',
          createDate: '',
          finishDate: '',
          size: 10,
          page: 1
        },
        columns: [
          { title: '作业ID', key: 'jobId', ellipsis: true, tooltip: true },
          { title: '开始时间', slot: 'jobBeginDate', align: 'center' },
          { title: '结束时间', slot: 'jobEndDate', align: 'center' },
          { title: '总耗时', key: 'totalCost' },
          { title: '条件', slot: 'queryTimeCondtions', align: 'left' },
          { title: '任务状态', slot: 'exeStatus' },
          { title: '数据总量', key: 'syncTotal', align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ]
      }
    },
    computed: {
      ...mapState({
        esSyncStatusEnum: state => state.esExchange.esSycnStatus
      })
    },
    created () {
      this.listQuery.resourceKey = this.resourceKey
      this.searchList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 根据resourceKey查询同步列表
       * @param {Object} query 查询参数对象
       */
      async searchList() {
        this.listLoading = true
        try {
          const res = await getSingleResourceResult(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description 日期组件on-change事件回调
       * @param {string[]} 日期字符串数组
       */
      handleDateChange (dateStrArr) {
        this.dateStrArr = dateStrArr
        this.listQuery.createDate = dateStrArr[0]
        this.listQuery.finishDate = dateStrArr[1]
      },

      /**
       * @author haodongdong
       * @description 重置查询
       */
      resetQuery () {
        this.listQuery.createDate = ''
        this.listQuery.finishDate = ''
        this.listQuery.esSyncStatus = ''
        this.listQuery.size = 10
        this.listQuery.page = 1
        this.handleFilter()
      },

      /**
       * @author haodongdong
       * @description 重启按钮回调
       * @param {Object} row 当前行数据
       * @param {number} index 当前行index
       */
      async handleRebootBtn (row, index) {
        this.curRowIndex = index
        this.btnLoading = true
        try {
          let param = {
            importId: row.id,
            isAll: '',
            resourceKeys: [row.resourceKey]
          }
          if (row.queryTimeCondtions.length > 0) {
            param.beginDate = row.queryTimeCondtions[0]
            param.endDate = row.queryTimeCondtions[1]
          } else {
            param.beginDate = ''
            param.endDate = ''
          }
          await syncESData(param)
          this.searchList()
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      }

    }
  }
</script>
