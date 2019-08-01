<template>
  <!--查询条件容器插入filter-item组件-->
  <div class="filter-container">
    <div class="row">
      <slot>
      </slot>
    </div>
    <collapse-transition>
      <div v-show="isOpened">
        <div class="row" v-if="$slots.more">
          <slot name="more"></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
  import CollapseTransition from 'bin-ui/src/components/base/collapse-transition'

  export default {
    name: 'VFilterBar',
    components: { CollapseTransition },
    props: {
      isOpened: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
