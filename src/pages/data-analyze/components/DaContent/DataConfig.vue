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
        <b-button type="text" v-if="isDynamic">+ 新增接口</b-button>
      </div>

      <div v-if="!isDynamic" class="static">
        <b-code-editor v-model="exampleData"/>
      </div>

      <div v-if="isDynamic" class="dynamic">
        <b-form label-position="top" class="form" v-for="n in 2" :key=n>
          <div flex>
            <b-form-item label="接口1" class="form-item mr-10">
              <div flex>
                <b-input placeholder="请选择接口"></b-input>
                <b-button type="primary" plain>选择</b-button>
              </div>
            </b-form-item>

            <b-form-item label="标题" class="form-item mr-10">
              <b-input placeholder="请选择接口"></b-input>
            </b-form-item>

            <b-form-item label="名称" class="form-item mr-20">
              <b-input placeholder="请选择接口"></b-input>
            </b-form-item>

            <div flex="main:center" style="flex-grow: 1;" class="mt-10">
              <b-button type="text" icon="ios-remove-circle-outline"
                text-color="danger" :icon-style="{fontSize:'30px'}" disabled>
              </b-button>
            </div>
          </div>

          <div flex>
            <b-form-item label="排序" class="form-item mr-10">
              <b-input placeholder="请选择接口"></b-input>
            </b-form-item>

            <b-form-item label="信息项映射" class="form-item">
              <b-button type="primary" plain style="width: 100%;">
                配置信息项映射
              </b-button>
            </b-form-item>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DataConfig',
    props: {
      value: { // toggle 静态 动态
        type: String,
        required: true
      },
      data: { // 示例数据
        type: String,
        default: ''
      }
    },
    components: {

    },
    data () {
      return {
        toggle: this.value,
        exampleData: this.data
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
       * @description 静态、动态数据按钮点击回调
       * @param {string} toggle OFF NO
       */
      handleBlockBtnClick (toggle) {
        console.log(toggle)
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
