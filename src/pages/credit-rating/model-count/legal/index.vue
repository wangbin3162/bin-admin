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
          <b-button type="primary" icon="ios-add-circle-outline"
            @click="handleCheck(1)">重新计算</b-button>
          <b-button plain icon="md-list">模板计算</b-button>
          <b-button plain icon="ios-arrow-round-down">下载模板</b-button>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="[]" :loading="listLoading">
          <template v-slot:name="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">{{ row.varName }}</b-button>
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
      :title="editTitle"></detail>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import Detail from './Detail'
  import { getLegalList, getModelList } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'ModelCountLegal',
    mixins: [commonMixin, permission],
    components: {
      Detail
    },
    data () {
      return {
        id: '', // 查看详情的id
        listQuery: {
          compName: '',
          modelId: '',
          levelCode: ''
        },
        columns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '名称', slot: 'varName' },
          {
            title: '统一社会信用码',
            key: 'varCode',
            width: 140,
            ellipsis: true,
            tooltip: true,
            align: 'center'
          },
          { title: '评价方案名称', slot: 'name', align: 'center' },
          { title: '等级标准', key: 'ratingName', align: 'center' },
          { title: '评价得分', key: 'score', ellipsis: true, tooltip: true, align: 'center' },
          { title: '评价等级', key: 'levelCode', ellipsis: true, tooltip: true, align: 'center' },
          { title: '评价日期', key: 'varDesc', ellipsis: true, tooltip: true, align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
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
          modelName: '',
          levelCode: ''
        }
        this.searchList()
      },
      // 评价方案下来框chang事件
      handleModelChange (val) {
        // 变化后更新评价等级下拉框数据
        this.ratingOptions = this.modelList.find(item => {
          return item.id === val
        }).ratingOptions
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (id) {
        this.id = id
        this.openEditPage('check')
      },
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      // 获取评级模型
      async getModelList () {
        try {
          const res = await getModelList('A02') // A01 自然人
          this.modelList = res
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
