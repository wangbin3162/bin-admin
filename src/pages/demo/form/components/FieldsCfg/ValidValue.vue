<template>
  <div class="valid-value-wrap">
    <b-radio-group v-model="normalType">
      <b-radio label="enum">
        <span>枚举</span>
      </b-radio>
      <b-radio label="dict">
        <span>字典</span>
      </b-radio>
    </b-radio-group>
    <div style="padding: 10px 0;">
      <!--如果选项是字典类型-->
      <div v-show="isDict" flex="main:justify cross:center">
        <div>
          <b-tag style="margin: 0;" type="primary">字典名称</b-tag>
          <b-tag style="margin: 0 5px 0 0;">{{dict.name}}</b-tag>
          <b-tag style="margin: 0;" type="primary">字典编码</b-tag>
          <b-tag style="margin: 0;">{{dict.code}}</b-tag>
        </div>
        <div>
          <b-tooltip content="选择字典" theme="light">
            <b-button icon="ios-play" type="primary" transparent/>
          </b-tooltip>
        </div>
      </div>
      <!--如果是枚举值类型-->
      <div v-show="isEnum">
        <div class="enum-wrap">
          <div v-for="(item,index) in arrData" :key="index" class="enum-item mb-10">
            <b-input v-model="arrData[index].code" style="width: 40%;" @on-change="emitValue" placeholder="code"/>
            <b-input v-model="arrData[index].name" style="width: 40%;" @on-change="emitValue" placeholder="name"/>
          </div>
        </div>
      </div>
    </div>
    <b-input v-model="total"/>
  </div>
</template>

<script>
  import { getValidValue } from './cfg-util'

  export default {
    name: 'ValidValue',
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        total: '',
        normalType: 'enum',
        dict: {
          name: '',
          code: ''
        },
        arrData: []
      }
    },
    computed: {
      isEnum() {
        return this.normalType === 'enum'
      },
      isDict() {
        return this.normalType === 'dict'
      }
    },
    watch: {
      value: {
        handler(val) {
          this.total = val
          let result = getValidValue(val)
          this.normalType = result.type // 设置类型
          if (this.isDict) { // 字典值设置字典
            this.dict.name = result.name
            this.dict.code = result.code
            this.arrData = []
          } else {
            this.arrData = result.data
            this.dict.name = ''
            this.dict.code = ''
          }
          console.log(result)
        },
        immediate: true
      }
    },
    methods: {
      // 更新model value
      emitValue() {
        let result = ''
        // 将数组拼接为原始字符串,过滤空值项
        if (this.normalType === 'enum') {
          let codes = []
          let names = []
          this.arrData.forEach(item => {
            codes.push(item.code)
            names.push(item.name)
          })
          // 拼接字符串 为[ 1/0;启用/禁用 ]
          result = this.arrData.length === 0 ? '' : (names.join('/') + ';' + codes.join('/'))
        }
        this.$emit('input', result)
        this.$emit('on-change', result)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .valid-value-wrap {
    width: 100%;
  }
</style>
