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
        <draggable v-model="arrData"
                   handle=".move-drag"
                   v-bind="{ animation: 200,group: 'enum', disabled: false, ghostClass:'ghost' }"
                   @change="onChange">
          <transition-group name="fade" tag="div" class="enum-list">
            <div v-for="(item,index) in arrData" :key="index" class="enum-item">
              <span class="move-drag"><b-icon name="ios-menu" size="20"/></span>
              <b-input v-model.trim="arrData[index].code" style="width: 40%;" @on-change="emitValue" placeholder="code"/>&nbsp;
              <b-input v-model.trim="arrData[index].name" style="width: 40%;" @on-change="emitValue" placeholder="name"/>&nbsp;
              <span class="remove" @click="removeEnumItem(index)">
              <b-icon name="ios-remove-circle-outline" size="22" color="#f5222d"/>
            </span>
            </div>
          </transition-group>
        </draggable>
        <b-button type="text" @click="addNewEnum">添加项</b-button>
      </div>
    </div>
    <b-input v-model="total" readonly/>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { getValidValue } from './cfg-util'
  import { deepCopy } from '../../../../../common/utils/assist'

  export default {
    name: 'ValidValue',
    components: { Draggable },
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
      },
      // 添加一项枚举
      addNewEnum() {
        this.arrData.push({ code: '', name: '' })
        this.emitValue()
      },
      // 删除一项枚举
      removeEnumItem(index) {
        this.arrData.splice(index, 1)
        this.emitValue()
      },
      onChange(event) {
        if (event.moved) {
          let { oldIndex, newIndex } = event.moved
          // 复制一个data
          let arr = deepCopy(this.arrData)
          let temp1 = deepCopy(arr[oldIndex])
          arr[oldIndex] = deepCopy(arr[newIndex])
          arr[newIndex] = temp1
          this.arrData = arr
          this.emitValue()
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .valid-value-wrap {
    width: 100%;
  }
  .enum-list.flip-list-move {
    transition: transform 1s;
  }
  .enum-item {
    box-sizing: border-box;
    border: 1px dashed transparent;
    border-radius: 2px;
    margin-bottom: 10px;
    .move-drag {
      cursor: move;
      padding: 0 6px 0 2px;
    }
    .remove {
      cursor: pointer;
    }
    &.ghost {
      position: relative;
      font-size: 0;
      border: 1px dashed #1089ff;
      height: 50px;
      &::after {
        position: absolute;
        content: '';
        background: #fff;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>
