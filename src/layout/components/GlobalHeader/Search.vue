<template>
  <div class="header-top-search">
    <b-icon name="md-search" size="20" @click.native="showInput=!showInput"></b-icon>
    <transition name="zoom-in-center">
      <div class="header-top-search-input" v-if="showInput">
        <b-select filterable>
          <b-option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</b-option>
        </b-select>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      showInput: true,
      menuList: []
    }
  }
}
</script>

<style lang="stylus">
.header-top-search {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  .header-top-search-input {
    display: inline-block;
    width: 220px;
    padding: 0 12px;
    .bin-select-selection {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #d9d9d9;
    }
    .bin-select-visible .bin-select-selection {
      box-shadow: none;
    }
  }
}
</style>
