export const javascriptStr = `let a = 0;
function add(){
  a ++;

}
add();
console.log(a);`

export const markdownStr = `# 一级标题

## Markdown模式编辑

  - 编辑器可以支持多种语言
  - 支持多种样式皮肤
  - 支持多种参数设置

## 安装

\`\`\`bash

# 安装依赖
npm install b-code-editor

# 启动项目
npm run serve
\`\`\`
`

export const sqlStr = 'SELECT * from sys_user where user_name = \'test\''

export const javaStr = `public class Test {
    public static void main(String[] args) {
        System.out.println("hello word");
    }
}`

export const elixirStr = `{
 "query": {
      "bool": {
        {{#gatherDept}}
        "filter": {
          {{#isDomain}}
          "prefix": {
            "create_dept": "{{gatherDept}}"
          }
          {{/isDomain}}
          {{^isDomain}}
          "term": {
            "create_dept": {
              "value": "{{gatherDept}}"
            }
          }
          {{/isDomain}}
        },
        {{/gatherDept}}
        "must": [
          {
            "term": {
              "flag": {
                "value": "1"
              }
            }
          }
        ]
      }
    },
  "size": 0,
  "aggs": {
    "date_filter": {
      "filter": {
        "range": {
          "create_date": {
            "format": "yyyy-MM",
            "gte": "{{startDate}}",
            "lte": "{{endDate}}"
          }
        }
      },
      "aggs": {
        "month_count": {
          "date_histogram": {
            "field": "create_date",
            "format": "yyyy-MM",
            "calendar_interval": "month",
            "min_doc_count": 0,
            "extended_bounds": {
              "min": "{{startDate}}",
              "max": "{{endDate}}"
            }
          }
        }
      }
    }
  }
}`

export const htmlStr = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>测试</title>
<style>
  h1{
    color:red;
  }
</style>
</head>
<body>
    <h1>我是一个标题</h1>
    <p>我是一个段落。</p>
</body>
</html>`

export const cssStr = `.test{
  font-size: 12px;
}`

export const stylusStr = `.test{
  font-size: 12px;
  .child{
    border: 1px solid #1089ff;
  }
}`
