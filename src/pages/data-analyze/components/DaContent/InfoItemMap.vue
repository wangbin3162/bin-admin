<template>
  <div class="info-item-map">
    <page-header-wrap :title="`[${contentName}]信息项映射`" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>

        <b-collapse-wrap title="编辑映射" flex="dir:top main:center">

          <div class="map-con">
            <div class="left">

              <h4 class="mb-20">接口信息</h4>

              <div class="btn-con">
                <div class="block-btn" v-for="(item, index) in mappingFields" :key="item.apiId"
                  :class="{ actived: item.apiId === curInterface.apiId, error: validateArr.includes(index)}"
                  @click="curInterface = item">
                  <p class="t-ellipsis" title="接口1">
                    接口：{{ item.title }}
                  </p>
                  <p class="t-ellipsis" title="名称">
                    名称：{{ item.name }}
                  </p>
                </div>
              </div>

            </div>

            <div class="right">

              <div flex="main:justify" class="mb-20">
                <h4>配置映射</h4>
                <b-button type="text" @click="handleAddBtnClick" :disabled="mappingFields.length === 0">
                  + 新增
                </b-button>
              </div>

              <b-empty v-show="curInterface.mappingItems.length === 0">当前暂无数据</b-empty>

              <div v-show="curInterface.mappingItems.length > 0">

                <div class="form" v-for="(item, index) in curInterface.mappingItems" :key="index">
                  <b-form :model="item" :rules="rules" ref="form"
                    label-position="left" :label-width="60">

                    <div flex>
                      <b-form-item label="别名" prop="names" class="mr-15 form-item">
                        <div flex>
                          <b-input v-model="item.names" placeholder="请输入或选择别名">
                          </b-input>
                          <b-button type="primary" plain @click="handleAliasSelectBtn(item)">
                            选择
                          </b-button>
                        </div>
                      </b-form-item>

                      <b-form-item label="标题" prop="titles" class="mr-15 form-item">
                        <b-input v-model="item.titles" placeholder="请输入标题"></b-input>
                      </b-form-item>

                      <b-form-item label="操作">
                        <b-button type="danger" plain
                          @click="handleRemoveBtn(index)">
                          移除
                        </b-button>
                      </b-form-item>
                    </div>

                    <div flex>
                      <b-form-item label="类型" prop="type" class="mr-15 form-item">
                        <b-select v-model="item.type" style="width: 100%;" appendToBody
                          @on-change="handleTypeChange($event, item)">
                          <b-option v-for="(value, key) in typeEnum" :key="key" :value="key">
                            {{ value }}
                          </b-option>
                        </b-select>
                      </b-form-item>

                      <b-form-item label="配置" v-if="item.type === 'DICT' || item.type === 'API_CLS'"
                        class="mr-15 form-item" prop="typeContent">
                        <div flex>
                          <b-input placeholder="请选择相关配置" disabled :value="item.configName"></b-input>
                          <b-button type="primary" plain
                            @click="handleSelectConfigBtn(item)">
                            选择
                          </b-button>
                        </div>
                      </b-form-item>
                    </div>

                  </b-form>
                </div>

              </div>

            </div>
          </div>

        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleConfirmBtn">确 认</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <select-dict v-model="openSelectDict"
      @selected="handleSelectedDict">
    </select-dict>

    <select-response v-model="openSelectResponse"
      :contentId="contentId"
      @selected="handleSelectedRes">
    </select-response>

    <select-class-info v-model="openSelectClassInfo"
      @selected="handleSelectedClassInfo">
    </select-class-info>
  </div>
</template>

<script>
  import { getDaMappingType } from '../../../../api/enum.api'
  import { updateInfoItemMap } from '../../../../api/data-analyze/da-content.api'
  import SelectResponse from './SelectResponse'
  import SelectDict from './SelectDict'
  import SelectClassInfo from './SelectClassInfo'

  /**
   * @typedef {Object} InfoItem 信息项对象
   * @property {string} names 名称
   * @property {string} titles 标题
   * @property {string} type 类型
   * @property {string} [typeContent] 字典编码
   * @property {string} [configName] 字典名称
   */

  export default {
    name: 'InfoItemMap',
    props: {
      contentId: {
        type: String,
        required: true
      },
      contentName: {
        type: String,
        required: true
      },
      initMappingFields: {
        type: String,
        required: true
      }
    },
    components: {
      SelectResponse,
      SelectDict,
      SelectClassInfo
    },
    data () {
      return {
        openSelectResponse: false,
        openSelectDict: false,
        openSelectClassInfo: false,
        typeEnum: {}, // 类型枚举
        mappingFields: JSON.parse(this.initMappingFields),
        rules: {
          names: [
            { required: true, message: '别名不能为空', trigger: 'blur' }
          ],
          titles: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型不能为空', trigger: 'change' }
          ],
          typeContent: [
            { required: true, message: '请选相关配置', trigger: 'change' }
          ]
        },
        validateArr: [], // 存放未通过校验的index
        curInterface: {
          mappingItems: []
        }, // 当前选中的接口按钮
        curMappingItem: null // 当前操作行的对象
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化操作
       */
      init () {
        this.getEnum()
        if (this.mappingFields.length > 0) { // 默认选中第一个按钮
          this.curInterface = this.mappingFields[0]
        }
      },

      /**
       * @author haodongdong
       * @description 获取类型下拉框枚举
       */
      async getEnum () {
        try {
          const res = await getDaMappingType()
          this.typeEnum = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 更新信息项映射配置
       * @param {string} contentId 内容id
       * @param {Array} mappingFields 配置好的映射项对象数组
       */
      async updateInfoItemMap (contentId, mappingFields) {
        try {
          const res = await updateInfoItemMap(contentId, mappingFields)
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 创建信息映射项对象
       * @returns {InfoItem}
       */
      createInfoItemObj () {
        return {
          names: '',
          titles: '',
          type: '',
          typeContent: null,
          configName: null
        }
      },

      /**
       * @author haodongdong
       * @description 添加按钮回调
       */
      handleAddBtnClick () {
        const obj = this.createInfoItemObj()
        this.curInterface.mappingItems.push(obj)
      },

      /**
       * @author haodongdong
       * @description 别名选择按钮回调
       * @param {InfoItem} infoItem
       */
      handleAliasSelectBtn (infoItem) {
        this.curMappingItem = infoItem
        this.openSelectResponse = true
      },

      /**
       * @author haodongdong
       * @description select-response组件已选择的回调
       * @param {Object} resInfo 响应信息
       * @param {string} resInfo.keyAlias 别名
       */
      handleSelectedRes ({ keyAlias }) {
        this.curMappingItem.names = keyAlias
      },

      /**
       * @author haodongdong
       * @description 类别下拉框改变回调
       * @param {string} type
       * @param {InfoItem} infoItem
       */
      handleTypeChange (type, infoItem) {
        this.curMappingItem = infoItem
        this.curMappingItem.typeContent = ''
        this.curMappingItem.configName = ''
      },

      /**
       * @author haodongdong
       * @description 配置选择按钮回调
       * @param {InfoItem} infoItem
       */
      handleSelectConfigBtn (infoItem) {
        this.curMappingItem = infoItem

        if (infoItem.type === 'DICT') {
          this.openSelectDict = true
        } else if (infoItem.type === 'API_CLS') {
          this.openSelectClassInfo = true
        }
      },

      /**
       * @author haodongdong
       * @description select-dict组件已选择的回调
       * @param {Object} dict 字典信息
       * @param {string} dict.groupCode 字典编码
       * @param {string} dict.groupName 字典名称
       */
      handleSelectedDict (dict) {
        this.curMappingItem.typeContent = dict.groupCode + '-' + dict.groupName
        this.curMappingItem.configName = dict.groupName
      },

      /**
       * @author haodongdong
       * @description select-class-info组件已选择的回调
       * @param {Object} classInfo 类别信息
       * @param {string} classInfo.typeCode 类别编码
       * @param {string} classInfo.typeName 类别名称
       */
      handleSelectedClassInfo (classInfo) {
        this.curMappingItem.typeContent = classInfo.typeCode + '-' + classInfo.typeName
        this.curMappingItem.configName = classInfo.typeName
      },

      /**
       * @author haodongdong
       * @description 移除按钮回调
       * @param {number} index 当前行index
       */
      handleRemoveBtn (index) {
        this.curInterface.mappingItems.splice(index, 1)
      },

      /**
       * @author haodongdong
       * @description 确认按钮回调
       */
      async handleConfirmBtn () {
        const forms = this.$refs.form
        // console.log(forms)
        this.updateInfoItemMap(this.contentId, this.mappingFields)
        this.$emit('success')
        this.$emit('close')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .info-item-map {

    .map-con {
      display: flex;

      .border {
        border-bottom: 1px solid #d9d9d9;
      }

      .left {
        padding-right: 24px;
        width: 21%;
        border-right: 1px solid #d9d9d9;

        .btn-con {

          .block-btn {
            margin-bottom: 20px;
            padding: 10px;
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
      }

      .right {
        padding-left: 24px;
        width: 79%;

        .form {
          margin-bottom: 24px;
          border-bottom: 1px dashed #d9d9d9;

          .form-item {
            width: 40%;
          }
        }
      }
    }
  }
</style>
