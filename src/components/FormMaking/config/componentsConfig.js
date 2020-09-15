/**
 * 基础的表单控件
 * @type {*[]}
 */
export const basicComponents = [
  {
    type: 'input',
    name: '单行文本',
    icon: 'ios-create',
    length: 64,
    precision: 0,
    dataType: 'string',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      placeholder: '',
      disabled: false,
      length: null,
      showWordCount: false,
      clearable: false
    }
  },
  {
    type: 'textarea',
    name: '多行文本',
    icon: 'ios-paper',
    length: 200,
    precision: 0,
    dataType: 'text',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      disabled: false,
      placeholder: '',
      length: null,
      showWordCount: false
    }
  },
  {
    type: 'number',
    name: '计数器',
    icon: 'ios-calculator',
    length: 24,
    precision: 0,
    dataType: 'number',
    options: {
      width: '',
      required: false,
      defaultValue: null,
      min: -Infinity,
      max: Infinity,
      step: 1,
      precision: 0,
      disabled: false
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    icon: 'ios-radio-button-on',
    length: 20,
    precision: 0,
    dataType: 'string',
    options: {
      inline: true,
      defaultValue: '',
      options: [
        {
          value: 'Option 1',
          label: '选项一'
        },
        {
          value: 'Option 2',
          label: '选项二'
        },
        {
          value: 'Option 3',
          label: '选项三'
        }
      ],
      required: false,
      width: '',
      disabled: false,
      buttonModel: false // 按钮模式
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    icon: 'ios-checkbox-outline',
    length: 20,
    precision: 0,
    dataType: 'string',
    options: {
      inline: true,
      defaultValue: [],
      options: [
        {
          value: 'Option 1',
          label: '选项一'
        },
        {
          value: 'Option 2',
          label: '选项二'
        },
        {
          value: 'Option 3',
          label: '选项三'
        }
      ],
      required: false,
      width: '',
      disabled: false
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    icon: 'ios-arrow-dropdown',
    length: 20,
    precision: 0,
    dataType: 'string',
    options: {
      defaultValue: '',
      multiple: false,
      maxTagCount: null,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      width: '200px',
      options: [
        {
          value: 'Option 1',
          label: '选项一'
        },
        {
          value: 'Option 2',
          label: '选项二'
        },
        {
          value: 'Option 3',
          label: '选项三'
        }
      ],
      filterable: false
    }
  },
  {
    type: 'time',
    icon: 'ios-timer',
    name: '时间选择器',
    length: 20,
    precision: 0,
    dataType: 'string',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      isRange: false,
      format: 'HH:mm:ss',
      required: false,
      width: '200px'
    }
  },
  {
    type: 'date',
    name: '日期选择器',
    icon: 'ios-calendar',
    length: 20,
    precision: 0,
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      required: false,
      width: '200px'
    }
  },
  {
    type: 'switch',
    name: '开关',
    icon: 'ios-switch',
    length: 4,
    precision: 0,
    dataType: 'bool',
    options: {
      defaultValue: false,
      required: false,
      disabled: false,
      size: 'default',
      openText: '',
      closeText: ''
    }
  },
  {
    type: 'color',
    name: '颜色选择器',
    icon: 'ios-color-palette',
    length: 64,
    precision: 0,
    dataType: 'string',
    options: {
      defaultValue: '',
      disabled: false,
      alpha: false,
      required: false,
      recommend: false
    }
  },
  {
    type: 'rate',
    name: '评分',
    icon: 'favor',
    length: 24,
    precision: 0,
    dataType: 'number',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
      showScore: false
    }
  },
  {
    type: 'slider',
    name: '滑块',
    icon: 'ios-options',
    length: 64,
    precision: 0,
    dataType: 'number',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      width: ''
    }
  }
]

/**
 * 布局控件
 * @type {*[]}
 */
export const layoutComponents = [
  {
    type: 'grid',
    name: '栅格布局',
    icon: 'ios-grid',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 8,
      justify: 'start',
      align: 'top'
    }
  },
  {
    type: 'divider',
    name: '分割线',
    icon: 'ios-remove',
    options: {
      align: 'left',
      margin: '24px 0',
      dashed: false
    }
  }
]
