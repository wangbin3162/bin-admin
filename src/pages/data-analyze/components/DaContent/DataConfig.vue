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
        <b-code-editor v-model="exampleData">
        </b-code-editor>
      </div>

      <div v-if="isDynamic" class="dynamic">
        <template v-for="(item, index) in mappingFields">
          <b-form ref="form" label-position="top" class="form" :key="index"
            :model="item" :rules="rules">
            <div flex>
              <b-form-item :label="item.title === '' ? `接口${index + 1}` : item.title"
                class="form-item mr-10" prop="apiId">
                <!-- <div flex>
                  <b-input placeholder="请选择接口" :value="item.apiId" disabled>
                  </b-input>
                  <b-button type="primary" plain>选择</b-button>
                </div> -->
                <api-choose v-model="item.apiId" :default-name="item.apiId">
                </api-choose>
              </b-form-item>

              <b-form-item label="标题" class="form-item mr-10" prop="title">
                <b-input v-model="item.title" placeholder="请输入标题"></b-input>
              </b-form-item>

              <b-form-item label="名称" class="form-item mr-20" prop="name">
                <b-input v-model="item.name" placeholder="请输入名称"></b-input>
              </b-form-item>

              <div flex="main:center" style="flex-grow: 1;" class="mt-10">
                <b-button type="text" icon="ios-remove-circle-outline"
                  text-color="danger" :icon-style="{fontSize:'30px'}"
                  :disabled="index === 0"
                  @click="handleDelInderfaceBtn(index)">
                </b-button>
              </div>
            </div>

            <div flex>
              <b-form-item label="排序" class="form-item mr-10">
                <b-input-number v-model="item.orderNo"
                  style="width: 100%;"
                  placeholder="请输入序号"
                  :min="0">
                </b-input-number>
              </b-form-item>

              <b-form-item label="信息项映射" class="form-item">
                <b-button type="primary" plain style="width: 100%;"
                  @click="$emit('config-map')">
                  配置信息项映射
                </b-button>
              </b-form-item>
            </div>
          </b-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ApiChoose from './ApiChoose'

  /**
   * @typedef {Object} infoItem 信息项对象
   * @property {string} name 名称
   * @property {string} titles 标题
   * @property {string} type 类型
   * @property {string} typeContent 类型内容
   */

  /**
   * @typedef {Object} interfaceObj 接口对象
   * @property {string} apiId 接口id
   * @property {string} title 标题
   * @property {string} name 名称
   * @property {number} orderNo 排序
   * @property {infoItem[]} mappingItems 信息项映射配置
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
        type: Array,
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
            { required: true, message: '接口不能为空', trigger: 'change' }
          ],
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]
        }
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
          this.mappingFields = this.$util.deepClone(newVal)
          if (this.mappingFields.length === 0) {
            const obj = this.createInterfaceObj()
            obj.title = '接口1'
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
          orderNo: null,
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
        obj.title = '接口' + (this.mappingFields.length + 1)
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
       * @description 静态、动态数据按钮点击回调
       * @param {string} toggle OFF NO
       */
      handleBlockBtnClick (toggle) {
        console.log(toggle)
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
