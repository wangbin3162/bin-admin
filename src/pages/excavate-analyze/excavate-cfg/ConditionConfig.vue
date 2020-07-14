<template>
  <page-header-wrap v-show="visible && isNormal" :title="resourceName+' - 条件配置'"
                    show-close @on-close="close">
    <v-table-wrap>
      <!--查询条件-->
      <v-filter-bar @keyup-enter="handleFilter">
        <v-filter-item title="字段标题">
          <b-input v-model.trim="listQuery.fieldTitle" placeholder="字段标题" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
      </v-filter-bar>
      <v-table-tool-bar>
        <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
      </v-table-tool-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading">
        <template #fieldTitle="{row,index}">
          <b-input v-model="editFieldTitle" v-if="editIndex === index" size="small"/>
          <span v-else>{{ row.fieldTitle }}</span>
        </template>
        <template #fieldSort="{row,index}">
          <b-input-number v-model="editFieldSort" v-if="editIndex === index" size="small"/>
          <span v-else>{{ row.fieldSort }}</span>
        </template>
        <template #queryType="{row,index}">
          <b-select v-model="editQueryType" v-if="editIndex === index" size="small">
            <b-option v-for="(val,key) in queryTypeMap" :key="key" :value="key" :label="val"></b-option>
          </b-select>
          <span v-else>{{ queryTypeMap[row.queryType] }}</span>
        </template>
        <!--操作栏-->
        <template #action="{row,index}">
          <template v-if="editIndex ===  index">
            <b-button @click="handleSave(row)" type="success" plain size="small">保存</b-button>
            <b-button @click="editIndex = -1" size="small">取消</b-button>
          </template>
          <b-button v-else type="primary" size="small" plain :disabled="editIndex!==-1&&editIndex!==index"
                    @click="handleEdit(row,index)">
            编辑
          </b-button>

          <b-button type="danger" size="small" plain @click="handleRemove(row)">删除</b-button>
        </template>
      </b-table>
      <!--下方分页器-->
      <b-page :total="total" show-sizer :current.sync="listQuery.page"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange"></b-page>
    </v-table-wrap>
    <b-modal v-model="configAddModal" title="新增条件字段"
             footer-hide width="1200" :mask-closable="false" :body-styles="{padding:0}">
      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input placeholder="信息项名称(中文名)" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item>
            <b-button type="primary" @click="handleFilter">
              &nbsp;查&nbsp;询&nbsp;
            </b-button>
          </v-filter-item>
        </v-filter-bar>
        选择条件字段
      </v-table-wrap>
    </b-modal>
  </page-header-wrap>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/excavate-analyze/excavate-cfg.api'
  import { isEmpty } from '../../../common/utils/assist'

  export default {
    name: 'ConditionConfig',
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        resourceName: '',
        listQuery: {
          resourceKey: '', // 所属分类
          fieldTitle: ''
        },
        treeData: [],
        columns: [
          { title: '标题', slot: 'fieldTitle' },
          { title: '字段名称', key: 'fieldName' },
          {
            title: '字段类型',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              return h('span', this.fieldTypeMap[row.fieldType])
            }
          },
          {
            title: '控件类型',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              return h('span', this.controlTypeMap[row.controlType])
            }
          },
          { title: '字段排序', slot: 'fieldSort' },
          { title: '查询类型', slot: 'queryType' },
          { title: '操作', slot: 'action', width: 230 }
        ],
        fieldTypeMap: { string: '字符串', date: '日期', dateTime: '日期时间', dict: '字典', enum: '枚举' },
        controlTypeMap: { SELECT: '下拉框', DATE: '日期' },
        queryTypeMap: { exact: '精确查询', fuzzy: '模糊查询', range: '范围查询' },
        editFieldTitle: '',
        editFieldSort: null,
        editQueryType: '',
        editIndex: -1,
        configAddModal: false
      }
    },
    methods: {
      // 打开面板
      open(resourceKey, resourceName) {
        this.resourceName = resourceName
        this.listQuery.resourceKey = resourceKey
        this.visible = true
        // 查询列表
        this.resetQuery()
      },
      // 关闭当前面板
      close() {
        this.visible = false
        this.$emit('on-close')
      },
      // 打开新增弹窗
      handleCreate() {
        api.getFields(this.listQuery.resourceKey).then(resp => {
          console.log(resp)
        })
        this.configAddModal = true
      },
      // 编辑某一行内容
      handleEdit(row, index) {
        this.editFieldTitle = row.fieldTitle
        this.editFieldSort = row.fieldSort
        this.editQueryType = row.queryType
        this.editIndex = index
      },
      // 保存某一行内容
      handleSave(row) {
        if (isEmpty(this.editFieldTitle)) {
          this.$message({ type: 'danger', content: '标题不能为空!' })
          return
        }
        let config = {
          id: row.id,
          resourceKey: row.resourceKey,
          controlType: row.controlType,
          fieldName: row.fieldName,
          fieldType: row.fieldType,
          fieldTitle: this.editFieldTitle,
          fieldSort: this.editFieldSort,
          queryType: this.editQueryType,
          flag: row.flag
        }
        api.modifyCondition(config).then(resp => {
          if (resp.data.code === '0') {
            this.searchList()
          } else {
            this.$notice.danger({ title: '更新失败', desc: resp.data.message || '' })
          }
          this.editFieldTitle = ''
          this.editFieldSort = ''
          this.editQueryType = ''
          this.editIndex = -1
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        console.log(row)
        this.$confirm({
          title: '确定删除当前条件吗？',
          iconName: 'danger',
          loading: true,
          onOk: () => {
            // api.removeCondition(row.id).then(res => {
            //   if (res.data.code === '0') {
            //     this.$message({ type: 'success', content: '操作成功' })
            //     this.$modal.remove()
            //     this.handleFilter()
            //   } else {
            //     this.$modal.remove()
            //     this.$notice.danger({ title: '操作错误', desc: res.data.message })
            //   }
            // })
          }
        })
      },
      // 重置查询条件
      resetQuery() {
        this.listQuery.page = 1
        this.listQuery.fieldTitle = ''
        this.handleFilter()
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getConditionConfigList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
