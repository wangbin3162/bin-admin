<template>
  <div>
    <page-header-wrap :title="'编辑测试'" show-close @on-close="closeHandler">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">

        </b-collapse-wrap>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  export default {
    name: 'newsMgmtEdit',
    props: {},
    data () {
      return {

      }
    },
    methods: {
      closeHandler () {
        this.$emit('close')
      }
    }
  }
</script>
