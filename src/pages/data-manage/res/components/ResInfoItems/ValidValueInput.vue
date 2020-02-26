<template>
  <!--有效值输入框 for ResInfoItems.vue -->
  <div>
    <b-input v-model="current" readonly clearable style="width: 100px;margin-right: 4px;" size="small"
             @on-clear="handleClear"></b-input>
    <b-button type="text" disabled v-if="dataType!=='string'">有效值
      <b-icon name="ios-arrow-down"></b-icon>
    </b-button>
    <b-dropdown v-else trigger="click" style="text-align: left;vertical-align: middle;" append-to-body>
      <b-button type="text">有效值
        <b-icon name="ios-arrow-down"></b-icon>
      </b-button>
      <b-dropdown-menu slot="list">
        <b-dropdown-item @click.native="handleCommand('DICT')">系统字典
        </b-dropdown-item>
        <b-dropdown-item @click.native="handleCommand('ENUM')">枚举值
        </b-dropdown-item>
      </b-dropdown-menu>
    </b-dropdown>
  </div>
</template>

<script>
  export default {
    name: 'ValidValueInput',
    props: {
      value: {
        type: String,
        default: ''
      },
      dataType: {
        type: String
      },
      currentIndex: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        current: '',
        enums: [],
        enumsVisible: false
      }
    },
    watch: {
      value: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    methods: {
      // 下拉选择填充有效值事件
      handleCommand(type) {
        if (this.dataType === 'string') {
          this.$emit('on-command', type, this.currentIndex)
        }
      },
      // 下拉选择填充有效值事件
      handleClear() {
        this.$emit('on-clear', this.currentIndex)
      }
    }
  }
</script>
