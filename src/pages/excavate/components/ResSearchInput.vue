<template>
  <div class="search-input-wrap">
    <div class="input__content">
      <label>
        <input v-model.trim="keyword" placeholder="资源名称"
               @keyup.enter="handleSearch" @input="handleInput"/>
      </label>
      <span class="btn" @click="handleSearch">查询</span>
    </div>
    <transition name="fade-in-linear">
      <div class="res__list" v-if="showList" v-click-out-side="clickOutSide">
        <div v-for="item in resourceList" :key="item.resourceKey"
             class="list-item" @click="handleClickResource(item)"
        >
          {{ item.resourceName }}
        </div>
        <b-empty v-if="resourceList.length===0"></b-empty>
        <b-loading fix show-text="查询中..." v-show="loading"></b-loading>
      </div>
    </transition>
  </div>
</template>

<script>
import { getResList } from '@/api/excavate.api'

export default {
  name: 'ResSearchInput',
  data() {
    return {
      keyword: '',
      resourceList: [],
      showList: false,
      loading: false
    }
  },
  methods: {
    getList() {
      this.showList = true
      this.loading = true
      this.resourceList = []
      getResList(this.keyword).then(resp => {
        let results = resp.data.rows || []
        this.resourceList = results.length > 5 ? results.splice(0, 5) : results
        this.loading = false
      })
    },
    handleInput(e) {
      if (e.target.value === '') {
        this.showList = false
      }
    },
    clickOutSide() {
      if (this.showList) {
        this.showList = false
      }
    },
    handleSearch() {
      this.getList()
    },
    handleClickResource(item) {
      // 先从地址栏拉取请求
      let { resourceKey } = this.$route.query
      if (resourceKey === item.resourceKey) {
        this.$message({ type: 'warning', content: '当前资源无需跳转！' })
        this.showList = false
        return
      }

      this.showList = false
      this.keyword = ''
      this.$router.replace({ name: 'RenderPage', query: item })
    }
  }
}
</script>

<style scoped lang="stylus">
.search-input-wrap {
  position relative;
  width: 300px;
  margin: 0 24px;
  .input__content {
    position: relative;
    input {
      display: inline-block;
      width: 100%;
      height: 32px;
      line-height: 1.5715;
      padding: 0 68px 0 12px;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, .15);
      border-radius: 2px;
      color: rgba(255, 255, 255, 0.65);
      background-color: rgba(255, 255, 255, .15);
      background-image: none;
      position: relative;
      cursor: text;
      &:focus {
        outline: none;
      }
      // Safari and Chrome
      &::-webkit-input-placeholder {
        color: #f1f1f1;
      }
      &::-moz-placeholder {
        color: #f1f1f1;
        opacity: 1;
      }
      // Internet Explorer 10+
      &:-ms-input-placeholder {
        color: #f1f1f1;
      }
    }
    .btn {
      position: absolute;
      top: 6px;
      right: 1px;
      cursor: pointer;
      color: #f1f1f1;
      display: inline-block;
      vertical-align: middle;
      padding: 0 16px;
    }
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      bottom: 10px;
      right: 60px;
      width: 1px;
      background-color: #f1f1f1;
    }
  }
  .res__list {
    position absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    max-height: 160px;
    background-color: #fff;
    transform: translate(0, 100%);
    border-radius: 0 0 2px 2px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .25);
    padding: 5px 0;
    .list-item {
      cursor: pointer;
      padding: 0 12px;
      line-height: 30px;
      transition: background-color .2s;
      &:hover {
        background-color: #cee6ff;
      }
    }
  }
}
</style>
