<template>
  <div class="num-range">
    <div class="num-item" v-for="(item,index) in rangeList" :key="index">
      <span class="label">区间{{ index+1 }}</span>
      <b-input-number v-model="rangeList[index].from" size="small" @on-change="emitValue"/>
      <span class="label">—</span>
      <b-input-number v-model="rangeList[index].to" size="small" @on-change="emitValue"/>
      <span class="label">
        <b-icon name="ios-remove-circle-outline" color="#ff4d4f" style="cursor: pointer;"
                @click.native="removeOne(index)"/>
      </span>
    </div>
    <div class="btn">
      <b-button type="primary" dashed size="small" icon="ios-add-circle-outline" @click="addOne">添加</b-button>
    </div>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'NumRange',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        rangeList: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.rangeList = val ? deepCopy(val) : []
        },
        immediate: true
      }
    },
    methods: {
      addOne() {
        this.rangeList.push({ from: null, to: null })
        this.emitValue()
      },
      removeOne(index) {
        this.rangeList.splice(index, 1)
        this.emitValue()
      },
      emitValue() {
        this.$emit('input', this.rangeList)
        this.$emit('on-change', this.rangeList)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .num-range {
    padding: 0 12px;
    .num-item {
      padding-top: 4px;
      .label {
        margin: 0 8px;
      }
    }
    .btn {
      padding: 8px 12px;
    }
  }
</style>
