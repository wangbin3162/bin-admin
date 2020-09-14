<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="表单据名称" :span="8">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable/>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"/>
        </v-filter-bar>
        <!--操作栏-->
        <v-table-tool-bar>
          <b-button type="primary"
                    icon="ios-add-circle-outline"
                    @click="handleCreate">新 增
          </b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">编辑</b-button>
            <!--是否有删除键-->
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
            </template>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange"
                @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <fm-container ref="fmContainer" @on-save="handleSave"></fm-container>
  </div>
</template>

<script>
import commonMixin from '../../../common/mixins/mixin'
import FmContainer from '@/components/FormMaking/Container'

export default {
  name: 'TableDemo',
  components: { FmContainer },
  mixins: [commonMixin],
  data() {
    return {
      listQuery: {
        name: ''
      },
      columns: [
        { title: '表单据名称', key: 'name' },
        { title: '表名', key: 'tableName' },
        { title: '创建日期', key: 'createDate' },
        { title: '操作', slot: 'action', width: 140 }
      ]
    }
  },
  created() {
    this.resetFormTable()
    this.searchList()
  },
  methods: {
    // filter-Bar:重置查询条件
    resetQuery() {
      this.listQuery = {
        page: 1,
        size: 10,
        name: ''
      }
    },
    // 新增按钮事件
    handleCreate() {
      this.resetFormTable()
      this.$refs.fmContainer.open(this.widgetForm)
    },
    // 编辑事件
    handleModify(row) {
      let testData = {
        'list': [
          {
            'type': 'input',
            'name': '姓名',
            'icon': 'ios-create',
            'options': {
              'width': '100%',
              'defaultValue': '',
              'required': true,
              'placeholder': '',
              'disabled': false,
              'length': null,
              'showWordCount': false,
              'clearable': false
            },
            'key': '1599806302000_30782',
            'model': 'name',
            'rules': [
              {
                'name': '$required',
                'message': '姓名必填',
                'type': 'string',
                'trigger': 'blur'
              }
            ]
          },
          {
            'type': 'grid',
            'name': '栅格布局',
            'icon': 'ios-grid',
            'columns': [
              {
                'span': 12,
                'list': [
                  {
                    'type': 'select',
                    'name': '学历',
                    'icon': 'ios-arrow-dropdown',
                    'options': {
                      'defaultValue': '',
                      'multiple': false,
                      'maxTagCount': null,
                      'disabled': false,
                      'clearable': false,
                      'placeholder': '',
                      'required': true,
                      'width': '100%',
                      'options': [
                        {
                          'value': 'Option 1',
                          'label': '大专'
                        },
                        {
                          'value': 'Option 2',
                          'label': '二本'
                        },
                        {
                          'value': 'Option 3',
                          'label': '一本'
                        }
                      ],
                      'filterable': false
                    },
                    'key': '1599811766000_36358',
                    'model': 'xueli',
                    'rules': [
                      {
                        'name': '$required',
                        'message': '学历必填',
                        'type': 'string',
                        'trigger': 'change'
                      }
                    ]
                  }
                ]
              },
              {
                'span': 12,
                'list': [
                  {
                    'type': 'radio',
                    'name': '性别',
                    'icon': 'ios-radio-button-on',
                    'options': {
                      'inline': true,
                      'defaultValue': 'Option 1',
                      'options': [
                        {
                          'value': 'Option 1',
                          'label': '男'
                        },
                        {
                          'value': 'Option 2',
                          'label': '女'
                        }
                      ],
                      'required': true,
                      'width': '',
                      'disabled': false,
                      'buttonModel': false,
                      'size': 'small',
                      'active': 'primary'
                    },
                    'key': '1599806308000_26926',
                    'model': 'sex',
                    'rules': [
                      {
                        'name': '$required',
                        'message': '性别必填',
                        'type': 'string',
                        'trigger': 'change'
                      }
                    ]
                  }
                ]
              }
            ],
            'options': {
              'gutter': 8,
              'justify': 'start',
              'align': 'top'
            },
            'key': '1599806304000_26845',
            'model': 'grid_1599806304201',
            'rules': []
          },
          {
            'type': 'input',
            'name': '手机号',
            'icon': 'ios-create',
            'options': {
              'width': '100%',
              'defaultValue': '',
              'required': true,
              'placeholder': '',
              'disabled': false,
              'length': null,
              'showWordCount': false,
              'clearable': false
            },
            'key': '1599811834000_13998',
            'model': 'phone',
            'rules': [
              {
                'name': '$required',
                'message': '手机号必填',
                'type': 'string',
                'trigger': 'blur'
              },
              {
                'name': '$phone',
                'message': '手机号格式不正确',
                'type': 'string',
                'trigger': 'blur'
              }
            ]
          },
          {
            'type': 'textarea',
            'name': '地址',
            'icon': 'ios-paper',
            'options': {
              'width': '100%',
              'defaultValue': '',
              'required': false,
              'disabled': false,
              'placeholder': '',
              'length': null,
              'showWordCount': true
            },
            'key': '1599806625000_2700',
            'model': 'address',
            'rules': [
              {
                'name': '$length',
                'min': 0,
                'max': 100,
                'message': '长度必须在指定的范围内',
                'type': 'string',
                'trigger': 'blur'
              }
            ]
          }
        ],
        'config': {
          'name': '表单名称',
          'labelWidth': 100,
          'labelPosition': 'right',
          'size': 'default'
        }
      }
      let testData2 = {
        'list': [
          {
            'type': 'input',
            'name': '单行文本',
            'icon': 'ios-create',
            'options': {
              'width': '100%',
              'defaultValue': '',
              'required': false,
              'placeholder': '',
              'disabled': false,
              'length': null,
              'showWordCount': false,
              'clearable': false
            },
            'key': '1599815428000_33294',
            'model': 'input_1599815428706',
            'rules': []
          },
          {
            'type': 'textarea',
            'name': '多行文本',
            'icon': 'ios-paper',
            'options': {
              'width': '100%',
              'defaultValue': '',
              'required': false,
              'disabled': false,
              'placeholder': '',
              'length': null,
              'showWordCount': false
            },
            'key': '1599815429000_57463',
            'model': 'textarea_1599815429160',
            'rules': []
          },
          {
            'type': 'divider',
            'name': '分割线',
            'icon': 'ios-remove',
            'options': {
              'align': 'left',
              'fontSize': '14px',
              'margin': '12px 0'
            },
            'key': '1599815440000_15518',
            'model': 'divider_1599815440709',
            'rules': []
          },
          {
            'type': 'radio',
            'name': '单选框组',
            'icon': 'ios-radio-button-on',
            'options': {
              'inline': true,
              'defaultValue': '',
              'options': [
                {
                  'value': 'Option 1',
                  'label': '选项一'
                },
                {
                  'value': 'Option 2',
                  'label': '选项二'
                },
                {
                  'value': 'Option 3',
                  'label': '选项三'
                }
              ],
              'required': false,
              'width': '',
              'disabled': false,
              'buttonModel': false,
              'size': 'small',
              'active': 'primary'
            },
            'key': '1599815430000_22395',
            'model': 'radio_1599815430037',
            'rules': []
          },
          {
            'type': 'grid',
            'name': '栅格布局',
            'icon': 'ios-grid',
            'columns': [
              {
                'span': 6,
                'list': [
                  {
                    'type': 'switch',
                    'name': '开关',
                    'icon': 'ios-switch',
                    'options': {
                      'defaultValue': false,
                      'required': false,
                      'disabled': false,
                      'size': 'default',
                      'openText': '',
                      'closeText': ''
                    },
                    'key': '1599815463000_21586',
                    'model': 'switch_1599815463762',
                    'rules': []
                  }
                ]
              },
              {
                'span': 6,
                'list': [
                  {
                    'type': 'color',
                    'name': '颜色选择器',
                    'icon': 'ios-color-palette',
                    'options': {
                      'defaultValue': '',
                      'disabled': false,
                      'alpha': false,
                      'required': false,
                      'recommend': false
                    },
                    'key': '1599815467000_26060',
                    'model': 'color_1599815467590',
                    'rules': []
                  }
                ]
              },
              {
                'span': 6,
                'list': [
                  {
                    'type': 'rate',
                    'name': '评分',
                    'icon': 'favor',
                    'options': {
                      'defaultValue': 0,
                      'max': 5,
                      'disabled': false,
                      'allowHalf': false,
                      'required': false,
                      'showScore': false
                    },
                    'key': '1599815472000_6539',
                    'model': 'rate_1599815472902',
                    'rules': []
                  }
                ]
              },
              {
                'span': 6,
                'list': [
                  {
                    'type': 'number',
                    'name': '计数器',
                    'icon': 'ios-calculator',
                    'options': {
                      'width': '',
                      'required': false,
                      'defaultValue': null,
                      'min': null,
                      'max': null,
                      'step': 1,
                      'precision': null,
                      'disabled': false
                    },
                    'key': '1599815480000_62225',
                    'model': 'number_1599815480512',
                    'rules': []
                  }
                ]
              }
            ],
            'options': {
              'gutter': 8,
              'justify': 'start',
              'align': 'top'
            },
            'key': '1599815441000_24603',
            'model': 'grid_1599815441405',
            'rules': []
          },
          {
            'type': 'checkbox',
            'name': '多选框组',
            'icon': 'ios-checkbox-outline',
            'options': {
              'inline': true,
              'defaultValue': [],
              'options': [
                {
                  'value': 'Option 1',
                  'label': '选项一'
                },
                {
                  'value': 'Option 2',
                  'label': '选项二'
                },
                {
                  'value': 'Option 3',
                  'label': '选项三'
                }
              ],
              'required': false,
              'width': '',
              'disabled': false
            },
            'key': '1599815430000_95806',
            'model': 'checkbox_1599815430557',
            'rules': []
          },
          {
            'type': 'select',
            'name': '下拉选择框',
            'icon': 'ios-arrow-dropdown',
            'options': {
              'defaultValue': '',
              'multiple': false,
              'maxTagCount': null,
              'disabled': false,
              'clearable': false,
              'placeholder': '',
              'required': false,
              'width': '200px',
              'options': [
                {
                  'value': 'Option 1',
                  'label': '选项一'
                },
                {
                  'value': 'Option 2',
                  'label': '选项二'
                },
                {
                  'value': 'Option 3',
                  'label': '选项三'
                }
              ],
              'filterable': false
            },
            'key': '1599815430000_95977',
            'model': 'select_1599815430899',
            'rules': []
          },
          {
            'type': 'time',
            'icon': 'ios-timer',
            'name': '时间选择器',
            'options': {
              'defaultValue': '',
              'readonly': false,
              'disabled': false,
              'editable': true,
              'clearable': true,
              'placeholder': '',
              'isRange': false,
              'format': 'HH:mm:ss',
              'required': false,
              'width': '200px'
            },
            'key': '1599815431000_31535',
            'model': 'time_1599815431367',
            'rules': []
          },
          {
            'type': 'date',
            'name': '日期选择器',
            'icon': 'ios-calendar',
            'options': {
              'defaultValue': '',
              'readonly': false,
              'disabled': false,
              'editable': true,
              'clearable': true,
              'placeholder': '',
              'type': 'date',
              'format': 'yyyy-MM-dd',
              'required': false,
              'width': '200px'
            },
            'key': '1599815431000_46737',
            'model': 'date_1599815431699',
            'rules': []
          },
          {
            'type': 'slider',
            'name': '滑块',
            'icon': 'ios-options',
            'options': {
              'defaultValue': 0,
              'disabled': false,
              'required': false,
              'min': 0,
              'max': 100,
              'step': 1,
              'showInput': false,
              'width': ''
            },
            'key': '1599815433000_52335',
            'model': 'slider_1599815433410',
            'rules': []
          }
        ],
        'config': {
          'name': '表单名称',
          'labelWidth': 100,
          'labelPosition': 'right',
          'size': 'default'
        }
      }
      if (row.id === 0) {
        this.$refs.fmContainer.open(testData)
      } else {
        this.$refs.fmContainer.open(testData2)
      }
    },
    // 查看按钮事件
    handleCheck(row) {
      // this.openEditPage('check')
    },
    // 弹窗提示是否删除
    handleRemove(row) {
      this.$notice.success({ title: '删除成功' })
    },
    // 保存表单
    handleSave(widgetForm) {
      console.log(widgetForm)
      this.$log.success('-------保存成功--------')
    },
    /* [数据接口] */
    // 重置栏目对象
    resetFormTable() {
      this.widgetForm = {
        list: [],
        config: {
          name: '表单名称',
          labelWidth: 100,
          labelPosition: 'right',
          size: 'default'
        }
      }
    },
    // 查询所有部门列表
    searchList() {
      // 模拟获取列表数据
      this.setListData({
        list: [
          { id: 0, name: '测试表单据', tableName: 'TABLE_TEST', createDate: '2020-09-11' },
          { id: 1, name: '全控件测试', tableName: 'TABLE_TEST2', createDate: '2020-09-11' }
        ],
        total: 2
      })
    }
  }
}
</script>
