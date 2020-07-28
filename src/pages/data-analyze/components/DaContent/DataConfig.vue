<template>
  <div class="data-config">
    <div class="left">
      <h3 class="mb-20">数据来源</h3>

      <div class="block-btn" :class="{ actived: !isDynamic}" @click="toggle = 'OFF'">
        <h3>静态数据</h3>
        <p>
          为分析内容配置静态数据，请在右侧输入静态数据
        </p>

      </div>
      <div class="block-btn" :class="{ actived: isDynamic}" @click="toggle = 'ON'">
        <h3>动态数据</h3>
        <p>
          为分析内容配置动态数据，请在右侧详细配置
        </p>
      </div>
    </div>

    <div class="right">
      <div flex="main:justify" class="mb-20">
        <h3>数据配置</h3>
        <b-button type="text" v-if="isDynamic"
          @click="handleAddInterfaceBtn">
          + 新增接口
        </b-button>
      </div>

      <div v-if="!isDynamic && isEdit" class="static">
        <b-ace-editor v-model="exampleData">
        </b-ace-editor>
      </div>

      <div v-if="isDynamic" class="dynamic">
        <template v-for="(item, index) in mappingFields">
          <b-form ref="form" label-position="top" class="form" :key="index"
            :model="item" :rules="rules">
            <div flex>
              <b-form-item :label="item.title === '' ? `接口${index + 1}` : item.title"
                class="form-item mr-10" prop="apiId">
                <api-choose v-model="item.apiId" :default-name="item.title"
                  @on-change="({ name })=> item.title = name">
                </api-choose>
              </b-form-item>

              <b-form-item label="名称" class="form-item mr-20" prop="name">
                <b-input v-model="item.name" placeholder="请输入名称"></b-input>
              </b-form-item>

              <b-form-item label="信息项映射" class="form-item">
                <b-button type="primary" plain style="width: 100%;"
                  @click="handleConfigInfoItemMapBtn(item.mappingItems, index)">
                  配置信息项映射
                </b-button>
              </b-form-item>

              <div flex="main:center" style="flex-grow: 1;" class="mt-10">
                <b-button type="text" icon="ios-remove-circle-outline"
                  text-color="danger" :icon-style="{fontSize:'30px'}"
                  :disabled="index === 0"
                  @click="handleDelInderfaceBtn(index)">
                </b-button>
              </div>
            </div>

            <!-- <div flex>
              <b-form-item label="排序" class="form-item mr-10">
                <b-input-number v-model="item.orderNo"
                  style="width: 100%;"
                  placeholder="请输入序号"
                  :min="0">
                </b-input-number>
              </b-form-item>

              <b-form-item label="信息项映射" class="form-item">
                <b-button type="primary" plain style="width: 100%;"
                  @click="handleConfigInfoItemMapBtn(item.mappingItems, index)">
                  配置信息项映射
                </b-button>
              </b-form-item>
            </div> -->
          </b-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ApiChoose from './ApiChoose'

  /**
   * @typedef {Object} InfoItem 信息项对象
   * @property {string} name 名称
   * @property {string} titles 标题
   * @property {string} type 类型
   * @property {string} [dictCode] 字典编码
   * @property {string} [dictName] 字典名称
   */

  /**
   * @typedef {Object} interfaceObj 接口对象
   * @property {string} apiId 接口id
   * @property {string} title 标题
   * @property {string} name 名称
   * @property {number} orderNo 排序
   * @property {InfoItem[]} mappingItems 信息项映射配置
   */

  export default {
    name: 'DataConfig',
    props: {
      value: { // toggle 静态 动态
        type: String,
        required: true
      },
      data: { // 示例数据
        type: String,
        required: true
      },
      initMappingFields: { // 动态数据时，数据配置信息
        type: String,
        required: true
      },
      isEdit: { // 用于正确渲染b-code-editor组件
        type: Boolean,
        required: true
      }
    },
    components: {
      ApiChoose
    },
    data () {
      return {
        toggle: this.value, // 数据来源按钮 静态 OFF 动态 ON
        exampleData: this.data, // 静态示例数据
        mappingFields: [],
        rules: {
          apiId: [
            { required: true, message: '请配置接口', trigger: 'change' }
          ]
        },
        curIndex: null // 当前操作行所在的index
      }
    },
    watch: {
      value: {
        handler (newVal) { // 用于赋默认值
          this.toggle = newVal
        }
      },
      data: {
        handler (newVal) { // 用于赋默认值
          this.exampleData = newVal
        }
      },
      initMappingFields: { // 此watcher用于赋初始值
        handler (newVal) {
          this.mappingFields = JSON.parse(newVal)
          if (this.mappingFields.length === 0) {
            const obj = this.createInterfaceObj()
            this.mappingFields.push(obj)
          }
        }
      },
      toggle: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    computed: {
      isDynamic () {
        return this.toggle === 'ON'
      }
    },
    created () {

    },
    methods: {

      /**
       * @author haodongdong
       * @description 创建接口对象
       * @returns {interfaceObj}
       */
      createInterfaceObj () {
        const obj = {
          apiId: '',
          title: '',
          name: '',
          mappingItems: []
        }
        return obj
      },

      /**
       * @author haodongdong
       * @description 新增接口按钮回调
       */
      handleAddInterfaceBtn () {
        const obj = this.createInterfaceObj()
        this.mappingFields.push(obj)
      },

      /**
       * @author haodongdong
       * @description 删除接口按钮回调
       * @param {number} index 要删除的下标
       */
      handleDelInderfaceBtn (index) {
        this.mappingFields.splice(index, 1)
      },

      /**
       * @author haodongdong
       * @description 配置信息项映射按钮回调
       * @param {InfoItem} mappingItems
       * @param {number} index
       */
      handleConfigInfoItemMapBtn (mappingItems, index) {
        this.curIndex = index // 缓存当前操作行index，用于配置信息项映射后更新数据
        this.$emit('config-map', this.$util.deepClone(mappingItems))
      },

      /**
       * @author haodongdong
       * @description 用于验证组件内需要提交的数据
       */
      async validate () {
        return new Promise(async (resolve, reject) => {
          const failed = []
          for (const item of this.$refs.form) {
            const valid = await item.validate()
            if (!valid) {
              failed.push(valid)
            }
          }
          if (failed.length === 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      },

      /**
       * @author haodongdong
       * @description 用于共外部组件产生mappingItems后更新当前组件内对应数据
       * @param {InfoItem} mappingItems
       */
      setMappingitems (mappingItems) {
        const curObj = this.mappingFields[this.curIndex]
        curObj.mappingItems = mappingItems
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .data-config {
    display: flex;

    .left {
      padding: 0 20px 0 0;
      width: 300px;
      border-right: 1px solid #d9d9d9;

      .block-btn {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        transition: all 0.4s;

        p {
          padding-top: 5px;
          font-size: 13px;
          color: #bfbfbf;
        }

        &:hover {
          box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
        }
        &.actived {
          box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
        }
      }
    }

    .right {
      padding: 0 0 0 20px;
      width: calc(100% - 300px);

      .form {
        margin-bottom: 17px;
        border-bottom: 1px solid #d9d9d9;

        .form-item {
          width: 30%;
        }
      }
    }
  }
</style>
