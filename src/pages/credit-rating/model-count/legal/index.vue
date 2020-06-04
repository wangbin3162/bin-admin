<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.compName" placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="评价方案">
            <b-select v-model="listQuery.modelId" @on-change="handleModelChange">
              <b-option v-for="item in modelList" :key="item.id"
                :value="item.id">{{ item.name }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="评价等级">
            <b-select v-model="listQuery.levelCode">
              <b-option v-for="item in ratingOptions" :key="item.levelCode"
                :value="item.levelCode">{{ item.levelName }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <!-- <b-button type="primary" icon="ios-add-circle-outline"
            @click="handleReCount">
            重新计算
          </b-button> -->
          <b-button plain type="primary" icon="md-list" @click="handleTempCount">
            模板计算
          </b-button>
          <temp-dl-btn :personClass="personClass">
            模板下载
          </temp-dl-btn>

          <template slot="right">
            <b-button type="text" @click="handleRecord">
              模板计算记录
            </b-button>
          </template>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:modelName="{ row }">
            <b-button type="text" @click="handleCheck(row)">{{ row.modelName }}</b-button>
          </template>

          <template v-slot:idCode="{ row }">
            {{ row.legBaseInfo.idCode }}
          </template>

          <template v-slot:createDate="{ row }">
            <p>{{ $util.parseTime(row.createDate, '{y}-{m}-{d}') }}</p>
            <p>{{ $util.parseTime(row.createDate, '{h}:{i}:{s}') }}</p>
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleCreditReport(row)">
              信用报告
            </b-button>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <detail v-if="isCheck"
      @close="handleCancel"
      :title="editTitle"
      :detail="detail">
    </detail>

    <!-- 重新算分组件 -->
    <re-count
      @close="openReCount = false"
      @recount-success="handleReCountSuccess"
      :open="openReCount"
      :personClass="personClass">
    </re-count>

    <temp-count
      @close="openTempCount = false"
      :open="openTempCount"
      :personClass="personClass">
    </temp-count>

    <p-d-f
      @close="openPDF = false"
      :open="openPDF"
      :pdfBlob="pdfBlob">
    </p-d-f>

    <record-list ref="record" @on-close="handleCancel"></record-list>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getLegalList, getModelList, reCount } from '../../../../api/credit-rating/model-count.api'
  import Detail from './Detail'
  import RecordList from '../components/RecordList'
  import TempDlBtn from '../components/TempDlBtn'
  import ReCount from '../components/ReCount'
  import TempCount from '../components/TempCount'
  import PDF from '../components/PDF'

  export default {
    name: 'ModelCountLegal',
    mixins: [commonMixin, permission],
    components: {
      Detail,
      RecordList,
      TempDlBtn,
      ReCount,
      TempCount,
      PDF
    },
    data () {
      return {
        openReCount: false, // 打开re-count组件
        openTempCount: false, // 打开temp-count组件
        openPDF: false, // 打开p-d-f组件
        pdfBlob: null, // 存储re-count组件返回的pdfBlob
        personClass: 'A02', // 主体类型
        detail: {}, // 存储行数据
        listQuery: {
          compName: '',
          modelId: '',
          levelCode: ''
        },
        columns: [
          { title: '名称', slot: 'modelName' },
          {
            title: '统一社会信用码',
            slot: 'idCode',
            ellipsis: true,
            tooltip: true,
            align: 'center'
          },
          { title: '评价方案', key: 'modelName', align: 'center' },
          { title: '等级标准', key: 'ratingName', align: 'center' },
          { title: '评价得分', key: 'score', align: 'center' },
          { title: '评价等级', key: 'levelCode', align: 'center' },
          { title: '评价日期', slot: 'createDate', align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        modelList: [], // 评级模型下拉框数据
        ratingOptions: [] // 评级等级下拉框数据
      }
    },
    async created () {
      await this.getModelList()
      await this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          compName: '',
          modelName: '',
          levelCode: ''
        }
        this.searchList()
      },
      // 评价方案下拉框chang事件
      handleModelChange (val) {
        // 变化后更新评价等级下拉框数据
        if (val) {
          this.ratingOptions = this.modelList.find(item => {
            return item.id === val
          }).ratingOptions
        }
      },
      // 模板计算按钮回调
      handleTempCount () {
        this.openTempCount = true
      },
      // 模板计算记录按钮回调
      handleRecord () {
        this.dialogStatus = 'record'
        this.$refs.record.open('EVAL_LEG') // 法人
      },
      // 详情按钮回调
      handleCheck (row) {
        this.detail = row
        this.openEditPage('check')
      },
      // 信用报告按钮回调
      handleCreditReport (row) {
        this.openReCount = true
      },
      // re-count组件回调
      handleReCountSuccess (pdfBlob) {
        this.pdfBlob = pdfBlob
        this.openPDF = true
        this.searchList()
      },
      // 获取评级模型
      async getModelList () {
        try {
          const res = await getModelList('A02') // A01 自然人
          this.modelList = res
          // 存入vuex
          this.$store.commit('SET_MODEL_LIST', res)
          // 用于下拉框选中设为默认的评级模型
          const defaultModel = res.find(item => item.sysDefault === '1')
          this.listQuery.modelId = defaultModel.id
          this.ratingOptions = defaultModel.ratingOptions
        } catch (error) {
          console.error(error)
        }
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getLegalList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },
      // 或许所需的枚举值
      async getEnum () {

      }
    }
  }
</script>
