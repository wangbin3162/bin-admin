<template>
  <div class="info-item-map">
    <page-header-wrap title="信息项映射" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-table :columns="[]" :data="[]">

        </b-table>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" >提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  export default {
    name: 'InfoItemMap',
    props: {

    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    }
  }
</script>
