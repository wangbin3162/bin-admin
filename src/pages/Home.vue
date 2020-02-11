<template>
  <div class="home-wrap">
    <div class="index-wrap">
      <div class="logo">
        <img src="../assets/images/logo.png" height="54" width="233" alt="logo"/>
      </div>
      <div class="info">
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
        <pre>
          <code>
            - index
              - 首页工作台
            - 表单页
              - 基础表单页
              - 分步表单页
              - 高级表单页
            - 列表页
              - 查询表格
              - 标准列表
              - 卡片列表
              - 搜索列表（项目/应用/文章）
            - 详情页
              - 基础详情页
              - 高级详情页
            - 结果
              - 成功页
              - 失败页
            - 异常
              - 403 无权限
              - 404 找不到
              - 500 服务器出错
            - 个人页
              - 个人中心
              - 个人设置
            - 帐户
              - 登录
              - 注册
              - 注册成功
          </code>
        </pre>
        <h2>前序准备</h2>
        <p>你的本地环境需要安装 node 和 git。我们的技术栈基于 ES2015+、Vue.Js、Vuex、Vue-Router、bin-ui 和 element-ui，提前了解和学习这些知识会非常有帮助。</p>

        <h2>文档连接</h2>
        <p>
          <a class="link" href="https://github.com/wangbin3162/bin-admin.git" target="_blank">仓库地址</a>
          <a class="link" href="https://wangbin3162.github.io/bin-ui-doc/" target="_blank">bin-ui</a>
          <a class="link" href="https://element.eleme.cn/#/zh-CN/component/installation"
             target="_blank">element-ui</a>
          <a class="link" href="https://cn.vuejs.org/v2/guide/" target="_blank">Vue</a>
        </p>
      </div>
    </div>
  </div>
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

<style scoped lang="stylus">
  .full-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .index-wrap {
    .logo {
      padding: 50px;
      text-align: center;
    }
    .info {
      padding: 20px;
      color: #314659;
      font-size: 14px;
      line-height: 2;
      p, pre {
        padding: 12px 20px;
        margin: 16px 0;
        overflow: auto;
      }
      pre {
        border-radius: 2px;
        background: #f2f4f5;
        font-family: Lucida Console, Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
      }
      .link {
        padding: 0 10px;
      }
    }
  }
</style>
