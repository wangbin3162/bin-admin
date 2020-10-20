<template>
  <div class="conditions-wrap">
    <div class="ctrl-item" v-for="(item,index) in conditionList" :key="item.id">
      <b-popover title="过滤条件" :content="item.fieldTitle" placement="top-start" trigger="hover" style="width: 100%;">
        <div class="input">
          <template v-if="item.controlType==='SELECT'">
            <b-select v-model="editList[index].value" multiple :max-tag-count="1" size="small"
                      :placeholder="item.fieldTitle" @change="emitValue">
              <b-option v-for="(val,key) in item.options" :key="key" :value="key" :label="val"></b-option>
            </b-select>
          </template>
          <template v-else>
            <b-date-picker type="daterange" :value="formatTimeRange(editList[index].value)" separator=" ~ "
                           :placeholder="item.fieldTitle"
                           @change="val=>{ timeChange(val,index) }" size="small"
                           @clear="timeChange(['',''],index)"
            ></b-date-picker>
          </template>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
import { deepCopy, isNotEmpty } from '@/common/utils/assist'
import { getDictItems } from '@/api/excavate-analyze/excavate-cfg.api'

export default {
  name: 'RenderFilter',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    conditions: { // 条件渲染原始数组
      type: Array,
      required: true
    }
  },
  data() {
    return {
      conditionList: [], // 请求缓存下拉框内容
      editList: []
    }
  },
  created() {
    this.initList()
  },
  watch: {
    value: {
      handler(val) {
        this.editList = deepCopy(val)
      },
      immediate: true
    }
  },
  methods: {
    initList() {
      this.conditionList = deepCopy(this.conditions)
      this.conditionList.forEach((item, index) => {
        if (item.fieldType === 'dict' && isNotEmpty(item.validValue)) {
          let dict = item.validValue.split('/')[1]
          if (dict) {
            // 获取字典项
            getDictItems(dict).then(resp => {
              if (resp.data.code === '0') {
                let map = {}
                let result = resp.data.data || []
                result.forEach(i => {
                  map[i.code] = i.name
                })
                let object = { ...item, options: map }
                this.$set(this.conditionList, index, object) // 扩展字典映射
              }
            })
          }
        }
      })
    },
    formatTimeRange(value) {
      let { gte, lt } = value
      let from = gte || ''
      let to = lt || ''
      return [from, to]
    },
    timeChange(value, index) {
      this.editList[index].value = { gte: value[0], lt: value[1] }
      this.emitValue()
    },
    // 更新model值
    emitValue() {
      this.$emit('input', this.editList)
      this.$emit('change', this.editList)
    }
  }
}
</script>

<style lang="stylus">
.conditions-wrap {
  padding: 0 8px;
  margin-bottom: 16px;
  .bin-popover, .bin-popover-rel {
    width: 100%;
  }
  .ctrl-item {
    display: inline-flex;
    align-items: center;
    padding-right: 16px;
    width: 20%;
    .input {
      width: 100%;
    }
  }
}
</style>
