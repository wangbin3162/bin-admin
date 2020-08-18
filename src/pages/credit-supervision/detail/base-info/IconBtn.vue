<template>
  <div class="icon-btn">
    <template v-if="supervisionStatus !== undefined && supervisionStatus !== null">
      <template v-if="supervisionStatus === '1'">
        <b-tooltip content="已监管" placement="top-start">
          <svg-icon icon-class="visibility"
            class="icon supervision on"
            @click.native="handleSupervision(supervisionStatus)">
          </svg-icon>
        </b-tooltip>
      </template>

      <template v-else>
        <b-tooltip content="未监管" placement="top-start">
          <svg-icon icon-class="visibility off"
            class="icon supervision"
            @click.native="handleSupervision(supervisionStatus)">
          </svg-icon>
        </b-tooltip>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'IconBtn',
    props: {
      supervisionStatus: {
        type: String,
        default: null
      }
    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 监管按钮的回调
       * @param {string} supervise 是否监管
       */
      handleSupervision (supervise) {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .icon-btn {
    display: flex;

    .icon {
      margin-left: 15px;
      height: 26px;
      width: 26px;

      &.red {
        color: #ff5733;
      }

      &.supervision {
        cursor: pointer;
        &.on {
          color: #2bcfcf;
        }
      }
    }
  }
</style>
