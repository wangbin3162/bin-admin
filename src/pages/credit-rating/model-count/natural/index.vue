<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.name" placeholder="请输入名称"></b-input>
          </v-filter-item>
          <v-filter-item title="证件号码">
            <b-input v-model="listQuery.code" placeholder="请输入证件号码"></b-input>
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
          <b-button type="primary" icon="ios-add-circle-outline">重新计算</b-button>
          <b-button plain icon="md-list">模板计算</b-button>
          <b-button plain icon="ios-arrow-round-down">下载模板</b-button>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="{ row }">
            <b-button type="text" @click="handleCheck(row)">
              {{ row.natBaseInfo.name }}
            </b-button>
          </template>

          <template v-slot:idTypeName="{ row }">
            {{ row.natBaseInfo.idTypeName }}
          </template>

          <template v-slot:idCode="{ row }">
            {{ row.natBaseInfo.idCode }}
          </template>

          <template v-slot:createDate="{ row }">
            {{ $util.parseTime(row.createDate, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
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
      :detail="detail"></detail>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import Detail from './Detail'
  import { getNaturalList, getModelList } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ModelCountNatural',
    mixins: [commonMixin, permission],
    components: {
      Detail
    },
    data () {
      return {
        detail: '', // 存储行数据
        listQuery: {
          name: '',
          modelId: '',
          levelCode: ''
        },
        columns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '名称', slot: 'name' },
          { title: '证件类型', slot: 'idTypeName', align: 'center' },
          { title: '证件号码', slot: 'idCode', width: 150, align: 'center' },
          { title: '评价方案', key: 'modelName', align: 'center' },
          { title: '等级标准', key: 'ratingName', align: 'center' },
          { title: '评价得分', key: 'score', align: 'center' },
          { title: '评价等级', key: 'levelCode', align: 'center' },
          { title: '评价日期', slot: 'createDate', width: 170, align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        defaultModelId: null, // 存储默认模型id
        modelList: [], // 评级模型下拉框数据
        ratingOptions: [] // 评级等级下拉框数据
      }
    },
    created () {
      this.getModelList()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          compName: '',
          modelId: this.defaultModelId,
          levelCode: ''
        }
        this.searchList()
      },
      // 评价方案下拉框chang事件
      handleModelChange (val) {
        // 变化后更新评价等级下拉框数据
        this.ratingOptions = this.modelList.find(item => {
          return item.id === val
        }).ratingOptions
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (row) {
        this.detail = row
        this.openEditPage('check')
      },
      handleModify (row) {
        // this.editData = row
        // this.openEditPage('modify')
      },
      // 获取评级模型
      async getModelList () {
        try {
          const res = await getModelList('A01') // A02 法人
          this.modelList = res
          // 用于下拉框选中设为默认的评级模型
          const defaultModel = res.find(item => item.sysDefault === '1')
          this.listQuery.modelId = defaultModel.id
          this.defaultModelId = defaultModel.id
          this.ratingOptions = defaultModel.ratingOptions
        } catch (error) {
          console.error(error)
        }
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getNaturalList(this.listQuery)
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
