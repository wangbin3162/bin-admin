<template>
  <div class="icon-btn">
    <!-- <b-tooltip v-if="obj.redBlack !== undefined"
      :content="obj.redBlack === '1' ? '存在于红名单中': '存在于黑名单中'"
      placement="top-start">
      <svg-icon
        icon-class="assignment-ind" class="icon"
        :class="{ red: obj.redBlack === '1' }">
      </svg-icon>
    </b-tooltip> -->

    <template v-if="obj.supervise === '1'">
      <b-tooltip content="已监管" placement="top-start">
        <svg-icon icon-class="visibility"
          class="icon supervision on"
          @click.native="handleSupervision(obj.supervise)">
        </svg-icon>
      </b-tooltip>
    </template>

    <template v-else>
      <b-tooltip content="未监管" placement="top-start">
        <svg-icon icon-class="visibility off"
          class="icon supervision"
          @click.native="handleSupervision(obj.supervise)">
        </svg-icon>
      </b-tooltip>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'IconBtn',
    props: {
      obj: {
        type: Object,
        required: true
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
