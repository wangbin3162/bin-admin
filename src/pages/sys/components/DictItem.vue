<template>
  <!--字典项抽屉-->
  <b-drawer v-model="dictItemVisible" :title="drawerTitle" fullscreen
            class="layout-inner">
    <!--增加编辑区域-->
    <v-table-layout>
      <!--查询条件-->
      <v-filter-bar slot="filter">
        <v-filter-item title="字典项名称">
          <b-input v-model.trim="listQuery.itemName" size="small" placeholder="请输入字典项名称" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="字典项编码">
          <b-input v-model.trim="listQuery.itemCode" size="small" placeholder="请输入字典项编码" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--控制栏-->
      <template slot="ctrl" v-if="canCreate">
        <b-button type="primary" v-waves size="small" icon="ios-add" @click="handleCreate">新增</b-button>
      </template>
      <!--中央表格-->
      <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
               stripe max-height="526" ref="table" :width="tableWidth">
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)" v-waves>修改</b-button>
          <!--是否有删除键-->
          <template v-if="canRemove">
            <b-divider type="vertical"></b-divider>
            <b-button type="text" v-waves style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
          </template>
        </template>
      </b-table>
      <!--编辑抽屉-->
      <b-modal v-model="dialogFormVisible" :title="editTitle" :mask-closable="false" append-to-body>
        <!--增加编辑区域-->
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
        <div slot="footer" class="t-center">
          <b-button type="primary" v-waves @click="handleSubmit" :loading="btnLoading">确 定</b-button>
          <b-button v-waves @click="handleCancel">取 消</b-button>
        </div>
      </b-modal>
    </v-table-layout>
    <!--下方分页器-->
    <div slot="footer" class="t-right">
      <b-page slot="footer" :total="total" show-sizer
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    </div>
  </b-drawer>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/dict.api'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

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
        dictItemVisible: false,
        listQuery: {
          groupId: '',
          itemName: '',
          itemCode: ''
        },
        dict: null,
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 50,
            align: 'center',
            indexMethod: (row) => {
              return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
            }
          },
          { title: '字典项编码', key: 'itemCode' },
          { title: '字典项名称', key: 'itemName' },
          { title: '排序字段', key: 'sortNum' },
          { title: '操作', slot: 'action', width: 180 }
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
        return `[${this.dict ? this.dict.groupName : ''}]字典项编辑`
      }
    },
    methods: {
      open(dict) {
        this.dict = { ...dict }
        // 查询成功时打开
        this.dictItemVisible = true
        this.resetQuery()
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
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetItem()
        this.item = { ...this.item, ...row }
        this.openEditPage('modify')
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let item = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前字典项吗？`,
          loading: true,
          onOk: () => {
            api.removeDictItem(item).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.searchList()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
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
            let fun = this.dialogStatus === 'create' ? api.createDictItem : api.modifyDictItem
            fun(this.item).then(res => {
              if (res.data.code === '0') {
                this.btnLoading = false
                this.dialogFormVisible = false
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$message({ type: 'error', content: res.data.message })
              }
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
