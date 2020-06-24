<template>
  <div>
    <div flex>
      <div style="width: 80px;">
        <b-tag size="small" style="width: 100%;margin: 0;">
          <b-dropdown trigger="click" append-to-body>
            <div style="width: 65px;cursor:pointer;" flex="main:justify cross:center">
              <span style="font-size: 14px;color: rgba(0,0,0,.65)">{{ typeMap[inputValue.type] }}</span>
              <b-icon name="ios-arrow-down" size="14" color="rgba(0,0,0,.45)"></b-icon>
            </div>
            <b-dropdown-menu slot="list">
              <b-dropdown-item v-for="(value,key) in typeMap" :key="key"
                               :selected="inputValue.type===key"
                               @click.native="handleTypeChange(key)">
                {{ value }}
              </b-dropdown-item>
            </b-dropdown-menu>
          </b-dropdown>
        </b-tag>
      </div>
      <div style="width: calc(100% - 80px);">
        <b-input v-if="value.type==='default' || value.type==='el'" v-model="inputValue.value" size="small"
                 :placeholder="value.type==='default' ? '请输入默认值' : '请输入表达式,例: #name'"
                 @on-change="emitValue"/>
        <b-input v-else :value="inputValue.showValue" size="small" readonly/>
      </div>
    </div>
    <dept-choose ref="deptChoose" @on-change="handleChooseDept"/>
    <user-choose ref="userChoose" @on-change="handleChooseUser"/>
  </div>
</template>

<script>
  import DeptChoose from './DeptChoose'
  import UserChoose from './UserChoose'

  export default {
    name: 'DefaultValueInput',
    components: { UserChoose, DeptChoose },
    props: {
      value: {
        type: Object,
        default() {
          return {
            type: 'default', // ['dept', 'user', 'default']
            value: '', // 实际值
            showValue: '' // 显示值
          }
        }
      }
    },
    data() {
      return {
        inputValue: {
          type: 'default', // ['dept', 'user', 'default']
          value: '', // 实际值
          showValue: '' // 显示值
        },
        typeMap: { dept: '部门', user: '用户',el: "表达式",default: '自定义' }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.inputValue = { ...val }
        },
        immediate: true
      }
    },
    computed: {},
    methods: {
      handleTypeChange(type) {
        this.inputValue.type = type
        this.inputValue.value = ''
        this.inputValue.showValue = ''
        if (type !== 'default' && type !== 'el') {
          const ref = `${type}Choose`
          this.$refs[ref] && this.$refs[ref].open()
        }
        this.emitValue()
      },
      emitValue() {
        this.$emit('input', { ...this.inputValue })
        this.$emit('on-change', { ...this.inputValue })
      },
      // 选择部门
      handleChooseDept(dept) {
        // 没有选过值，关闭，则重置为自定义，否则跳过
        if (!dept) {
          if (this.inputValue.value.length === 0) { // 没有选过值
            this.inputValue.type = 'default'
            this.emitValue()
          }
          return
        }
        this.inputValue.value = dept.id
        this.inputValue.showValue = dept.value
        this.emitValue()
      },
      // 选择用户
      handleChooseUser(user) {
        if (!user) {
          if (this.inputValue.value.length === 0) { // 没有选过值
            this.inputValue.type = 'default'
            this.emitValue()
          }
          return
        }
        this.inputValue.value = user.id
        this.inputValue.showValue = user.value
        this.emitValue()
      }
    }
  }
</script>
