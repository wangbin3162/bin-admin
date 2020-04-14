<template>
  <div>
    <page-header-wrap v-if="visible" :title="resource.resourceName"
                      show-close @on-close="handleClose">
      <v-edit-wrap>
        <template slot="full">
          <v-title-bar :label="hasTestData?'修改示例数据':'新增示例数据'" class="mb-15"/>
          <b-form slot="full" :model="form" ref="form" label-position="top" :rules="rules">
            <form-item :key="item.id" v-for="item in dynamicForm"
                       :label="item.fieldTitle"
                       :prop="item.fieldName"
                       :control-type="item.controlType">
              <!--动态控件-->
              <form-control v-model="form[item.fieldName]"
                            :control-type="item.controlType"
                            :field-name="item.fieldName"
                            :field-desc="item.fieldDesc"
                            :field-title="item.fieldTitle"
                            :options="item.validOptions"
                            :table-name="resource.tableName"
                            @on-select-leg="handleSelectLeg"
                            @on-select-nat="handleSelectNat">
              </form-control>
            </form-item>
          </b-form>
        </template>
        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleClose">返 回</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">{{hasTestData?'修 改':'新 增'}}</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import { jsonDataToRules } from '../Validator/validate.cfg'
  import { default as api, getDictItems } from '../../../../../api/data-manage/gather.api'
  import FormItem from '../../../data-exchange/components/FormControl/FormItem'
  import FormControl from '../../../data-exchange/components/FormControl/FormControl'
  import { Decode, Encode } from '../../../../../common/utils/secret'
  import { addTestData, modifyTestData, searchTestData } from '../../../../../api/data-manage/res-info.api'

  export default {
    name: 'TestForm',
    components: { FormControl, FormItem },
    data() {
      return {
        isLeg: false, // 是否是法人，这里用resource.tableName 来判断
        resource: null,
        visible: false,
        dynamicForm: [], // 动态表单数组
        form: {}, // 动态表单
        resetForm: {},
        rules: {}, // 动态校验对象
        btnLoading: false,
        hasTestData: false
      }
    },
    created() {
      this.resetResource()
    },
    methods: {
      // 打开弹窗
      open(res, columns) {
        this.resource = deepCopy(res)
        this.isLeg = this.resource.tableName.includes('leg_')
        // 获取原始列数组
        this.columns = columns.filter(item => !item.fieldName.includes('_id'))
        // 根据原始列扩展动态表单列表数据
        this.initFormList().then(resp => {
          this.dynamicForm = resp
          this.initDynamicForm(this.dynamicForm) // 根据动态列扩展form，rules和
          this.visible = true
          this.$nextTick(() => {
            this.handleResetForm()
          })
          searchTestData(this.resource.resourceKey).then(res => {
            if (res.data.code === '0' && res.data.data) {
              const form = this.decodeAndMaskFormat([res.data.data])
              this.hasTestData = true // 添加过示例数据
              this.setFormObj(form[0])
            } else {
              this.hasTestData = false // 没有添加过示例数据
              this.resetResource()
            }
          })
        })
      },
      handleClose() {
        this.visible = false
        this.$emit('on-close')
      },
      // 初始化form集合，扩展form对象和rules校验对象
      initDynamicForm(dynamicForm) {
        this.form = {}
        this.rules = {}
        // 额外扩展id和person_id字段
        this.$set(this.form, 'id', '')
        if (!['leg_base_info', 'nat_base_info', 'leg_id_info', 'nat_id_info'].includes(this.resource.tableName)) {
          this.$set(this.form, 'person_id', '')
        }
        dynamicForm.forEach(item => {
          // 先根据filedName扩展form对象
          this.$set(this.form, item.fieldName, '')
          // 根据每个item，执行校验函数并返回校验数组
          let rules = jsonDataToRules(item, this.form)
          if (rules.length > 0) {
            this.$set(this.rules, item.fieldName, rules)
          }
        })
        // this.$log.primary('----rules----')
        // console.log(this.rules)
        // this.$log.primary('-------------')
        this.$refs.form && this.$refs.form.resetFields()
      },
      // 初始化动态菜单列表
      async initFormList() {
        let dynamicForm = deepCopy(this.columns)
        try {
          let promises = this.columns.map((item) => this.initItemsByValidValue(item.validValue))
          let results = await Promise.all(promises)
          for (let i = 0; i < this.columns.length; i++) {
            dynamicForm[i]['validOptions'] = results[i]
          }
        } catch (e) {
          this.$log.danger(e)
        }
        return dynamicForm
      },
      // 根据字符值判断是字典值还是枚举值，然后初始化items数组
      async initItemsByValidValue(valid) {
        let ret = []
        if (valid.isNotEmpty()) { // 如果不为空则去初始化数组
          const index = valid.indexOf(';')
          if (index > -1) { // 如有;则为枚举型
            let names = valid.slice(0, index).split('/')
            let codes = valid.slice(index + 1).split('/')
            for (let i = 0; i < codes.length; i++) {
              ret.push({ code: codes[i], name: names[i] })
            }
          } else {
            // 根据code查询字典项
            let code = valid.slice(valid.indexOf('/') + 1)
            await getDictItems(code).then(res => {
              if (res.data.code === '0') {
                ret = res.data.data
              }
            })
          }
        }
        return ret
      },
      // 选择法人事件
      handleSelectLeg(leg) {
        this.form['person_id'] = leg.id
        this.form['comp_name'] = leg.compName
        this.form['id_type'] = leg.idType
        this.form['id_code'] = leg.idCode
        // 选中后重新触发校验
        this.$refs.form.validateField('comp_name')
        this.$refs.form.validateField('id_type')
        this.$refs.form.validateField('id_code')
      },
      // 选择自然人事件
      handleSelectNat(nat) {
        this.form['person_id'] = nat.id
        this.form['name'] = nat.name
        this.form['id_type'] = nat.idType
        this.form['id_code'] = nat.idCode
        // 选中后重新触发校验
        this.$refs.form.validateField('name')
        this.$refs.form.validateField('id_type')
        this.$refs.form.validateField('id_code')
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
          resourceCode: '1234', // 资源代码
          resourceDesc: '测试资源描述', // 资源描述
          resourceKey: '',
          updatePeriod: '0_IN_TIME_M', // 更新周期
          expiryLimit: 24, // 有效期限
          resProperty: 'B01', // 资源性质
          sharedType: 'PUBLIC', // 共享属性
          shareCondition: '', // 共享条件
          shareMode: '', // 共享方式
          isOpen: '0', // 开放属性
          openCondition: '', // 开放条件
          availableStatus: '',
          status: '',
          items: []
        }
      },
      // 单个对象编码后
      encodeOneFormat(obj) {
        let tmp = { ...obj }
        this.dynamicForm.forEach(field => {
          if (field.isEncrypt === '1') { // 编码
            tmp[field.fieldName] = Encode(obj[field.fieldName])
            // console.log('单个对象编码后：' + tmp[field.fieldName])
          }
        })
        return tmp
      },
      // 解码和掩码处理列表
      decodeAndMaskFormat(arr) {
        let newArr = []
        arr.forEach(item => {
          let tmp = { ...item }
          this.dynamicForm.forEach(field => {
            if (field.isEncrypt === '1') { // 解密
              tmp[field.fieldName] = Decode(item[field.fieldName])
              // console.log('解码后：' + tmp[field.fieldName])
            }
          })
          newArr.push(tmp)
        })
        return newArr
      },
      setFormObj(target) {
        Object.keys(this.form).forEach(key => {
          this.form[key] = target[key]
        })
      },
      // 表单提交
      handleSubmit() {
        if (!this.$refs.form) return
        this.$refs.form.validate((valid) => {
          if (valid) {
            let tmpForm = this.encodeOneFormat(this.form)
            this.btnLoading = true
            let fun = this.hasTestData ? modifyTestData : addTestData
            fun(this.resource.resourceKey, tmpForm).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.handleClose()
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.btnLoading = false // 按钮状态清空
            })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
          }
        })
      },
      // 表单重置
      handleResetForm() {
        this.$refs.form && this.$refs.form.resetFields()
      }
    }
  }
</script>
