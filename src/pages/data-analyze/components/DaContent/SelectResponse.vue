<template>
  <div class="select-response">
    <b-modal v-model="open"
      title="选择响应"
      width="850"
      :body-styles="{ padding: 0 }"
      @on-visible-change="visibleChangeHandler">

      <v-table-wrap>
        <v-filter-bar @keyup-enter="search">
          <v-filter-item title="模板名称">
            <b-input v-model.trim="query.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码">
            <b-input v-model.trim="query.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="search" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
      </v-table-wrap>

    </b-modal>
  </div>
</template>

<script>
  import { queryRespInfos } from '../../../../api/data-analyze/da-content.api'

  export default {
    name: 'SelectResponse',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        loading: false,
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        colunms: [

        ],
        list: []
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取配置相应信息
       */
      async queryRespInfos () {
        try {

        } catch (error) {

        }
      },

      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      visibleChangeHandler (visible) {
        if (visible) {

        }
      },

      search () {

      },

      resetQuery () {

      }
    }
  }
</script>
