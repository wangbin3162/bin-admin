<template>
  <b-col :xs="20" :sm="20" :md="12" :lg="8" :xl="6" :xxl="6">
    <div class="filter-item">
      <span class="label" v-if="showLabel" :style="{width:labelWidth}">{{ title }}</span>
      <slot>
        <!--默认插槽，用于插入查询条件，如不插入则生成查询按钮，生成查询按钮需要传入是否需要显示展开按钮并传入状态-->
        <div class="search-btn">
          <b-button size="small" type="primary" @click="handleFilter" v-waves>
            &nbsp;查&nbsp;询&nbsp;
          </b-button>
          <b-button size="small" @click="handleReset" v-waves>
            &nbsp;重&nbsp;置&nbsp;
          </b-button>
          <template v-if="showToggle">
        <span class="open" @click.stop="filterToggle">
          {{ isOpened?'收起':'展开' }}
          <b-icon :name="openBtnStyle"></b-icon>
        </span>
          </template>
        </div>
      </slot>
    </div>
  </b-col>
</template>

<script>
  export default {
    name: 'VFilterItem',
    props: {
      title: {
        type: String,
        default: null
      },
      labelWidth: {
        type: String
      },
      showToggle: {
        type: Boolean
      },
      isOpened: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleFilter() {
        this.$emit('on-search')
      },
      handleReset() {
        this.$emit('on-reset')
      },
      filterToggle() {
        this.$emit('on-toggle')
      }
    },
    computed: {
      openBtnStyle() {
        return this.isOpened ? 'ios-arrow-up' : 'ios-arrow-down'
      },
      showLabel() {
        return this.title && this.title.length > 0
      }
    }
  }
</script>

<style scoped lang="stylus">
  .filter-item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 4px;
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 39.9999px;
    list-style: none;
    font-feature-settings: "tnum";
    margin: 0 0 15px;
    vertical-align: top;
    .label {
      min-width: 80px;
      text-align: right;
      overflow: hidden;
      line-height: 40px;
      white-space: nowrap;
      vertical-align: middle;
      &:after {
        content: ":";
        position: relative;
        top: -.5px;
        margin: 0 8px 0 2px;
      }
    }

    .search-btn {
      width: 100%;
      .open {
        display: inline-block;
        margin-left: 10px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #337ab7;
        }
      }
    }
  }
</style>
