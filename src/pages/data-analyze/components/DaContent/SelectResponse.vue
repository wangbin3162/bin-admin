<template>
  <div class="select-response">
    <b-modal v-model="open"
      title="选择响应"
      width="850"
      :body-styles="{ padding: 0 }"
      footer-hide
      @on-visible-change="visibleChangeHandler">

      <v-table-wrap>
        <!-- <v-filter-bar @keyup-enter="search">
          <v-filter-item title="模板名称">
            <b-input v-model.trim="query.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="模板编码">
            <b-input v-model.trim="query.code" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item @on-search="search" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar> -->

        <b-table :columns="colunms" :data="list" :loading="loading" size="small">
          <template v-slot:action="{ row }">
            <b-button type="text" @click.stop="handleSelectBtn(row)">
              选择
            </b-button>
          </template>
        </b-table>
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
      },
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        loading: false,
        colunms: [
          { type: 'index', width: 50 },
          { title: '别名', key: 'keyAlias' },
          { title: '键名', key: 'keyName' },
          { title: '键路径', key: 'keyPath' },
          { title: '操作', slot: 'action', width: 70 }
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
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.queryRespInfos(this.id)
        } else {
          this.list = []
        }
      },

      /**
       * @author haodongdong
       * @description 获取配置相应信息
       */
      async queryRespInfos (id) {
        this.loading = true
        try {
          const res = await queryRespInfos(id)
          this.list = res
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 选择按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.id
       * @param {string} row.keyAlias
       * @param {string} row.keyName
       * @param {string} row.keyPath
       */
      handleSelectBtn (row) {
        this.$emit('selected', this.$util.deepClone(row))
        this.open = false
      }
    }
  }
</script>
