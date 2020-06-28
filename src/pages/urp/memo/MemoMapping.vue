<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="备忘录名称">
            <b-input v-model.trim="listQuery.memoName" placeholder="请输入" clearable/>
          </v-filter-item>
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resourceName" placeholder="请输入" clearable/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:personClass="{row}">{{ personClassMap[row.personClass] }}</template>
          <template v-slot:isSys="{row}">{{ mapTypeMap[row.isSys] }}</template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <!--如果可编辑且是禁用（可删除即为禁用）状态下不可编辑-->
            <b-button :disabled="!canModify" type="text" @click="handleModify(row)">
              修改
            </b-button>
            <!--是否有删除键-->
            <b-button :disabled="!canRemove" type="text" text-color="danger"
                      @click="handleRemove(row)">
              删除
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <b-form :model="mapping" ref="form" :rules="ruleValidate" :label-width="130">
            <b-row :gutter="20">
              <b-col span="12">
                <b-form-item label="备忘录名称" prop="memoId">
                  <memo-select v-model="mapping.memoId" :default-name="mapping.memoName"
                              @on-change="memo=>{ mapping.memoName = memo.memoName}"/>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="主体类型" prop="personClass">
                  <b-select v-model="mapping.personClass" clearable>
                    <b-option v-for="(val,key) in personClassMap" :key="key" :value="key">{{ val }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-form-item label="映射类型" prop="isSys" class="bin-form-item-required">
              <b-radio-group v-model="mapping.isSys" @on-change="handleIsSysChange">
                <b-radio label="1">资源信息</b-radio>
                <b-radio label="0">外部接口</b-radio>
              </b-radio-group>
            </b-form-item>
            <b-row :gutter="20">
              <b-col span="12">
                <b-form-item label="资源信息" prop="resourceKey"
                            :class="{'bin-form-item-required':mapping.isSys==='1'}">
                  <res-choose v-model="mapping.resourceKey" :default-name="mapping.resourceName"
                              @on-change="res=>{ mapping.resourceName = res.resourceName}"/>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="接口标识" prop="ifcTagName"
                            :class="{'bin-form-item-required':mapping.isSys==='0'}">
                  <ifc-tag-select v-model="mapping.ifcTagName"/>
                </b-form-item>
              </b-col>
            </b-row>
          </b-form>
        </b-collapse-wrap>
        <!--<b-code-editor class="mt-20" v-if="isEdit" :value="JSON.stringify(mapping,null,2)" readonly/>-->
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/urp/memo-mapping.api'
  import ResChoose from '../../../pages/urp/memo/ResChoose'
  import MemoSelect from '../components/MemoSelect'
  import IfcTagSelect from '../components/IfcTagSelect'

  export default {
    name: 'MemoMapping',
    components: { IfcTagSelect, MemoSelect, ResChoose },
    mixins: [commonMixin, permission],
    data() {
      const validateMemo = (rule, value, callback) => {
          if (value.length === 0) {
            callback(new Error('备忘录必选'))
          } else {
            api.oneMemo(this.mapping).then(response => {
              if (response.data.data) {
                callback(new Error('备忘录已配置映射'))
              } else {
                callback()
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          }
      }
      const validateResource = (rule, value, callback) => {
        if (this.mapping && this.mapping.isSys === '1') {
          if (value.length === 0) {
            callback(new Error('资源信息必选'))
          } else {
            api.oneResource(this.mapping).then(response => {
              if (response.data.data) {
                callback(new Error('该资源信息所属的元信息已经配置过'))
              } else {
                callback()
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          }
        } else {
          callback()
        }
      }
      const validateIfcTagName = (rule, value, callback) => {
        if (this.mapping && this.mapping.isSys === '0') {
          if (value.length === 0) {
            callback(new Error('接口必选'))
          } else {
            api.oneIfcTagName(this.mapping).then(response => {
              if (response.data.data) {
                callback(new Error('接口已被占用'))
              } else {
                callback()
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          }
        } else {
          callback()
        }
      }
      return {
        listQuery: {
          memoName: '',
          resourceName: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '备忘录名称', key: 'memoName' },
          { title: '主体类型', slot: 'personClass', align: 'center', width: 150 },
          { title: '映射类型', slot: 'isSys', align: 'center', width: 200 },
          { title: '接口标识', key: 'ifcTagName' },
          { title: '资源名称', key: 'resourceName' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        memoTypeMap: { '1': '惩戒', '2': '激励' },
        memoStatusMap: { '0': '通报', '1': '实施', '2': '过期' },
        personClassMap: { 'ZRP': '自然人', 'FO': '法人和其他组织' },
        mapTypeMap: { '0': '外部接口', '1': '资源信息' },
        ruleValidate: {
          memoId: [{ required: true, validator: validateMemo, trigger: 'change' }],
          personClass: [{ required: true, message: '主体类型必选', trigger: 'change' }],
          resourceKey: [{ validator: validateResource, trigger: 'change' }],
          ifcTagName: [{ validator: validateIfcTagName, trigger: 'change' }]
        },
        mapping: null
      }
    },
    created() {
      this.resetMapping()
      this.resetQuery()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          memoName: '',
          resourceName: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetMapping()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetMapping()
        this.mapping = { ...this.mapping, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        this.$confirm({
          title: '确实要删除当前映射吗？',
          content: '删除这条数据后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeMapping(row.id).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            }).catch(() => {
              this.$modal.remove()
            })
          }
        })
      },
      // 映射类型改变
      handleIsSysChange(val) {
        // 校验资源信息和接口标识
        this.$refs.form.validateField('resourceKey')
        this.$refs.form.validateField('ifcTagName')
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createMapping : api.modifyMapping
            fun(this.mapping).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 重置对象
      resetMapping() {
        this.mapping = {
          id: '',
          memoId: '',
          memoName: '',
          resourceKey: '',
          resourceName: '',
          personClass: '',
          ifcTagName: '',
          isSys: '1' // { '1': '资源信息', '0': '外部接口' }
        }
      },
      // 查询所有措施列表
      searchList() {
        this.setListData()
        api.getMemoMappingList(this.listQuery).then(response => {
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
