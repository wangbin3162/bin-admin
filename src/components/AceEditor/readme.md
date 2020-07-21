ace-editor
====================

A packaging of [ace](https://ace.c9.io/)

## 如何使用

1. Install

    ```
    npm install --save-dev bin-ace-editor
    ```
    
2. Require it in `components` of Vue options

    ```js
    {
        data,
        methods,
        ...
        components: {
            editor: require('bin-ace-editor'),
        },
    }
    ```
 
3. Require the editor's mode/theme module in custom methods
    
    ```js
    {
        data,
        methods: {
            editorInit: function () {
                require('brace/ext/language_tools') //language extension prerequsite...
                require('brace/mode/html')                
                require('brace/mode/javascript')    //language
                require('brace/mode/less')
                require('brace/theme/chrome')
                require('brace/snippets/javascript') //snippet
            }
        },
    }
    ```
    
4. Use the component in template

    ```html
    <editor v-model="content" @init="editorInit" lang="html" theme="chrome" width="500" height="100"></editor>
    ```
    
    prop `v-model`  is required
    
    prop `lang` and `theme` is same as [ace-editor's doc](https://github.com/ajaxorg/ace)
    
    prop `height` and `width` could be one of these:  `200`, `200px`, `50%`
    
5. Access the ACE's instance

    `<editor ref='myEditor'>`

    `let editor = this.$refs.myEditor.editor`
    
    or
    
    ```
    editorInit: function (editor) {
    
    }
    ```
    
