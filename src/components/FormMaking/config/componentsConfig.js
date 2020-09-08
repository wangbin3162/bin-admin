/**
 * 基础的表单控件
 * @type {*[]}
 */
export const basicComponents = [
  {
    type: 'input',
    name: '单行文本',
    icon: 'ios-create',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'textarea',
    name: '多行文本',
    icon: 'ios-paper',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      disabled: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'number',
    name: '计数器',
    icon: 'ios-calculator',
    options: {
      width: '',
      required: false,
      defaultValue: null,
      min: Infinity,
      max: Infinity,
      step: 1,
      precision: null,
      disabled: false
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    icon: 'ios-radio-button-on',
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
      buttonModel: true, // 按钮模式
      size: 'small', // 按钮模式专属大小
      active: 'primary' // 按钮模式选中颜色
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    icon: 'ios-checkbox-outline',
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
    options: {
      defaultValue: '00:00:00',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: '200px'
    }
  },
  {
    type: 'date',
    name: '日期选择器',
    icon: 'ios-calendar',
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
    options: {
      defaultValue: false,
      required: false,
      disabled: false,
      size: 'default',
      trueValue: true,
      falseValue: false,
      activeColor: null,
      inactiveColor: null,
      openText: '',
      closeText: ''
    }
  },
  {
    type: 'color',
    name: '颜色选择器',
    icon: 'ios-color-palette',
    options: {
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false,
      recommend: false
    }
  },
  {
    type: 'rate',
    name: '评分',
    icon: 'favor',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
      showText: false,
      texts: ['极差', '失望', '一般', '满意', '惊喜'],
      showScore: false,
      scoreTemplate: '{value}'
    }
  },
  {
    type: 'slider',
    name: '滑块',
    icon: 'ios-options',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
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
      gutter: 4,
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
      fontSize: '14px',
      margin: '12px 0'
    }
  }
]
