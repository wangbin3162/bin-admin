<template>
  <div class="interface-test">
    <b-collapse-wrap  title="测试接口" :collapse="inside">
      <div class="test-con">
        <div class="left">

          <div flex="main:justify" class="mb-20">
            <h4>基础参数</h4>
            <b-button type="text" @click="handleTestBtn">
              测试
            </b-button>
          </div>

           <div class="btn-con">
             <div class="block-btn mr-15" v-for="item in mappingFields" :key="item.apiId"
              :class="{ actived: item.apiId === curInterface.apiId, error: validateArr.includes(item.name)}"
              @click="handleInterfaceBtn(item)">
              <p class="t-ellipsis" title="接口1">
                接口：{{ item.title }}
              </p>
              <p class="t-ellipsis" title="名称">
                名称：{{ item.name }}
              </p>
            </div>
           </div>

          <template v-for="(form, key) in formsObj">
            <template v-if="form.fields.length > 0">
              <b-form :ref="key" v-show="key === curInterface.name" :key="key"
                label-position="top"
                :model="form.model"
                :rules="form.rules">

                <div class="form">
                  <template v-for="field in form.fields">
                    <b-form-item class="form-item mr-15" :key="field.fieldName"
                      :label="field.name"
                      :prop="field.fieldName">
                      <b-input v-model="form.model[field.fieldName]" @on-blur="validateAllForm"></b-input>
                    </b-form-item>
                  </template>
                </div>

              </b-form>
            </template>
          </template>
        </div>

        <div class="right">
          <h4 class="mb-20">
            执行结果
          </h4>
          <div style="position: relative;">
            <b-loading fix show-text="测试中..." v-if="loading"></b-loading>
            <b-ace-editor :value="testResStr" readonly>
            </b-ace-editor>
          </div>
        </div>
      </div>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import {
    getMultiInterfaceTemplateParam,
    executeContentTest,
    executeTest
  } from '../../../../api/data-analyze/da-content.api'

  export default {
    name: 'InterfaceTest',
    props: {
      initParam: {
        type: Object,
        default: null
      },
      inside: { // 默认内部模式，配置相应内使用，可设置外部模式，配置响应外使用，最终调用的测试接口不同
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        loading: false,
        contentId: '',
        mappingFields: [],
        curInterface: {}, // 当前选中的接口按钮
        formsObj: {}, // 构建后的模板参数对象，用于渲染form
        testResStr: '', // 测试结果字符串
        validateArr: [] // 存放未通过校验的index
      }
    },
    created () {
      this.init(this.initParam)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       * @param {Object} initParam
       * @param {string} initParam.contentId
       * @param {string} initParam.mappingFields
       */
      init (initParam) {
        this.contentId = initParam.contentId
        this.mappingFields = JSON.parse(initParam.mappingFields)
        this.curInterface = this.mappingFields[0]

        this.getMultiInterfaceTemplateParam(this.contentId, this.mappingFields)
      },

      /**
       * @author haodongdong
       * @description 获取接口摸板参数
       * @param {string} id 内容记录id
       * @param {Array} mappingFields JSON解析后的mappingFields数组，包含接口name、apiId
       */
      async getMultiInterfaceTemplateParam (id, mappingFields) {
        try {
          const res = await getMultiInterfaceTemplateParam(id)
          this.formsObj = this.buildFormsObj(res, mappingFields)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 响应配置外测试接口
       * @param {string} contentId 分析内容id
       * @param {Object} daExecuteDtos 接口相关参数对象，包含apiId、接口参数
       */
      async executeContentTest (contentId, daExecuteDtos) {
        this.loading = true
        try {
          const res = await executeContentTest(contentId, daExecuteDtos)
          this.testResStr = JSON.stringify(res, null, 2)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '测试出错', desc: error })
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 响应配置内测试接口
       * @param {string} contentId 分析内容id
       * @param {Object} daExecuteDtos 接口相关参数对象，包含apiId、接口参数
       */
      async executeTest (contentId, daExecuteDtos) {
        this.loading = true
        try {
          const res = await executeTest(contentId, daExecuteDtos)
          this.testResStr = JSON.stringify(res, null, 2)
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 测试按钮回调
       */
      async handleTestBtn () {
        const valid = await this.validateAllForm()

        if (valid) {
          // 构建测试参数
          const reqParams = []
          Object.keys(this.formsObj).forEach(key => {
            reqParams.push({
              id: this.formsObj[key].apiId,
              params: this.formsObj[key].model
            })
          })

          if (this.inside) {
            this.executeTest(this.contentId, reqParams)
          } else {
            this.executeContentTest(this.contentId, reqParams)
          }
        } else {
          this.$message({ type: 'warning', content: '有未填写的接口参数，请填写后测试。' })
        }
      },

      /**
       * @author haodongdong
       * @description 接口块状按钮回调
       * @param {Object} obj
       */
      handleInterfaceBtn (obj) {
        this.curInterface = obj
      },

      /**
       * @author haodongdong
       * @description 构建formsObj对象
       * @param {Object} paramsTemplate 接口返回的模板参数
       * @param {Array} mappingFields JSON解析后的mappingFields数组，包含接口name、apiId
       * @returns {Object}
       */
      buildFormsObj (paramsTemplate, mappingFields) {
        const formsObj = {}

        for (const key in paramsTemplate) {
          if (paramsTemplate.hasOwnProperty(key)) {
            const fields = paramsTemplate[key]

            // 用于构建b-form的rules、model对象
            const model = {}
            const rules = {}

            fields.forEach(field => {
              model[field.fieldName] = field.defaultValue // 构建model字段属性
              rules[field.fieldName] = [ // 构建rules字段属性
                { required: true, message: `${field.name}不能为空`, trigger: 'blur ' }
              ]
            })

            // 获取对应name的apiId，paramsTemplate为接口获取的摸板参数
            // 由于对应接口可能没有参数，所以不能从接口返回的参数里取apiId
            // 因此需要从mappingFields中找到对应的数据
            const mappingField = mappingFields.find(item => item.name === key)

            formsObj[key] = {
              key,
              apiId: mappingField.apiId,
              model: model,
              rules: rules,
              fields: fields
            }
          }
        }

        return formsObj
      },

      /**
       * @author haodongdong
       * @description 用于验证所有form
       */
      async validateAllForm () {
        return new Promise(async (resolve, reject) => {
          try {
            this.validateArr = []

            const formsObj = this.$refs
            for (const key in formsObj) {
              if (formsObj.hasOwnProperty(key)) {
                const form = formsObj[key][0]
                const valid = await form.validate()
                if (!valid) this.validateArr.push(key)
              }
            }

            let res = false
            if (this.validateArr.length === 0) res = true

            resolve(res)
          } catch (error) {
            console.error(error)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .interface-test {
    .test-con {
      display: flex;

      .border {
        border-bottom: 1px solid #d9d9d9;
      }

      .left {
        padding: 0 10px;
        width: 50%;
        border-right: 1px solid #d9d9d9;

        .btn-con {
          display: flex;
          flex-wrap: wrap;
          width: 100%

          .block-btn {
            margin-bottom: 20px;
            padding: 10px;
            width: 30%;
            border: 1px solid #d9d9d9;
            cursor: pointer;
            transition: all 0.4s;

            p {
              font-size: 13px;
            }

            &:hover {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
            &.actived {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
            &.error {
              border: 1px solid #ff7072;
              box-shadow: 0 2px 10px 0 rgba(255, 112, 114, 1);
            }
          }
        }

        .form {
          display: flex;
          flex-wrap: wrap;

          .form-item {
            width: 45%;
          }
        }
      }

      .right {
        padding: 0 10px;
        width: 50%;
      }
    }
  }
</style>
