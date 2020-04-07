<template>
  <div>
    <page-header-wrap>
      <v-table-wrap>
        <v-title-bar label="信息项配置" class="mb-20">
          <div>
            <b-button type="text" @click="openJsonModal">
              <b-icon name="ios-cloud-upload"/>&nbsp;导入json
            </b-button>
            <b-button type="text" @click="loadFields">
              <b-icon name="ios-cloud-download"/>&nbsp;导入默认
            </b-button>
            <b-button type="text" @click="fields = []">
              <b-icon name="ios-trash"/>&nbsp;清空
            </b-button>
            <b-button type="text" @click="previewForm">
              <b-icon name="ios-eye"/>&nbsp;预览
            </b-button>&nbsp;&nbsp;
            Debug：
            <b-switch v-model="debugJson" size="small"/>
          </div>
        </v-title-bar>
        <fields-cfg v-model="fields"/>
        <!--调试模式-->
        <div class="mt-15" v-show="debugJson">
          <b-tag type="success" size="small">实际存储对象[fields]</b-tag>
          <b-code-editor :value="JSON.stringify(fields,null,2)" readonly/>
        </div>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="jsonModal" title="导入Json" :z-index="50" width="750px" append-to-body
             @on-opened="$refs.editor.refresh()" @on-ok="importJson">
      <b-code-editor ref="editor" v-model="jsonStr"/>
    </b-modal>
    <b-modal v-model="previewModal" title="预览表单" width="950px" append-to-body :styles="{top: '20px'}">
      <b-form v-if="previewModal" :model="form" :rules="rules" ref="form" label-position="top">
        <!--自定义form-item-->
        <form-item :key="item.id||index" v-for="(item,index) in dynamicForm"
                   :label="item.fieldTitle"
                   :prop="item.fieldName"
                   :control-type="item.controlType">
          <!--动态控件-->
          <form-control v-model="form[item.fieldName]"
                        :control-type="item.controlType"
                        :field-name="item.fieldName"
                        :field-desc="item.fieldDesc"
                        :field-title="item.fieldTitle"
                        :options="item.validOptions">
          </form-control>
        </form-item>
      </b-form>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit">提 交</b-button>
        <b-button @click="handleReset">重 置</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import FieldsCfg from '../../../components/Validator/FieldsCfg/FieldsCfg'
  import metadata from './metadata'
  import items from './items'
  import { checkRulesToFormRules, initFormList } from '../../../components/Validator/FieldsCfg/cfg-util'
  import FormItem from '../../../components/Validator/FormControl/FormItem'
  import FormControl from '../../../components/Validator/FormControl/FormControl'

  export default {
    name: 'FormDemo',
    components: { FormControl, FormItem, FieldsCfg },
    data() {
      return {
        debugJson: true,
        jsonModal: false,
        previewModal: false,
        jsonStr: '',
        fields: [], // 实际信息项,
        dynamicForm: [], // 动态form，用于遍历form表单使用
        form: {},
        rules: {}
      }
    },
    methods: {
      // 获取元信息
      getMetadata() {
        return metadata.map(item => {
          let rulesInit = {
            $required: {
              required: true,
              message: `${item.fieldTitle}必填`,
              trigger: item.dataType === 'number' ? 'blur' : 'change'
            }
          }
          return {
            fieldName: item.fieldName, // 元信息名称（英文）
            fieldTitle: item.fieldTitle, // 元信息标题
            dataType: item.dataType, // 数据类型
            controlType: item.dataType === 'number' ? 'NUMBER_TEXT' : 'TEXT', // 控件类型,默认文本框
            fieldDesc: '', // 提示信息
            validValue: '', // 有效值
            maskModel: '', // 掩码方式
            isEncrypt: '', // 是否加密
            tokenizer: '', // 是否分词
            openType: 'PUBLIC', // 信息项公开类型,默认社会公开
            required: 'Y', // 信息项类型，默认核心项
            status: 'use', // 启用状态，默认启用
            // eslint-disable-next-line no-template-curly-in-string
            checkRules: JSON.stringify(rulesInit) // 校验配置,校验配置默认配置一个必填项
          }
        })
      },
      // 打开json导入窗口
      openJsonModal() {
        this.jsonStr = JSON.stringify(this.getMetadata(), null, 2)
        this.jsonModal = true
      },
      // 导入json数据
      importJson() {
        try {
          this.fields = JSON.parse(this.jsonStr)
        } catch (e) {
          this.$message({ type: 'danger', content: '输入格式不合法' })
        }
      },
      // 加载测试数据
      loadFields() {
        this.fields = items
      },
      // 预览form
      previewForm() {
        if (this.fields.length === 0) {
          this.$message({ type: 'danger', content: '没有配置信息项，请配置后预览' })
          return
        }
        // 根据原始列扩展动态表单列表数据
        initFormList(this.fields).then(res => {
          this.previewModal = true
          this.handleReset()
          this.dynamicForm = res
          this.initDynamicForm(res) // 根据动态列扩展form，rules和
        })
      },
      // 表单提交
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$message({ type: 'success', content: '表单校验成功' })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败' })
          }
        })
      },
      // 表单重置
      handleReset() {
        this.$refs.form && this.$refs.form.resetFields()
      },
      // =======init form and rules========/
      // 初始化form集合，扩展form对象和rules校验对象
      initDynamicForm(dynamicForm) {
        this.form = {}
        this.rules = {}
        // // 额外扩展id和person_id字段
        this.$set(this.form, 'id', '')
        // if (!['leg_base_info', 'nat_base_info', 'leg_id_info', 'nat_id_info'].includes(this.resource.tableName)) {
        //   this.$set(this.form, 'person_id', '')
        // }

        dynamicForm.forEach(item => {
          // 1、先根据filedName扩展form对象
          this.$set(this.form, item.fieldName, item.dataType === 'number' ? 0 : '')
          // 2、根据每个item，执行校验函数并返回校验数组
          // 根据checkRules参数获取实际校验对象
          let rules = checkRulesToFormRules(item.checkRules, this.form)
          if (rules.length > 0) {
            this.$set(this.rules, item.fieldName, rules)
          }
        })
        // this.$log.primary('----form----')
        // console.log(this.form)
        // this.$log.primary('------------')
        // this.$log.primary('----rules----')
        // console.log(this.rules)
        // this.$log.primary('-------------')
      }
    }
  }
</script>
