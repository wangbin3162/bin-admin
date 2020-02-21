<template>
  <b-card :bordered="false" shadow="never">
    <h2>介绍</h2>
    <p>
      Bin Admin 是一个企业级中后台前端/设计解决方案，在基于BinUI 基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，
      进一步提升企业级中后台产品设计研发过程中的『用户』体验。随着业务逻辑的不断增加，我们将持续迭代，逐步沉淀和总结出更多设计模式和相应的代码实现，
      阐述中后台产品模板/组件/业务场景的最佳实践，也十分期待你的反馈。
    </p>
    <b-alert show-icon>
      本项目默认你有一定的 Vue 基础和 bin-ui , element-ui 使用经验,如果你对这些还不熟悉，我们建议你先查阅相关文档，下方会统一给出文档连接
    </b-alert>
    <p>
      我们基于上述目标和提供了以下的典型模板，并据此构建了一套基于 bin-ui 、element-ui 的中后台管理控制台的脚手架，它可以帮助你快速搭建企业级中后台产品原型。
    </p>
    <h2>前序准备</h2>
    <p>你的本地环境需要安装 node 和 git。我们的技术栈基于 ES2015+、Vue.Js、Vuex、Vue-Router、bin-ui 和 element-ui，提前了解和学习这些知识会非常有帮助。</p>

    <h2>文档连接</h2>
    <p>
      <a class="link" href="https://github.com/wangbin3162/bin-admin.git" target="_blank">仓库地址</a>&nbsp;
      <a class="link" href="https://wangbin3162.github.io/bin-ui-doc/" target="_blank">bin-ui</a>&nbsp;
      <a class="link" href="https://element.eleme.cn/#/zh-CN/component/installation"
         target="_blank">element-ui</a>&nbsp;
      <a class="link" href="https://cn.vuejs.org/v2/guide/" target="_blank">Vue</a>&nbsp;
    </p>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['userInfo'])
    }
  }
</script>
