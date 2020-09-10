<template functional>
  <div :class="props.type">
    <div class="input-label">
      {{ props.label }}
      <b-tooltip v-if="props.tip" :content="props.tip">
        <b-icon name="ios-help-circle-outline" style="vertical-align: -1px;"></b-icon>
      </b-tooltip>
    </div>
    <slot></slot>
  </div>
</template>
