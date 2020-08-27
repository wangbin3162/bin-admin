<template>
  <div>
    <b-tabs v-model="activeTab" :data="tabs" ref="bTabs">
    </b-tabs>
  </div>
</template>

<script>
  export default {
    name: 'SubTabs',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        activeTab: this.value,
        tabs: [
          { key: 'modelManage', title: '模型管理' },
          { key: 'decisionMatrix', title: '判定矩阵' }
        ]
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.activeTab = newVal
          this.$nextTick(() => {
            const tab = this.tabs.find(item => item.key === this.activeTab)
            this.$refs.bTabs.handleSelectTab(tab)
          })
        }
      },
      activeTab: {
        handler (newVal) {
          this.$emit('input', newVal)
          this.$emit('tab-change', newVal)
        }
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>
