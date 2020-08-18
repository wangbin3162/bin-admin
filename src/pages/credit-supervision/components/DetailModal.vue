<template>
  <div>
    <b-modal v-model="open" class-name="table-page-detail-modal"
      footer-hide width="1200"
      @on-visible-change="handleVisibleChange">
      <title-bar tip-pos="left" :font-size="18" :label="title + '-详情'" slot="header">
      </title-bar>
      <b-loading show-text="加载中...." v-if="loading"></b-loading>
      <key-label-wrap v-if="!loading">
        <key-label v-for="(label, key) in mapping" :key="key"
          is-full :label="label" label-width="155px">
          {{ detail[key] | valueFilter }}
        </key-label>
      </key-label-wrap>
    </b-modal>
  </div>
</template>

<script>
  import { getQueryDetail } from '@/api/credit-supervision/detail.api'

  export default {
    name: '',
    filters: {
      valueFilter(value) {
        if (!value || value.toString().length === 0) {
          return '-'
        }
        return value
      }
    },
    props: {
      value: {
        type: Boolean,
        required: true
      },
      resourceKey: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        loading: false,
        open: this.value,
        mapping: {},
        detail: {}
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
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.mapping = {}
          this.detail = {}
        }
      },

      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const { id, type } = this.$route.query
        this.getDetail(id, this.resourceKey, type)
      },

      /**
       * @author haodongdong
       * @description 获取资源详情接口
       * @param {string} id 主体id
       * @param {string} resourceKey 资源key
       * @param {string} type 主体类别
       */
      async getDetail (id, resourceKey, type) {
        this.loading = true
        try {
          const { mapping, data } = await getQueryDetail(id, resourceKey, type)
          this.mapping = mapping
          this.detail = data
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
        this.loading = false
      }
    }
  }
</script>
