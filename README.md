# bin-admin-pro 3.0

[预览](https://wangbin3162.gitee.io/bin-admin/)

本项目是基于 Vue2.6，配合使用 [bin-ui](https://github.com/wangbin3162/bin-ui/) 作为组件库来进行搭建wcm后台管理系统，在基于[vue-admin1.0](https://github.com/wangbin3162/vue-admin/)
版本基础上进行二次重构，增加了登录的token验证和简单主题配置功能，现在已更新至Pro3.0版本，参照ant-design-pro重新构建的3.0系统

[bin-ace-editor](https://gitee.com/wangbin3162/bin-ace-editor/) 

[bin-charts](https://gitee.com/wangbin3162/bin-charts/)

部分截图
![首页](/docs/images/index.png)

![主题设置和全局设置](/docs/images/black.png)

![bin-ace-editor](/docs/images/bin-ace-editor.png)

![charts](/docs/images/charts.png)

![图表设计器](/docs/images/chart-cfg.png)

![表单设计器](/docs/images/form-marking.png)

![表单预览](/docs/images/form-preview.png)

![流程图](/docs/images/bpmj.png)

## 目录结构

整个项目的目录结构如下，具体包含内容后续会进行详细介绍和解释

    ├── docs                       // 文档目录
    ├── public                     // 公共资源，第三方,不打包资源
    ├── src                        // 源代码
    │   ├── api                    // 所有请求相关资源
    │   ├── assets                 // 静态资源，会打包的资源
    │   ├── common                 // 通用配置，工具，mixins
    │   ├── components             // 全局公用组件
    │   ├── layouts                // 全局布局模块
    │   ├── mock                   // mock server 数据
    │   ├── pages                  // pages 视图显示（错误页面，布局，登录）
    │   ├── plugin                 // 自定义插件，注入指令，全局mixin
    │   ├── router                 // 路由
    │   ├── store                  // 全局 store 
    │   ├── App.vue                // 入口页面
    │   └── main.js                // 入口文件 加载组件 初始化等
    ├── .eslintrc.js               // eslint 配置项
    ├── .gitignore                 // git 忽略项
    ├── babel.config.js            // babel 配置项
    ├── vue.config.js              // vue-cli3集成配置项
    └── package.json               // package.json
    
    
## 安装

```bash
# 克隆项目
git clone https://github.com/wangbin3162/bin-admin.git

# 安装依赖
npm install

# 本地开发 启动项目
npm run serve
# OR vue ui 图形化界面启动
vue ui
```
