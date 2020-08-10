<template>
  <div class="search-input">
    <div class="input__label">
      <svg-icon icon-class="linechart" style="width: 28px;height: 28px;"/>
      <span>挖掘分析</span>
    </div>
    <div class="input__content">
      <b-input v-model.trim="keyword" placeholder="请输入您想查询的关键词" size="large"
               @on-change="change" @on-enter="handleSearch">
        <span slot="suffix" class="search-btn" @click="handleSearch">
          查 询
        </span>
      </b-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResSearch',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.keyword = newVal
      },
      immediate: true
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.keyword)
    },
    change(e) {
      this.$emit('input', e.target.value.trim())
    }
  }
}
</script>

<style scoped lang="stylus">
.search-input {
  width: 100%;
  margin-bottom: 12px;
  .input__label {
    display: flex;
    align-items: center;
    line-height: 32px;
    font-size: 18px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, .65);
    .svg-icon {
      color: rgba(0, 0, 0, .45);
      margin-right: 4px;
    }
  }
  .input__content {
    .search-btn {
      cursor: pointer;
      color: #1089ff;
      display: inline-block;
      vertical-align: middle;
      padding: 0 16px;
      border-left: 1px solid #eee;
      margin-top: 10px;
      background-color: #fff;
    }
  }
}
</style>
