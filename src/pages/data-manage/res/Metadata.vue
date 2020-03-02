<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="名称" label-pos="center">
            <b-input v-model.trim="listQuery.tableName" size="small" placeholder="英文名" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="描述" label-pos="center">
            <b-input v-model.trim="listQuery.metadataName" size="small" placeholder="中文名" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="状态" label-pos="center">
            <b-select v-model="listQuery.status" size="small">
              <b-option v-for="item in statusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary"
                    v-waves size="small" icon="ios-add"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--名称-->
          <template v-slot:tableName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.tableName }}</b-button>
          </template>
          <!--主体类别-->
          <template v-slot:personClass="scope">{{ personClassMap[scope.row.personClass] }}</template>
          <!--状态-->
          <template v-slot:status="scope">{{ statusMap[scope.row.status] }}</template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <template v-if="scope.row.status==='edit'||scope.row.status==='audited'">
              <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)">
                修改
              </b-button>
              <!--是否有删除键-->
              <template v-if="canRemove">
                <b-divider type="vertical"></b-divider>
                <b-button type="text" style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
              </template>
              <!--草稿状态有发布按钮-->
              <template v-if="scope.row.status==='edit'">
                <b-divider type="vertical"></b-divider>
                <b-button type="text" style="color:green;" @click="handlePublish(scope.row)">发布</b-button>
              </template>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <b-form :model="metadata" ref="form" :rules="ruleValidate" :label-width="130">
          <b-row>
            <b-col span="12">
              <b-form-item label="所属类目" class="bin-form-item-required">
                <b-alert v-if="currentTreeNode">{{currentTreeNode.title}}</b-alert>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="主体类别" prop="personClass">
                <v-cascade :data="personClassOptions" :disabled="dialogStatus==='modify'"
                           v-model="metadata.personClass" @on-change="handlePersonClassChange"></v-cascade>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="名称" prop="tableName">
                <b-input v-model="metadata.tableName" placeholder="请输入元信息英文名称" clearable
                         :disabled="dialogStatus==='modify'"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="描述" prop="metadataName">
                <b-input v-model="metadata.metadataName" placeholder="请输入元信息中文名称" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="摘要" prop="metadataDesc">
            <b-input v-model="metadata.metadataDesc" placeholder="请输入摘要" type="textarea"></b-input>
          </b-form-item>
        </b-form>
        <!--信息项-->
        <template v-if="metadata.personClass && metadata.fields" slot="full">
          <div class="p15" flex="main:justify cross:center">
            <b-tag type="primary">信息项</b-tag>
            <div>
              <b-button type="primary" size="mini" transparent @click="handleAddPerson">添加主体</b-button>
              <b-button v-if="this.metadata.idsFlag>0" size="mini" transparent type="danger" @click="handleClearPerson">
                清空多主体
              </b-button>
            </div>
          </div>
          <!--信息项表格组件-->
          <meta-fields v-model="metadata.fields"
                       :person-class="metadata.personClass"
                       :data-type-map="dataTypeMap"
                       :data-type-options="dataTypeOptions"
                       @on-add-person="handleAddPerson"></meta-fields>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap v-if="metadata&&currentTreeNode">
        <div>
          <v-key-label label="类目类别" is-half is-first>{{ currentTreeNode.title }}</v-key-label>
          <v-key-label label="英文名" is-half>{{ metadata.tableName }}</v-key-label>
          <v-key-label label="名称" is-half is-first>{{ metadata.metadataName }}</v-key-label>
          <v-key-label label="主体类别" is-half>{{ metadata.personClass }}</v-key-label>
          <v-key-label label="资源标识符" is-half is-first>{{ metadata.metadataKey }}</v-key-label>
          <v-key-label label="状态" is-half>{{ statusMap[metadata.status] }}</v-key-label>
          <v-key-label label="摘要" is-bottom>{{ metadata.metadataDesc }}</v-key-label>
        </div>
        <!--信息项-->
        <template v-if="metadata.fields" slot="full">
          <b-divider align="left">信息项</b-divider>
          <!--max-height="432"-->
          <b-table disabled-hover :data="metadata.fields" :columns="fieldsColumns" size="small"></b-table>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getClassifyTree } from '../../../api/data-manage/classify.api'
  import * as api from '../../../api/data-manage/metadata.api'
  import { getMetadataStatus, getDataType } from '../../../api/enum.api'
  import { MetaFields } from './components/MetaData'
  import { ischina2, requiredRule } from '../../../common/utils/validate'

  export default {
    name: 'MetaData',
    components: { MetaFields },
    mixins: [commonMixin, permission],
    data() {
      // 中文名校验
      const validateMetadataName = (rule, value, callback) => {
        if (value.length > 0) {
          if (ischina2(value)) {
            api.oneMetaName(this.metadata).then(response => {
              if (!response.data.data) {
                callback()
              } else {
                callback(new Error('元信息描述重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('元信息描述'))
          }
        }
      }
      // 英文名校验
      const validateTableName = (rule, value, callback) => {
        if (value.length > 0) {
          if (this.dialogStatus === 'modify') {
            callback()
          }
          if (/^(leg_|nat_)\w+$/.test(value)) {
            api.oneTableName(this.metadata).then(response => {
              if (!response.data.data) {
                callback()
              } else {
                callback(new Error('英文名称重复'))
              }
            }).catch(() => {
              callback(new Error('请求验证重复性出错'))
            })
          } else {
            callback(new Error('请输入以leg_或nat_开头的英文名称'))
          }
        }
      }
      return {
        moduleName: '元信息',
        listQuery: {
          metadataCode: '', // 类目类别
          tableName: '', // 元信息英文名
          metadataName: '', // 元信息中文名
          status: 'audited'// 状态
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '元信息名称', slot: 'tableName' },
          { title: '元信息描述', key: 'metadataName' },
          { title: '主体类别', slot: 'personClass' },
          { title: '状态', slot: 'status', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 160 }
        ],
        fieldsColumns: [
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle', tooltip: true },
          { title: '类型', key: 'dataType', width: 100, align: 'center' },
          { title: '数据长度', key: 'dataLength', width: 80, align: 'center' },
          { title: '数据精度', key: 'dataPrecision', width: 80, align: 'center' },
          { title: '备注', key: 'fieldDesc' }
        ],
        metadata: null,
        ruleValidate: {
          tableName: [requiredRule, { validator: validateTableName, trigger: 'blur' }],
          metadataName: [requiredRule, { validator: validateMetadataName, trigger: 'blur' }],
          personClass: [{ required: true, message: '主体类别必选', trigger: 'change' }]
        },
        statusMap: { 'edit': '草稿', 'audited': '发布', 'closed': '关闭' },
        statusOptions: [],
        dataTypeMap: {},
        dataTypeOptions: [],
        personClassMap: {},
        personClassOptions: [] // 主体类型级联菜单
      }
    },
    created() {
      this.getMetadataEnum()
      this.initTree()
      this.resetMetadata()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.metadataCode = node.code
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          metadataCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别
          tableName: '', // 元信息英文名
          metadataName: '', // 元信息中文名
          status: 'audited' // 状态
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        if (this.currentTreeNode && (!this.currentTreeNode.code || this.currentTreeNode.code.length === 0)) {
          this.$message({ type: 'danger', content: '不可在跟节点创建元信息' })
          return
        }
        // 获取资源标识符
        this.resetMetadata()
        api.getBizKey().then(res => {
          if (res.data.code === '0') {
            this.metadata.metadataKey = res.data.data
            this.openEditPage('create')
          } else {
            this.$message({ type: 'danger', content: '获取资源标识符失败' })
          }
        })
      },
      // 新增一个主体
      handleAddPerson() {
        api.queryMultiPersonFields().then(res => {
          if (res.data.code === '0') {
            // 格式化新主体列表
            this.metadata.idsFlag++
            const newList = res.data.data.map(item => ({
              fieldName: item.fieldName + this.metadata.idsFlag,
              fieldTitle: item.fieldTitle,
              dataType: item.dataType,
              dataLength: item.dataLength,
              controlType: item.controlType,
              status: item.status,
              idsFlag: this.metadata.idsFlag > 0
            }))
            this.metadata.fields = this.metadata.fields.concat(newList)
          }
        })
      },
      // 清空多主体
      handleClearPerson() {
        this.metadata.fields = this.metadata.fields.filter(item => !item.idsFlag)
        this.metadata.idsFlag = 0
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let metadata = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前元信息吗？`,
          loading: true,
          onOk: () => {
            api.removeMetadata(metadata).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 弹窗提示是否发布
      handlePublish(row) {
        let metadata = { ...row }
        this.$confirm({
          title: '警告',
          content: `确定要发布本条元信息？`,
          loading: true,
          onOk: () => {
            api.publishMetadata(metadata).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.initTree()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 编辑事件
      handleModify(row) {
        this.metadata = { ...row }
        this.getMetadataFields(() => {
          this.openEditPage('modify')
        })
      },
      // 查看按钮事件
      handleCheck(row) {
        this.metadata = { ...row }
        this.getMetadataFields(() => {
          this.openEditPage('check')
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let status = this.metadata.status
            // 这里修改的时候需要额外判断是否发布，如已经发布，则实际相当于copy一个新增，后台会将原有同名元信息设置为历史状态
            let fun = (this.dialogStatus === 'create' || (this.dialogStatus === 'modify' && status === 'audited'))
              ? api.createMetadata : api.modifyMetadata
            fun(this.metadata).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.initTree()
              } else {
                this.submitDone(false)
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 主体类别改变事件
      handlePersonClassChange(value) {
        if (value.length === 0) {
          this.metadata.tableName = ''
          this.metadata.fields = []
          return
        }
        this.getBaseFieldsByClassify()
      },
      // 类别改变需要获取基本信息项
      getBaseFieldsByClassify() {
        api.queryManageFields(this.metadata.personClass, this.metadata.metadataCode).then(res => {
          if (res.status === 200) {
            const result = res.data.data
            // 2.1 元信息英文名（表名）需要带入前缀
            this.metadata.tableName = result.prefix
            // 2.2 填充基本信息项
            this.metadata.fields = result.fields
            // 2.3 触发校验表明
            this.$refs.form.validateField('tableName')
          }
        })
      },
      /* [数据接口] */
      // 根据状态或者是资源标识符来获取fields
      getMetadataFields(callBack) {
        api.getFieldsByID(this.metadata.id).then(res => {
          this.metadata = res.data.data
          callBack && callBack()
        })
      },
      // 通用枚举
      getMetadataEnum() {
        let getStatusOptions = (obj) => {
          let ret = []
          Object.keys(obj).forEach(key => {
            if (key !== 'history') {
              ret.push({ value: key, label: obj[key] })
            }
          })
          return ret
        }
        // 状态枚举
        getMetadataStatus().then(res => {
          if (res.status === 200) {
            this.statusMap = res.data.data
            this.statusOptions = getStatusOptions(res.data.data)
          }
        })
        // 类型枚举
        getDataType().then(res => {
          if (res.status === 200) {
            this.dataTypeMap = res.data.data
            this.dataTypeOptions = this.formatOptions(res.data.data)
          }
        })
        // 主体类别树信息
        api.getPersonClassTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let personClasses = []
            let mapper = (node, parentCode) => {
              personClasses.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            this.personClassOptions = data.children || []
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              this.personClassMap[item.key] = item.value
            })
          }
        })
      },
      // 重置对象
      resetMetadata() {
        this.metadata = {
          id: '',
          metadataCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别
          tableName: '', // 英文名
          metadataName: '', // 中文名
          metadataDesc: '', // 摘要
          personClass: '', // 主体类别
          metadataKey: '', // 资源标识符
          idsFlag: 0, // 多主体标识,默认为0
          fields: [] // 信息项,不能为空
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        getClassifyTree('C').then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            // 如果没有当前选中节点则初始化为第一个选中
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              // 这里要注意，扩展响应式属性需要这么写
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.metadataCode = this.currentTreeNode.code
            this.handleFilter()
          }
        })
      },
      // 树节点格式化mapper
      treeMapper(node, parentId) {
        // 当前id
        const currentId = node.id
        let parents = parentId ? parentId.split(',') : []
        parents.push(currentId)
        let child = []
        if (node.children) {
          node.children.forEach(item => {
            child.push(this.treeMapper(item, parents.join(',')))
          })
        }
        // 是否是选中状态
        let isSelect = this.currentTreeNode ? this.currentTreeNode.id === currentId : false
        // 是否是展开状态，根据当前选择的节点中的parents数组来判定自身和父级的展开状态
        let isExpand = this.currentTreeNode ? this.currentTreeNode.parents.includes(currentId) : false
        return {
          id: node.id,
          title: node.text,
          code: node.code,
          parents: parents, // 配合级联展开时使用
          selected: isSelect,
          expand: isExpand, // 先全部打开,后再进行比对关闭
          children: child
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getMetadataList(this.listQuery).then(response => {
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
