<template>
  <div class="flow-wrap">
    <div class="inner" v-if="transmitKind==='FILE'">
      <div class="source">
        <img src="../../../../../assets/images/liucheng/folder.png" height="64" width="64" alt=""/>
        <h2>源节点：{{ source }}</h2>
      </div>
      <div class="arrow">
        <img src="../../../../../assets/images/liucheng/left.png" height="26" width="305" alt=""/>
      </div>
      <div class="source">
        <img src="../../../../../assets/images/liucheng/file.png" height="64" width="64" alt=""/>
        <h2>信息流向：{{ flowDirection }}</h2>
      </div>
      <div class="arrow">
        <img src="../../../../../assets/images/liucheng/left.png" height="26" width="305" alt=""/>
      </div>
      <div class="source">
        <img src="../../../../../assets/images/liucheng/platform.png" height="64" width="64" alt=""/>
        <h2>目标节点：{{ target }}</h2>
      </div>
    </div>
    <div class="inner" v-else>
      <div class="source">
        <img src="../../../../../assets/images/liucheng/database.png" height="64" width="64" alt=""/>
        <h2>源节点：{{ source }}</h2>
      </div>
      <div class="arrow">
        <img src="../../../../../assets/images/liucheng/left.png" height="26" width="305" alt=""/>
      </div>
      <div class="source">
        <img src="../../../../../assets/images/liucheng/file.png" height="64" width="64" alt=""/>
        <h2>信息流向：{{ flowDirection }}</h2>
      </div>
      <div class="arrow">
        <img src="../../../../../assets/images/liucheng/left.png" height="26" width="305" alt=""/>
      </div>
      <div class="source">
        <img src="../../../../../assets/images/liucheng/database.png" height="64" width="64" alt=""/>
        <h2>目标节点：{{ target }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FlowChart',
    props: {
      source: String,
      target: String,
      flowDirection: String,
      transmitKind: String
    }
  }
</script>

<style scoped lang="stylus">
  .flow-wrap {
    padding: 24px;
    background: #fafafa;
    margin-bottom 24px;
    overflow: hidden;
    .inner {
      padding: 0 50px;
      display flex;
      justify-content: center;
      .source {
        display flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .arrow {
        padding: 20px 10px;
        text-align: center;
      }
      h2 {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
</style>
