<template>
    <b-tabs style="width: 230px;"
      v-model="activeTab" :data="tabs"
      @on-change="onChangeHandler">
    </b-tabs>
</template>

<script>
  export default {
    name: 'TypeSwitchBtn',
    props: {
      tabs: {
        type: Array,
        required: true
      },
      selected: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        activeTab: this.selected ? this.selected : this.tabs[0].key
      }
    },
    methods: {
      onChangeHandler (curTab) {
        this.$emit('tab-change', curTab.key)
      }
    }
  }
</script>
