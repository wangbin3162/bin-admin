<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input v-model="listQuery.compName" placeholder="请输入名称"></b-input>
            <!-- <div flex>
              <b-input placeholder="请选择主体" :value="personName" disabled></b-input>
              <b-button type="primary" plain @click="handleSelectBtn">选择</b-button>
            </div> -->
          </v-filter-item>
           <v-filter-item title="评级模型">
            <b-select v-model="listQuery.modelId" @on-change="handleModelChange" clearable>
              <b-option v-for="item in modelList" :key="item.id"
                :value="item.id">{{ item.name }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="等级标准">
            <b-select v-model="listQuery.levelCode" clearable>
              <b-option v-for="item in ratingOptions" :key="item.levelCode"
                :value="item.levelCode">{{ item.levelName }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline"
            v-if="havePermission('createReport')"
            @click="handleReport">
            生成报告
          </b-button>
          <b-button plain type="primary" icon="md-list"
            v-if="havePermission('batchImportCalc')"
            @click="handleTempCount">
            批量导入计算
          </b-button>

          <template slot="right">
            <temp-dl-btn type="text" :personClass="personClass"
              v-if="havePermission('templateDownload')">
              模板下载
            </temp-dl-btn>
            <b-divider type="vertical"></b-divider>
            <b-button type="text"
              v-if="havePermission('importRecords')"
              @click="handleRecord">
              导入记录
            </b-button>
          </template>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:compName="{ row }">
            <b-button type="text" @click="handleCheck(row)"
              t-ellipsis :title="row.legBaseInfo.compName">
              {{ row.legBaseInfo.compName }}
            </b-button>
          </template>

          <template v-slot:idTypeName="{ row }">
            <span t-ellipsis :title="row.legBaseInfo.idTypeName">
              {{ row.legBaseInfo.idTypeName }}
            </span>
          </template>

          <template v-slot:idCode="{ row }">
            <span t-ellipsis :title="row.legBaseInfo.idCode">
              {{ row.legBaseInfo.idCode }}
            </span>
          </template>

          <template v-slot:createDate="{ row }">
            <p>{{ $util.parseTime(row.createDate, '{y}-{m}-{d}') }}</p>
            <p>{{ $util.parseTime(row.createDate, '{h}:{i}:{s}') }}</p>
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text"
              :disabled="!havePermission('creditReport')"
              @click="handleCreditReport(row)">
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

    <leg-person-modal ref="legModal" @choose-one="handleChooseOne"></leg-person-modal>

    <detail v-if="isCheck"
      @close="handleCancel"
      :id="curRow.id"
      :title="editTitle"
      :personId="curRow.personId"
      :resourceKey="curRow.legBaseInfo.resourceKey">
    </detail>

    <!-- 重新算分组件 -->
    <re-count
      @close="openReCount = false"
      @recount-success="handleReCountSuccess"
      :open="openReCount"
      :optional="optional"
      :personClass="personClass"
      :personId="curRow.personId"
      :personName="curRow.legBaseInfo.compName">
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
  import LegPersonModal from '../../../../components/Validator/FormControl/LegPersonModal'
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
      LegPersonModal,
      Detail,
      RecordList,
      TempDlBtn,
      ReCount,
      TempCount,
      PDF
    },
    data () {
      return {
        optional: false,
        openReCount: false, // 打开re-count组件
        openTempCount: false, // 打开temp-count组件
        openPDF: false, // 打开p-d-f组件
        pdfBlob: null, // 存储re-count组件返回的pdfBlob
        personClass: 'A02', // 主体类型
        personName: '', // 搜索栏主体选择input显示用
        curRow: {
          legBaseInfo: {}
        }, // 存储行数据
        listQuery: {
          // personId: '',
          comeName: '',
          modelId: '',
          levelCode: ''
        },
        columns: [
          { title: '名称', slot: 'compName' },
          { title: '证件类型', slot: 'idTypeName', align: 'center' },
          {
            title: '证件号码',
            slot: 'idCode',
            ellipsis: true,
            tooltip: true,
            align: 'center'
          },
          { title: '评级模型', key: 'modelName', align: 'center' },
          { title: '等级标准', key: 'ratingName', align: 'center' },
          { title: '评价得分', key: 'score', align: 'center' },
          { title: '评价等级', key: 'levelCode', align: 'center' },
          // { title: '评价日期', slot: 'createDate', align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        defaultModelId: null, // 存储默认模型id
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
          comeName: '',
          modelId: this.defaultModelId,
          levelCode: ''
        }
        this.personName = ''
        this.searchList()
      },
      /**
       * @author haodongdong
       * @description 主体选择按钮回调
       */
      handleSelectBtn () {
        this.$refs.legModal.open()
      },
      // 主体选择组件回调
      handleChooseOne (val) {
        this.personName = val.compName
        this.listQuery.personId = val.id
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
      // 生成报告按钮回调
      handleReport () {
        this.optional = true // 组件可选主体
        this.openReCount = true
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
        this.curRow = row
        this.openEditPage('check')
      },
      // 信用报告按钮回调
      handleCreditReport (row) {
        this.optional = false // 组件不可选主体
        this.curRow = row
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
          if (defaultModel) {
            this.listQuery.modelId = defaultModel.id
            this.defaultModelId = defaultModel.id
            this.ratingOptions = defaultModel.ratingOptions
          }
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
