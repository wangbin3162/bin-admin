<template>
  <div class="batch-async-set-dialog set-con">
    <b-card head-tip>
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>已选资源信息</span>
        </div>
      </template>

      <div flex="main:justify cross:center" class="mb-5">
        <b-checkbox @on-change="handleCheckboxChane">
          <span style="color: rgba(0,0,0,.85);">
            全部资源
          </span>
        </b-checkbox>
      </div>

      <div class="tag-con">
        <b-tag type="info" v-for="(item, index) in resourceList" :key="index"
          closable @on-close="handleTagClose(index)">
          资源名称{{ item.a }}
        </b-tag>
      </div>

      <div class="form-con">
        <div flex="main:justify cross:center">
          <span style="color: rgba(0,0,0,.85);">同步方式：</span>
          <b-radio-group>
            <b-radio label="全量"></b-radio>
            <b-radio label="增量"></b-radio>
          </b-radio-group>
        </div>

        <div>
          <b-form label-position="top" :model="form" :rules="rules" ref="form">
            <b-form-item label="时间范围">
              <b-date-picker type="daterange" style="width: 100%;"
                placement="top-end"
                placeholder="Select date">
              </b-date-picker>
            </b-form-item>

            <b-form-item>
              <div flex="main:justify">
                <b-button style="width: 49%;">
                  取消
                </b-button>
                <b-button type="primary" style="width: 49%;">
                  执行同步
                </b-button>
              </div>
            </b-form-item>

          </b-form>

        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'SetCon',
    props: {
      initResources: {
        type: Array,
        reauired: true
      }
    },
    data () {
      return {
        resourceList: this.initResources,
        form: {
          startDate: '',
          endDate: ''
        },
        rules: {

        }
      }
    },
    watch: {
      initResources: {
        handler (newVal) {
          this.resourceList = newVal
        },
        deep: true
      },
      resourceList: {
        handler (newVal) {
          this.$emit('res-change', newVal)
        },
        deep: true
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 全部资源选择框状态改变事件
       * @param {Boolean} selected
       */
      handleCheckboxChane (selected) {
        console.log(selected)
        this.$emit('select-status-change', selected)
      },

      /**
       * @author haodongdong
       * @description 标签关闭事件回调
       * @param {number} index
       */
      handleTagClose (index) {
        this.resourceList.splice(index, 1)
      }
    }
  }
</script>

<style lang="stylus">
  .batch-async-set-dialog.set-con {
    .bin-card .bin-card__body {
      padding: 4px;
      max-height: 450px;
      overflow: auto;
    }

    .form-con .bin-form-item-content {
      position: initial;
    }
  }
</style>

<style lang="stylus" scoped>
  .batch-async-set-dialog.set-con {
    .tag-con {
      max-height: 200px;
      overflow: auto;
    }

    .form-con {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #d9d9d9;
    }
  }
</style>
