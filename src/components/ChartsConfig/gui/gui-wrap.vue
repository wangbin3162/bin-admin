<template>
  <div class="gui-wrap" :class="{'disable':!visible && !simple}">
    <div class="wrap-name">
       <span class="wrap-arrow" v-if="$slots.default" @click="simpleToggle"
             :class="[{'show':visible},{'simple':simple}]">
          <b-icon name="ios-arrow-forward" size="14"></b-icon>
       </span>
      <slot name="title">
        <span class="wrap-label">{{ label }}</span>
      </slot>
      <span class="wrap-toggle" @click="toggleVisible" v-if="!simple">
        <b-icon :name="visible?'ios-eye':'ios-eye-off'" size="16"></b-icon>
      </span>
    </div>
    <collapse-transition>
      <div v-if="visible">
        <slot></slot>
      </div>
    </collapse-transition>
  </div>
</template>

<script>

  import CollapseTransition from 'bin-ui/src/components/base/collapse-transition'

  export default {
    components: { CollapseTransition },
    props: {
      label: String,
      value: Boolean,
      simple: Boolean
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      toggleVisible() {
        this.visible = !this.visible
        this.$emit('input', this.visible)
        this.$emit('change', this.visible)
      },
      simpleToggle() {
        if (this.simple) {
          this.visible = !this.visible
        }
        this.$emit('input', this.visible)
        this.$emit('change', this.visible)
      }
    },
    watch: {
      value: {
        handler(val) {
          this.visible = val
        },
        immediate: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .gui-wrap {
    position: relative;
    padding-left: 12px;
    &:after {
      content: "";
      position: absolute;
      top: 40px;
      left: 18px;
      bottom: 0;
      border-left: 1px solid rgba(40, 47, 58, 0.1);
    }
  }
  .wrap-name {
    line-height: 40px;
    .wrap-arrow {
      transition: transform .3s;
      &.show {
        transform: rotate(90deg);
      }
      &.simple {
        cursor: pointer;
      }
    }
    .wrap-label {
      padding: 0 5px 0 2px;
    }
    span {
      display: inline-block;
      vertical-align: top;
    }
    .wrap-toggle {
      cursor: pointer;
      .icon-ios-eye-off {
        color: #999;
      }
    }
    .iconfont {
      vertical-align: -1px;
    }
  }
</style>
