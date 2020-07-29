<template>
  <div class="info-item-map">
    <page-header-wrap title="信息项映射" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>

        <b-collapse-wrap title="编辑映射" flex="dir:top main:center">
          <b-empty v-if="mappingItems.length === 0">当前暂无数据</b-empty>

          <b-card v-for="(item, index) in mappingItems" :key="index"
            shadow="always" class="mb-15">
            <b-form :model="item" :rules="rules" ref="form" class="form"
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
                  <b-button type="primary" plain
                    @click="handleRemoveBtn(index)">
                    移除
                  </b-button>
                </b-form-item>
              </div>

              <div flex>
                <b-form-item label="类型" prop="type" class="mr-15 form-item">
                  <b-select v-model="item.type" style="width: 100%;" appendToBody>
                    <b-option v-for="(value, key) in typeEnum" :key="key" :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </b-form-item>

                <b-form-item label="配置" v-if="item.type === 'DICT'" prop="dictCode" class="mr-15 form-item">
                  <div flex>
                    <b-input placeholder="选择字典" disabled :value="item.dictName"></b-input>
                    <b-button type="primary" plain
                      @click="handleSelectDictBtn(item)">
                      选择
                    </b-button>
                  </div>
                </b-form-item>
              </div>

            </b-form>
          </b-card>

          <b-button type="primary" plain style="width: 100%;"
            @click="handleAddBtnClick">
            添加
          </b-button>
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
      :id="id"
      @selected="handleSelectedRes">
    </select-response>
  </div>
</template>

<script>
  import { getDaMappingType } from '../../../../api/enum.api'
  import SelectResponse from './SelectResponse'
  import SelectDict from './SelectDict'

  /**
   * @typedef {Object} InfoItem 信息项对象
   * @property {string} names 名称
   * @property {string} titles 标题
   * @property {string} type 类型
   * @property {string} [dictCode] 字典编码
   * @property {string} [dictName] 字典名称
   */

  export default {
    name: 'InfoItemMap',
    props: {
      id: {
        type: String,
        required: true
      },
      initMappingItems: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      SelectResponse,
      SelectDict
    },
    data () {
      return {
        openSelectResponse: false,
        openSelectDict: false,
        typeEnum: {}, // 类型枚举
        mappingItems: this.initMappingItems,
        curMappingItem: null, // 当前操作行的对象
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
          dictCode: [
            { required: true, message: '请选择字典', trigger: 'change' }
          ]
        }
      }
    },
    created () {
      this.getEnum()
    },
    methods: {
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
       * @description 创建信息映射项对象
       * @returns {InfoItem}
       */
      createInfoItemObj () {
        return {
          names: '',
          titles: '',
          type: '',
          dictCode: null,
          dictName: null
        }
      },

      /**
       * @author haodongdong
       * @description 添加按钮回调
       */
      handleAddBtnClick () {
        const obj = this.createInfoItemObj()
        this.mappingItems.push(obj)
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
       * @param {string} resInfo.id
       * @param {string} resInfo.keyAlias
       * @param {string} resInfo.keyName
       * @param {string} resInfo.keyPath
       */
      handleSelectedRes (resInfo) {
        this.curMappingItem.names = resInfo.keyAlias
      },

      /**
       * @author haodongdong
       * @description 字典项选择按钮回调
       * @param {InfoItem} infoItem
       */
      handleSelectDictBtn (infoItem) {
        this.curMappingItem = infoItem
        this.openSelectDict = true
      },

      /**
       * @author haodongdong
       * @description select-dict组件已选择的回调
       * @param {Object} dict 字典信息
       * @param {string} dict.groupCode 字典编码
       * @param {string} dict.groupName 字典名称
       */
      handleSelectedDict (dict) {
        this.curMappingItem.dictCode = dict.groupCode
        this.curMappingItem.dictName = dict.groupName
      },

      /**
       * @author haodongdong
       * @description 移除按钮回调
       * @param {number} index 当前行index
       */
      handleRemoveBtn (index) {
        this.mappingItems.splice(index, 1)
      },

      /**
       * @author haodongdong
       * @description 确认按钮回调
       */
      async handleConfirmBtn () {
        const failed = []
        if (this.mappingItems.length > 0) {
          for (const item of this.$refs.form) {
            const valid = await item.validate()
            if (!valid) {
              failed.push(valid)
            }
          }
        }
        if (failed.length === 0) {
          this.$emit('complete', this.$util.deepClone(this.mappingItems))
          this.$emit('close')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .info-item-map {
    .form-item {
      width: 40%;
    }
  }
</style>
