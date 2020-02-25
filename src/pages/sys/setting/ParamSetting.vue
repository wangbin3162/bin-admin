<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="参数名称">
            <b-input v-model.trim="listQuery.confName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="参数编码">
            <b-input v-model.trim="listQuery.confCode" size="small" placeholder="请输入" clearable></b-input>
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
          <template v-slot:confName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.confName }}</b-button>
          </template>
          <!--取值类型-->
          <template v-slot:valueMode="scope">
            <b-tag :type="scope.row.valueMode|valueModeStyleFilter" size="medium">
              {{ valueModeMap[scope.row.valueMode] }}
            </b-tag>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button :disabled="!canModify" type="text" @click="handleModify(scope.row)" v-waves>修改</b-button>
            <b-divider type="vertical"></b-divider>
            <b-button :disabled="!canModify" type="text" @click="handleSet(scope.row)" v-waves>设置</b-button>
            <!--是否有删除键-->
            <template v-if="canRemove">
              <b-divider type="vertical"></b-divider>
              <b-button type="text" v-waves style="color:red;" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isEdit" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <b-form :model="conf" ref="form" :rules="ruleValidate" :label-width="100">
          <b-form-item label="所属类型" class="bin-form-item-required">
            <b-input v-if="currentTreeNode" :value="currentTreeNode.title" disabled></b-input>
          </b-form-item>
          <b-row>
            <b-col span="12">
              <b-form-item label="参数名称" prop="confName">
                <b-input v-model="conf.confName" placeholder="请输入参数名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="参数编码" prop="confCode">
                <b-input v-model="conf.confCode" placeholder="请输入参数编码" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="取值类型" prop="valueMode" class="bin-form-item-required">
                <b-select v-model="conf.valueMode">
                  <b-option v-for="item in valueModeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="排序编号" prop="sortNum">
                <b-input-number :min="0" v-model="conf.sortNum" style="width: 100%;"></b-input-number>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="描述" prop="desc">
            <b-input v-model="conf.desc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
          <template v-if="conf.valueMode===ENUM.RADIO||conf.valueMode===ENUM.CHECKBOX">
            <b-divider align="left">{{ valueModeMap[conf.valueMode] }}参数</b-divider>
            <b-table disabled-hover :data="conf.bufferValue"
                     :columns="[
                     { title: '显示', slot: 'label'},
                     { title: '值', slot: 'value' },
                     { title: '操作', slot: 'action', width: 160}]">
              <template v-slot:label="scope">
                <b-input v-if="scope.row.edit" clearable size="mini"
                         v-model="conf.bufferValue[scope.index].label" placeholder="显示文本"></b-input>
                <span v-else>{{scope.row.label}}</span>
              </template>
              <template v-slot:value="scope">
                <b-input v-if="scope.row.edit" clearable size="mini"
                         v-model="conf.bufferValue[scope.index].value" placeholder="显示文本"></b-input>
                <span v-else>{{scope.row.value}}</span>
              </template>
              <template v-slot:action="scope">
                <!--根据状态显示保存或删除编辑按钮-->
                <b-button v-if="scope.row.edit" type="success" size="mini"
                          @click="saveRow(scope.row,scope.index)" transparent>
                  保存
                </b-button>
                <!--根据状态显示保存或删除编辑按钮-->
                <b-button v-else type="primary" size="mini" transparent
                          @click="conf.bufferValue[scope.index].edit = true">
                  编辑
                </b-button>
                <b-button type="danger" size="mini" transparent @click="removeBufferRow(scope.row)">移除</b-button>
              </template>
            </b-table>
            <!--添加按钮-->
            <b-button type="dashed" size="small" icon="ios-add-circle-outline"
                      style="width: 100%;margin-top: 16px;margin-bottom: 18px;"
                      :disabled="bufferValueIsEdit"
                      @click="addBufferRow">添加参数
            </b-button>
          </template>
        </b-form>
        <!--保存提交-->
        <template slot="footer">
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap>
        <div v-if="currentTreeNode && conf">
          <v-key-label label="所属类型" is-half is-first>{{ currentTreeNode.title }}</v-key-label>
          <v-key-label label="参数名称" is-half>{{ conf.confName }}</v-key-label>
          <v-key-label label="参数编码" is-half is-first>{{ conf.confCode }}</v-key-label>
          <v-key-label label="完整编码" is-half>{{ conf.routeCode }}</v-key-label>
          <v-key-label label="取值类型" is-half is-first>{{ valueModeMap[conf.valueMode] }}</v-key-label>
          <v-key-label label="排序编号" is-half>{{ conf.sortNum }}</v-key-label>
          <v-key-label label="参数值" is-half is-first>{{ conf.confValue }}</v-key-label>
          <v-key-label label="取值范围" is-half>{{ conf.valueRange }}</v-key-label>
          <v-key-label label="描述" is-bottom>{{ conf.desc }}</v-key-label>
        </div>
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <!--参数设置弹窗-->
    <b-modal v-model="settingVisible" title="参数设置" :mask-closable="false" width="600">
      <div class="p5">
        <v-simple-label label="参数名称" style="padding: 0;">{{ conf.confName}}</v-simple-label>
        <b-divider dashed style="margin: 10px 0;"></b-divider>
        <v-simple-label label="参数类型" style="padding: 0;">
          <b-tag :type="conf.valueMode|valueModeStyleFilter" size="small">
            {{ valueModeMap[conf.valueMode]}}
          </b-tag>
        </v-simple-label>
        <b-divider dashed style="margin: 10px 0;"></b-divider>
        <v-simple-label v-if="settingVisible" label="参数值" style="padding: 0;">
          <div class="pl-15">
            <param-conf :value-mode="conf.valueMode" :options="conf.bufferValue" v-model="conf.realValue"></param-conf>
          </div>
        </v-simple-label>
        <b-divider dashed style="margin: 10px 0;"></b-divider>
        <v-simple-label label="参数描述" style="padding: 0;">{{ conf.desc}}</v-simple-label>
      </div>
      <div slot="footer" class="t-right">
        <b-button type="primary" v-waves @click="confSave" :loading="btnLoading">保 存</b-button>
        <b-button v-waves @click="settingVisible = false">取 消</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getValueMode } from '../../../api/enum.api'
  import * as api from '../../../api/sys/param-conf.api'
  import ParamConf from '../components/ParamConf'
  import { deepCopy } from '../../../common/utils/assist'
  import { requiredRule } from '../../../common/utils/validate'

  export default {
    name: 'ParamSetting',
    components: { ParamConf },
    mixins: [commonMixin, permission],
    data() {
      const validateConfName = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneConfName(this.conf).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('参数名称重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      const validateConfCode = (rule, value, callback) => {
        if (value.length > 0) {
          api.oneConfCode(this.conf).then(response => {
            if (response.data.data === 0) {
              callback()
            } else {
              callback(new Error('参数编码重复'))
            }
          }).catch(() => {
            callback(new Error('请求验证重复性出错'))
          })
        }
      }
      return {
        moduleName: '参数',
        listQuery: {
          confName: '',
          confCode: '',
          typeId: ''
        },
        treeData: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', slot: 'confName' },
          { title: '参数编码', key: 'confCode' },
          { title: '完整编码', key: 'routeCode' },
          { title: '取值类型', slot: 'valueMode', width: 120, align: 'center' },
          { title: '参数值', key: 'confValue', align: 'center', tooltip: true },
          { title: '操作', slot: 'action', width: 180 }
        ],
        conf: null,
        ruleValidate: {
          confName: [requiredRule, { validator: validateConfName, trigger: 'blur' }],
          confCode: [requiredRule, { validator: validateConfCode, trigger: 'blur' }]
        },
        settingVisible: false,
        checkboxList: [],
        valueModeMap: { '0': '数值', '1': '字符串', '2': '单选', '3': '多选' } // 默认值
      }
    },
    filters: {
      valueModeStyleFilter(value) {
        let map = { '0': 'warning', '1': 'info', '2': 'primary', '3': 'success' }
        return map[value]
      }
    },
    computed: {
      valueModeOptions() {
        let ret = []
        Object.keys(this.valueModeMap).forEach(key => {
          ret.push({ value: key, label: this.valueModeMap[key] })
        })
        return ret
      },
      ENUM() {
        return { NUM: '0', STRING: '1', RADIO: '2', CHECKBOX: '3' }
      },
      bufferValueIsEdit() {
        return this.conf.bufferValue.some(item => item.edit && item.edit === true)
      }
    },
    created() {
      this.getValueModeEnum()
      this.resetConf()
      this.initTree()
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        this.currentTreeNode = node
        this.listQuery.typeId = node.id
        if (this.dialogFormVisible) { // 如果打开了右侧编辑区域则不需要查询，并且需要缓存当前树节点，需要修改父节点id
          this.conf.typeId = node.id
        }
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          confName: '',
          confCode: '',
          typeId: this.currentTreeNode ? this.currentTreeNode.id : ''
        }
        this.handleFilter()
      },
      // 新增按钮事件
      handleCreate() {
        this.resetConf()
        this.openEditPage('create')
      },
      // 编辑事件
      handleModify(row) {
        this.resetConf()
        this.conf = deepCopy({ ...this.conf, ...row })
        this.stringToBuffer()
        this.openEditPage('modify')
      },
      // 设置操作按钮
      handleSet(row) {
        this.resetConf()
        this.conf = deepCopy({ ...this.conf, ...row })
        this.stringToBuffer()
        this.settingVisible = true
      },
      // 保存配置
      confSave() {
        // 如果是字符串模式，则参数值需要同步至内部值
        switch (this.conf.valueMode) {
          case this.ENUM.NUM:
          case this.ENUM.STRING:
            this.conf.confValue = this.conf.realValue
            break
          case this.ENUM.RADIO:
            const choose = this.conf.bufferValue.find(item => item.value === this.conf.realValue)
            this.conf.confValue = choose ? choose.label : ''
            break
          case this.ENUM.CHECKBOX:
            this.conf.confValue = this.conf.bufferValue
              .filter(item => this.conf.realValue.includes(item.value))
              .map(item => item.label).join(',')
            break
        }
        this.btnLoading = true
        api.setConf(this.conf).then(res => {
          if (res.data.code === '0') {
            this.btnLoading = false
            this.settingVisible = false
            this.$message({ type: 'success', content: '操作成功' })
            this.searchList()
          } else {
            this.$message({ type: 'error', content: res.data.message })
          }
        })
      },
      // 弹窗提示是否删除
      handleRemove(row) {
        let conf = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前配置吗？`,
          loading: true,
          onOk: () => {
            api.removeConf(conf).then(res => {
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
      // 查看按钮事件
      handleCheck(row) {
        this.resetConf()
        this.conf = deepCopy({ ...this.conf, ...row })
        this.openEditPage('check')
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 根据bufferValue中的值来填充两个字符串
            if (this.conf.valueMode === this.ENUM.RADIO || this.conf.valueMode === this.ENUM.CHECKBOX) {
              if (this.bufferValueIsEdit) {
                this.$message({ type: 'danger', content: '请将选项填写完整并保存后再提交！' })
                return
              }
              this.bufferToString() // 转换缓存数组
            }
            this.conf.realValue = this.conf.confValue = ''// 无论新增还是修改，都需要清空两个值
            this.btnLoading = true
            let fun = this.dialogStatus === 'create' ? api.createConf : api.modifyConf
            fun(this.conf).then(res => {
              if (res.data.code === '0') {
                this.submitDone(true)
                this.handleFilter()
              } else {
                this.submitDone(false)
                this.$message({ type: 'error', content: res.data.message })
              }
            })
          } else {
            this.$message({ type: 'error', content: '表单校验失败!' })
          }
        })
      },
      // 添加一行选项
      addBufferRow() {
        this.conf.bufferValue.push({ label: '', value: '', edit: true })
      },
      // 保存一行
      saveRow(item, index) {
        if (item.label.length === 0 || item.value.length === 0) {
          this.$message({ content: '显示文本和值必填', type: 'danger' })
          return
        }
        this.conf.bufferValue[index].edit = false
      },
      // 删除一行
      removeBufferRow(item) {
        let index = this.conf.bufferValue.indexOf(item)
        this.conf.bufferValue.splice(index, 1)
      },
      // 检查bufferValue中的值是否有编辑状态值
      checkBufferValueNotEmpty() {
        return this.conf.bufferValue.every(item => item.label.length > 0 && item.value.length > 0)
      },
      // 缓存数组转换成对应字段
      bufferToString() {
        let valueRangeArr = []
        let realValueRangeArr = []
        this.conf.bufferValue.forEach(item => {
          if (item.label.length > 0 && item.value.length > 0) {
            valueRangeArr.push(item.label)
            realValueRangeArr.push(item.value)
          }
        })
        this.conf.valueRange = valueRangeArr.join(',')
        this.conf.realValueRange = realValueRangeArr.join(',')
      },
      // 编辑时将两个字符串内容拼接至显示数组
      stringToBuffer() {
        // 如果没有值则不需要拆分
        if (this.conf.valueRange.length === 0 && this.conf.realValueRange.length === 0) {
          this.conf.bufferValue = [] // 初始化空数组
          return
        }
        let valueRangeArr = this.conf.valueRange.split(',')
        let realValueRangeArr = this.conf.realValueRange.split(',')
        // 需要判断两个数组值是否是一致的,如一致则拷贝至缓存数组进行编辑，不一致则下次保存时会覆盖新的缓存数组
        if (valueRangeArr.length === realValueRangeArr.length) {
          this.conf.bufferValue = [] // 初始化空数组
          for (let i = 0; i < valueRangeArr.length; i++) {
            this.conf.bufferValue.push({
              label: valueRangeArr[i],
              value: realValueRangeArr[i],
              edit: false
            })
          }
        }
      },
      /* [数据接口] */
      // 通用枚举
      getValueModeEnum() {
        getValueMode().then(res => {
          if (res.status === 200) {
            this.valueModeMap = res.data.data
          }
        })
      },
      // 重置对象
      resetConf() {
        this.conf = {
          id: '',
          typeId: this.currentTreeNode ? this.currentTreeNode.id : '',
          confName: '',
          confCode: '',
          confValue: '', // 参数值，即参数值，存储显示值，字符串时需要同步显示值和实际值
          realValue: '', // 内部值,及实际存储数据库中的值，字符串模式时需要同步至实际值
          valueMode: this.ENUM.STRING, // { '0': '数字','1': '字符串', '2': '内部单选', '3': '内部多选' }
          valueRange: '', // 取值范围，及显示值
          realValueRange: '', // 内部值，及value实际值
          sortNum: 0,
          desc: '',
          // 缓存数组，用于添加编辑取值范围和显示值
          // 在修改时，需要手动根据valueRange和realValueRange手动分隔数组至这两个缓存中用于修改
          // 设置时，也需要根据这两个数组和valueMode来动态生成单选框和复选框组
          bufferValue: [{ label: '', value: '', edit: true }]
        }
      },
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构 这里这拉取conf ，参数设置下的类型树
        api.getTypeTree('conf').then(response => {
          const tree = response.data.data || []
          let mapper = node => {
            return {
              id: node.id,
              title: node.text,
              children: (node.children && node.children.map(mapper)) || []
            }
          }
          let data = tree[0] ? mapper(tree[0]) : []
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            this.currentTreeNode = this.treeData[0]
            this.listQuery.typeId = this.currentTreeNode.id
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
            this.searchList()
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getConfList(this.listQuery).then(response => {
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
