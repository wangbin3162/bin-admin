<template>
  <div style="display: inline-block; margin-right: 8px;">
     <b-upload action="/" type="drag" :before-upload="handleUpload">
      <b-button icon="ios-cloud-upload" type="primary">
        <slot>批量解除</slot>
      </b-button>
    </b-upload>
  </div>
</template>

<script>
  import { batchRemove } from '../../../api/credit-service/red-blcak-list-remove.api'

  export default {
    name: 'BatchRemoveBtn',
    props: ['resourceKey'],
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      async handleUpload (file) {
        const params = {
          resourceKey: this.resourceKey,
          uploadFile: file
        }
        await this.batchRemove(params)
        this.$emit('success')
        return false
      },
      async batchRemove(params) {
        try {
          await batchRemove(params)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>
