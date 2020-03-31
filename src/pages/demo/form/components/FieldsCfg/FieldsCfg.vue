<template>
  <b-row>
    <b-col span="12">
      items
    </b-col>
    <b-col span="12">
      配置项
    </b-col>
  </b-row>
</template>

<script>
  import enumObj from './enum'

  export default {
    name: 'FieldsCfg',
    data() {
      return {
        enumMap: enumObj
      }
    },
    created() {
      console.log(this.enumMap)
    }
  }
</script>
