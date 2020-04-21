<template>
  <div>
    <page-header-wrap v-show="isNormal || isEdit">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="字典名称">
            <b-input v-model.trim="listQuery.groupName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="字典编码">
            <b-input v-model.trim="listQuery.groupCode" placeholder="请输入" clearable></b-input>
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
          <!--字典类型-->
          <template v-slot:dictType="scope">{{ dictTypeMap[scope.row.dictType] }}</template>
          <!--操作栏-->
          <template v-slot:item="scope">
            <b-button :disabled="!havePermission('dictItem')" type="text" @click="handleDictItem(scope.row)">字典项</b-button>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">修改</b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!--编辑弹窗如字段很少时则采用弹窗方式来进行编辑,避免大面积渲染造成视觉浪费-->
    <b-modal v-model="dialogFormVisible" :title="editTitle"
             append-to-body :mask-closable="false" width="500px">
      <div class="p15">
        <b-form :model="dict" ref="form" :rules="ruleValidate" label-position="top">
          <b-form-item label="字典编码" prop="groupCode">
            <b-input v-model="dict.groupCode" placeholder="请输入字典编码" clearable></b-input>
          </b-form-item>
          <b-form-item label="字典名称" prop="groupName">
            <b-input v-model="dict.groupName" placeholder="请输入字典名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="字典类型" prop="dictType">
            <b-select v-model="dict.dictType">
              <b-option v-for="item in dictTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button @click="handleCancel">取 消</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
      </div>
    </b-modal>
    <!--字典项配置-->
    <dict-item ref="dictItem" @on-close="handleCancel"></dict-item>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/dict.api'
  import { getDictType } from '../../../api/enum.api'
  import DictItem from '../components/DictItem'
  import { requiredRule } from '../../../common/utils/validate'

  export default {
    name: 'Dict',
    components: { DictItem },
    mixins: [commonMixin, permission],
    data() {
      const validateStrFilter = (rule, value, callback) => {
        if (value.length > 0) {
           if (value.indexOf('/') !== -1) {
             callback(new Error('不能包含/字符'))
           } else {
             callback()
           }
        }
      }
      const validateDictGroupCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneGroupCode(this.dict).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典组编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateDictGroupName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneGroupName(this.dict).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典组名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '字典',
        listQuery: {
          groupName: '',
          groupCode: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典编码', key: 'groupCode', width: 200 },
          { title: '字典名称', key: 'groupName' },
          { title: '字典类型', slot: 'dictType', width: 120, align: 'center' },
          { title: '设置', slot: 'item', width: 120, align: 'center' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        dict: null,
        ruleValidate: {
          groupCode: [requiredRule, { validator: validateDictGroupCode, trigger: 'blur' }, { validator: validateStrFilter, trigger: 'blur' }],
          groupName: [requiredRule, { validator: validateDictGroupName, trigger: 'blur' }, { validator: validateStrFilter, trigger: 'blur' }]
        },
        dictTypeMap: { 'SYS': '系统字典', 'EXT': '内部单选' }, // 默认值
        dialogFormVisible: false
      }
    },
    computed: {
      dictTypeOptions() {
        let ret = []
        Object.keys(this.dictTypeMap).forEach(key => {
          ret.push({ value: key, label: this.dictTypeMap[key] })
        })
        return ret
      },
      ENUM() {
        return { SYS: 'SYS', EXT: 'EXT' } // 常量比对键值对
      }
    },
    created() {
      this.getDictTypeEnum()
      this.resetDict()
      this.searchList()
    },
    methods: {
      /* [事件响应] */
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupName: '',
          groupCode: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetDict()
        this.dialogFormVisible = true
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetDict()
        this.dict = { ...this.dict, ...row }
        this.dialogFormVisible = true
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let dict = { ...row }
        this.$confirm({
          title: '确实要删除当前字典组吗？',
          content: '存在字典项时不可删除。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeDictGroup(dict).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
              } else {
                this.$modal.remove()
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
            })
          }
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createDictGroup : api.modifyDictGroup
            fun(this.dict).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.searchList()
              } else {
                this.submitDone(false)
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.dialogFormVisible = false
            })
          }
        })
      },
      // 弹出字典项编辑页
      handleDictItem(row) {
        this.dialogStatus = 'dictItem'
        this.$refs.dictItem && this.$refs.dictItem.open(row)
      },
      // 弹窗取消
      handleCancel() {
        this.dialogStatus = ''
        this.dialogFormVisible = false
      },
      /* [数据接口] */
      // 通用枚举
      getDictTypeEnum() {
        getDictType().then(res => {
          if (res.status === 200) {
            this.dictTypeMap = res.data.data
          }
        })
      },
      // 重置对象
      resetDict() {
        this.dict = {
          id: '',
          groupCode: '',
          groupName: '',
          dictType: this.ENUM.EXT
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getDictGroupList(this.listQuery).then(response => {
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
