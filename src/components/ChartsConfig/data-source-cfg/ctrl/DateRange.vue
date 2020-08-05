<template>
  <div class="date-range">
    <div class="date-item" v-for="(item,index) in rangeList" :key="index">
      <span class="label">区间{{ index+1 }}</span>
      <b-date-picker type="daterange" :value="rangeList[index]"
                     style="width: 220px;"
                     @on-change="(val)=>{ dateChange(val,index)}"
                     separator=" ~ " placeholder="选择日期区间"></b-date-picker>
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
  export default {
    name: 'DateRange',
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
          this.rangeList = val ? val.map(i => ([i.from, i.to])) : []
        },
        immediate: true
      }
    },
    methods: {
      addOne() {
        this.rangeList.push(['', ''])
        this.emitValue()
      },
      removeOne(index) {
        this.rangeList.splice(index, 1)
        this.emitValue()
      },
      dateChange(val, index) {
        this.rangeList[index] = val
        this.emitValue()
      },
      emitValue() {
        let list = this.rangeList.map(i => ({ from: i[0], to: i[1] }))
        this.$emit('input', list)
        this.$emit('on-change', list)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .date-range {
    padding: 0 12px;
    .date-item {
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
