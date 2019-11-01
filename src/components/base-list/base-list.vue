<template>
  <div class="list-wrap">
    <div class="list">
      <div class="total">为您找到<em>{{ total }}</em>家企业</div>
    </div>
    <div class="page"></div>
  </div>
</template>

<script>
  export default {
    name: 'base-list',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      total: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list-wrap {

  }
  .list {
    width: 1300px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #eee;
    em {
      color: red;
      font-style: normal;
    }
    .total {
      padding: 10px 20px;
    }
  }
</style>
