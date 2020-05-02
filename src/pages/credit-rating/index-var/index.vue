<template>
  <div>
    Hello World
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'

  export default {
    name: 'IndexVar',
    mixins: [commonMixin, permission]
  }
</script>
