<template>
  <div>
    <page-header-wrap v-show="visible" show-close @on-close="close" :title="drawerTitle">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="字典项名称">
            <b-input v-model.trim="listQuery.itemName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="字典项编码">
            <b-input v-model.trim="listQuery.itemCode" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="havePermission('dictItemCreate')" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!havePermission('dictItemModify')" type="text" @click="handleModify(scope.row)">修改</b-button>
            <!--是否有删除键-->
            <template v-if="havePermission('dictItemRemove')">
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
    <b-modal v-model="dialogFormVisible" :title="editTitle" :mask-closable="false" append-to-body>
      <div class="p15">
        <b-form :model="item" ref="form" :rules="ruleValidate" label-position="top">
          <b-form-item label="字典项编码" prop="itemCode">
            <b-input v-model="item.itemCode" placeholder="请输入字典项编码" clearable></b-input>
          </b-form-item>
          <b-form-item label="字典项名称" prop="itemName">
            <b-input v-model="item.itemName" placeholder="请输入字典项名称" clearable></b-input>
          </b-form-item>
          <b-form-item label="排序字段" prop="sortNum">
            <b-input-number v-model="item.sortNum" :min="0" style="width:100%;"></b-input-number>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button @click="handleCancel">取 消</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/dict.api'
  import { requiredRule } from '../../../common/utils/validate'

  export default {
    name: 'DictItem',
    mixins: [commonMixin, permission],
    data() {
      const validateItemCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneItemCode(this.item).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典项编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateItemName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneItemName(this.item).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('字典项名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '字典项',
        visible: false,
        dialogFormVisible: false,
        listQuery: {
          groupId: '',
          itemName: '',
          itemCode: ''
        },
        dict: null,
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字典项编码', key: 'itemCode' },
          { title: '字典项名称', key: 'itemName' },
          { title: '排序字段', key: 'sortNum' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        item: null, // 字典项
        ruleValidate: {
          itemCode: [requiredRule, { validator: validateItemCode, trigger: 'blur' }],
          itemName: [requiredRule, { validator: validateItemName, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.resetItem()
    },
    computed: {
      drawerTitle() {
        return `[${this.dict ? this.dict.groupName : ''}] 字典项编辑`
      }
    },
    methods: {
      open(dict) {
        this.dict = { ...dict }
        // 查询成功时打开
        this.visible = true
        this.resetQuery()
      },
      close() {
        this.visible = false
        this.$emit('on-close')
      },
      /* [事件响应] */
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          groupId: this.dict.id,
          itemName: '',
          itemCode: ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetItem()
        this.dialogFormVisible = true
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetItem()
        this.item = { ...this.item, ...row }
        this.dialogFormVisible = true
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let item = { ...row }
        this.$confirm({
          title: '确实要删除当前字典项吗？',
          content: '删除后不可恢复。',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.removeDictItem(item).then(res => {
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
      // 弹窗取消
      handleCancel() {
        this.dialogStatus = ''
        this.dialogFormVisible = false
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createDictItem : api.modifyDictItem
            fun(this.item).then(res => {
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
      /* [数据接口] */
      // 重置字典项
      resetItem() {
        this.item = {
          id: '',
          groupId: this.dict ? this.dict.id : '',
          itemName: '',
          itemCode: '',
          sortNum: 0
        }
      },
      // 查询所有字典项列表
      searchList() {
        this.setListData()
        api.getItemList(this.listQuery).then(response => {
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
