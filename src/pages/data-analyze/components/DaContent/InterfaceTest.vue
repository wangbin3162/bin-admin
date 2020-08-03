<template>
  <div class="interface-test">
    <b-collapse-wrap  title="测试接口" collapse>
      <div class="test-con">
        <div class="left">

          <div flex="main:justify" class="mb-20">
            <h4>基础参数</h4>
            <b-button type="text">测试</b-button>
          </div>

           <div class="btn-con">
             <div class="block-btn mr-15" v-for="item in mappingFields" :key="item.apiId"
              :class="{ actived: item.apiId === curInterface.apiId }"
              @click="handleInterfaceBtn(item)">
              <p class="t-ellipsis" title="接口1">
                接口：{{ item.title }}
              </p>
              <p class="t-ellipsis" title="名称">
                名称：{{ item.name }}
              </p>
            </div>
           </div>

          <template v-for="(obj, key) in paramsTemplate">
            <b-form label-position="top" :key="key" v-show="key === curInterface.name">
              <div class="form">
                <template v-for="(subObj, subKey) in obj">
                  <b-form-item class="form-item mr-15" :label="subObj.name" :key="subKey">
                    <b-input></b-input>
                  </b-form-item>
                </template>
              </div>
            </b-form>
          </template>
        </div>

        <div class="right">
          <h4 class="mb-20">
            执行结果
          </h4>
          <b-ace-editor value="" readonly>
          </b-ace-editor>
        </div>
      </div>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import { getMultiInterfaceTemplateParam } from '../../../../api/data-analyze/da-content.api'

  export default {
    name: 'InterfaceTest',
    props: {
      initParam: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        contentId: '',
        mappingFields: [],
        curInterface: {}, // 当前选中的接口按钮
        paramsTemplate: {} // 参数模板对象
      }
    },
    watch: {
      initParam: {
        handler (newVal) {
          if (newVal) {
            this.contentId = newVal.contentId
            this.mappingFields = JSON.parse(newVal.mappingFields)
            this.curInterface = this.mappingFields[0]

            this.getMultiInterfaceTemplateParam(this.contentId)
          }
        }
      }
    },
    created () {

    },
    methods: {
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
       * @description 获取接口摸板参数
       * @param {string} id 内容记录id
       */
      async getMultiInterfaceTemplateParam (id) {
        try {
          const res = await getMultiInterfaceTemplateParam(id)
          this.paramsTemplate = res
          console.log(res)
        } catch (error) {
          console.error(error)
        }
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
