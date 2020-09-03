<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" @on-select-change="handTreeCurrentChange"></b-tree>
        <!--查询条件-->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="资源名称">
            <b-input v-model.trim="listQuery.resourceName" placeholder="资源名称(中文名)" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="已配置" :span="3">
            <b-switch v-model="listQuery.hasConfig" @on-change="handleFilter"></b-switch>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template #personClass="{row}">{{ personClassMap[row.personClass] }}</template>
          <template #resProperty="{row}">{{ resPropertyMap[row.resProperty] }}</template>
          <template #resourceName="{row}">
            <b-button type="text" @click="handleCheck(row)" t-ellipsis
                      :title="row.resourceName">{{ row.resourceName }}
            </b-button>
          </template>
          <!--操作栏-->
          <template #action="{row}">
            <b-tooltip content="条件配置" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-filing"
                        :disabled="!havePermission('conditionConfig')"
                        :icon-style="{fontSize:'20px'}" @click="handleConditionConfig(row)"/>
            </b-tooltip>&nbsp;
            <b-tooltip content="配置分析" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-analytics"
                        :disabled="!havePermission('configAnalysis')"
                        :icon-style="{fontSize:'20px'}" @click="handleCfgAnalyze(row)"/>
            </b-tooltip>&nbsp;
            <b-tooltip content="预览" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button text-color="success" type="text" icon="ios-eye"
                        :disabled="!havePermission('preview')"
                        :icon-style="{fontSize:'20px'}" @click="handlePreview(row)"/>
            </b-tooltip>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <v-key-label label="资源名称" is-half is-first>{{ resource.resourceName }}</v-key-label>
          <v-key-label label="所属类目" is-half>{{ resource.dirClassifyName }}</v-key-label>
          <v-key-label label="资源代码">{{ resource.resourceCode }}</v-key-label>
          <v-key-label label="资源摘要">{{ resource.resourceDesc }}</v-key-label>
          <v-key-label label="主体类别" is-half is-first>{{ personClassMap[resource.personClass] }}
          </v-key-label>
          <v-key-label label="共享属性" is-half>{{ shareMap[resource.sharedType] }}</v-key-label>
          <v-key-label label="共享条件" is-half is-first>{{ resource.shareCondition }}</v-key-label>
          <v-key-label label="共享方式" is-half>{{ resource.shareMode }}</v-key-label>
          <v-key-label label="开放属性" is-half is-first>{{ openMap[resource.isOpen] }}</v-key-label>
          <v-key-label label="开放条件" is-half>{{ resource.openCondition }}</v-key-label>
          <v-key-label label="资源性质" is-half is-first>{{ resPropertyMap[resource.resProperty] }}
          </v-key-label>
          <v-key-label label="更新周期" is-half>{{ updateMap[resource.updatePeriod] }}</v-key-label>
          <v-key-label label="有效期限" is-bottom>{{ resource.expiryLimit }} (月)</v-key-label>
        </b-collapse-wrap>
        <b-collapse-wrap title="信息项" collapse>
          <b-table disabled-hover :data="resource.items" :columns="checkItemsTableColumns" size="small">
            <template v-slot:dataType="{row}">{{ dataTypeMap[row.dataType] }}</template>
            <template v-slot:tokenizer="{row}">{{ tokenizerMap[row.tokenizer] }}</template>
          </b-table>
        </b-collapse-wrap>
        <template slot="footer">
          <b-button @click="handleCancel">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
    <condition-config ref="conditionConfig" @on-close="handleCancel"/>
    <charts-config-panel ref="cfgPanel" @on-save="handleSave"/>
    <!--预览窗口-->
    <preview-modal ref="preview"/>
  </div>
</template>

<script>
import commonMixin from '@/common/mixins/mixin'
import permission from '@/common/mixins/permission'
import { deepCopy } from '@/common/utils/assist'
import { getFieldCtrl } from '@/api/enum.api'
import * as api from '@/api/excavate-analyze/excavate-cfg.api'
import ChartsConfigPanel from '@/components/ChartsConfig/ChartConfigPanel'
import { basicComponents } from '@/components/ChartsConfig/utils/util'
import PreviewModal from './PreviewModal'
import ConditionConfig from './ConditionConfig'
import { getResDetail } from '@/api/data-manage/res-info.api'

export default {
  name: 'ExcavateCfg',
  components: { PreviewModal, ChartsConfigPanel, ConditionConfig },
  mixins: [commonMixin, permission],
  data() {
    return {
      shareMap: { PUBLIC: '共享', PRIVATE: '不共享', DEPART_RANGE: '有条件共享' }, // 共享属性 #static
      openMap: { '1': '是', '0': '否' }, // 开放属性#static
      updateMap: {
        '0_IN_TIME_M': '实时',
        '1_IN_DAY_M': '每天',
        '2_IN_WEEK_M': '每周',
        '3_IN_MONTH_M': '每月',
        '4_IN_QUARTER_Q': '每季',
        '5_IN_YEAR_Y': '每年'
      }, // 更新周期#static
      dataTypeMap: {
        string: '字符型',
        number: '数值型',
        money: '货币型',
        boolean: '逻辑型',
        date: '日期型',
        datetime: '日期时间型',
        text: '备注型'
      },
      tokenizerMap: {
        'N': '否',
        'Y': '是'
      },
      moduleName: '资源信息',
      listQuery: {
        resourceCode: '', // 所属分类
        resourceName: '', // 资源名称(中文名)
        hasConfig: false // 已配置
      },
      treeData: [],
      columns: [
        { title: '资源名称', slot: 'resourceName' },
        { title: '主体类别', slot: 'personClass' },
        { title: '资源性质', slot: 'resProperty', width: 150, align: 'center' },
        { title: '数据来源', key: 'source', width: 150, align: 'center' },
        { title: '操作', slot: 'action', width: 150 }
      ],
      resource: null,
      checkItemsTableColumns: [
        { title: '名称', key: 'fieldName' },
        { title: '标题', key: 'fieldTitle' },
        { title: '数据类型', slot: 'dataType' },
        { title: '是否分词', slot: 'tokenizer' }
      ],
      fieldCtrlMap: {}, // 字段控件类型
      resPropertyMap: {}, // 资源性质映射
      resPropertyOptions: [],
      personClassMap: {}, // 主体类别映射
      personClassOptions: [],
      cfgInfo: {}
    }
  },
  created() {
    this.getEnum()
    this.initTree()
    this.resetResource()
  },
  watch: {
    cfgInfo: {
      handler(val) {
        this.$log.primary('=========cfgInfo 原始值=========')
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    /* [事件响应] */
    handTreeCurrentChange(data, node) {
      if (this.currentTreeNode.id === node.id) {
        node.selected = true
      }
      this.currentTreeNode = node
      this.listQuery.resourceCode = node.code
      this.handleFilter()
    },
    // filter-Bar:重置查询条件
    resetQuery() {
      this.listQuery = {
        page: 1,
        size: 10,
        resourceCode: this.currentTreeNode ? this.currentTreeNode.code : '', // 类目类别所属分类
        resourceName: '', // 资源名称(中文名)
        hasConfig: false // 已配置
      }
      this.handleFilter()
    },
    // 查看按钮事件
    handleCheck(row) {
      getResDetail(row.id).then(res => {
        this.resource = res.data.data
        this.resource.items = this.resource.items.filter(item => item.status === 'use')
        this.openEditPage('check')
      })
    },
    // 条件配置列表
    handleConditionConfig(row) {
      this.dialogStatus = 'conditionConfig'
      this.$refs.conditionConfig.open(row.resourceKey, row.resourceName)
    },
    // 配置分析
    handleCfgAnalyze(row) {
      this.resource = deepCopy(row)
      // 查询已有的配置列表
      api.chartsCfgShow(row.resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let list = resp.data.data.map(item => {
            let base = this.getChartBaseInfo(item.chartType)
            base.key = item.id
            base.isOpen = item.isOpen
            base.dataSource = item.dataSource
            base.dataSourceName = item.dataSourceName || item.dataSource
            try {
              base.options = JSON.parse(item.chartConfigExt)
              base.dataSourceParam = JSON.parse(item.dataSourceParam)
              base.staticDataSource = JSON.parse(item.staticDataSource)
            } catch (e) {
            }
            return base
          })
          this.$refs.cfgPanel.open(this.resource, list)
        }
      })
    },
    // 配置分析保存
    handleSave(list) {
      this.$log.success('====响应保存事件====>')
      let data = list.map(item => {
        return {
          resourceKey: this.resource.resourceKey,
          resourceName: this.resource.resourceName,
          chartTitle: item.options.title,
          chartUnit: '',
          chartType: item.type,
          configType: '',
          chartConfigExt: JSON.stringify(item.options),
          isOpen: item.isOpen,
          staticDataSource: JSON.stringify(item.staticDataSource),
          dataSource: item.dataSource,
          dataSourceParam: JSON.stringify(item.dataSourceParam)
        }
      })
      api.chartsCfgAddOrModify(this.resource.resourceKey, data).then(resp => {
        if (resp.data.code === '0') {
          this.$notice.success({ title: '保存配置成功！' })
        } else {
          this.$notice.danger({ title: '保存配置失败！', desc: resp.data.message || '保存失败，请重新配置或检查服务！' })
        }
      })
    },
    // 预览页面
    handlePreview(row) {
      this.resource = deepCopy(row)
      this.$refs.preview.open(this.resource)
    },
    // 获取一个类型的基础配置项
    getChartBaseInfo(type) {
      return deepCopy(basicComponents.find(i => i.type === type))
    },
    /* [数据接口] */
    // 通用枚举
    getEnum() {
      // 资源信息项控件类型枚举
      getFieldCtrl().then(res => {
        this.fieldCtrlMap = res.data.data || {}
      })
      // 主体类别树信息 code=A
      api.getPersonClassTree().then(res => {
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
      })
      // 资源性质树信息 code=B
      api.getResPropertyTree().then(res => {
        // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
        let tree = res.data.data
        let temp = []
        let mapper = (node, parentCode) => {
          temp.push({ key: node.code, value: node.text })
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
        this.resPropertyOptions = data.children || []
        // 转换类型映射值（扁平化）
        temp.forEach(item => {
          this.resPropertyMap[item.key] = item.value
        })
      })
    },
    // 重置对象
    resetResource() {
      this.resource = {
        id: '',
        tableName: '', // 元信息表名字
        personClass: '', // 主体类别
        metadataCode: '', // 类目编码 => 这条属性只负责显示当前类目，和拼接资源代码使用，并不会保存
        metadataKey: '', // 资源标识符
        resourceName: '', // 资源名称
        resourceCode: '', // 资源代码
        resourceDesc: '', // 资源描述
        resourceKey: '',
        updatePeriod: '0_IN_TIME_M', // 更新周期
        expiryLimit: 24, // 有效期限
        resProperty: 'B03', // 资源性质
        sharedType: 'PUBLIC', // 共享属性
        shareCondition: '', // 共享条件
        shareMode: '', // 共享方式
        isOpen: '0', // 开放属性
        openCondition: '', // 开放条件
        availableStatus: '',
        status: '',
        dirClassifyName: '',
        items: [],
        idsFlag: 0
      }
    },
    // tree:初始化树结构
    initTree() {
      this.treeData = []
      // 请求响应返回树结构
      api.getTypeTree().then(response => {
        const tree = response.data.data
        // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
        let data = tree ? this.treeMapper(tree, null, ['code']) : {}
        this.treeData.push(data)
        if (this.treeData.length > 0) {
          // 如果没有当前选中节点则初始化为第一个选中
          if (!this.currentTreeNode) {
            this.currentTreeNode = this.treeData[0]
            // 这里要注意，扩展响应式属性需要这么写
            this.$set(this.treeData[0], 'selected', true)
            this.$set(this.treeData[0], 'expand', true)
          }
          this.listQuery.resourceCode = this.currentTreeNode.code
          this.handleFilter()
        }
      })
    },
    // 查询所有列表
    searchList() {
      this.setListData()
      api.getResInfoList(this.listQuery).then(response => {
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
