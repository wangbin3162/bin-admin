<template>
  <page-header-wrap>
    <v-table-wrap>
      <div style="position:relative;width: 100%;height: 600px;">
        <flow-basic/>
      </div>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>

import FlowBasic from '@/components/Flow/FlowBasic'

export default {
  name: 'FlowConfig',
  components: { FlowBasic }
}
</script>

<style scoped>

</style>
