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
      dataType: 'string',
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
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  }
]
