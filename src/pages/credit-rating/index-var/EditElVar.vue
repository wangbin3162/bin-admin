<template>
  <b-collapse-wrap title="变量计算" collapse class="edit-el-var">
    <div class="con">
      <div class="left">
        <div style="width: 100%;">
          <div class="mb-20">
            <div flex="main:justify">
              <h4 class="mb-10">变量</h4>
              <b-button type="text" plain style="margin-left: 5px;" size="small" @click="open = true">
                选择
              </b-button>
            </div>
            <div>
              <b-empty v-if="tempVarCodeList.length === 0">暂无已选变量</b-empty>
              <template v-else>
                <b-tag v-for="(item, index) in tempVarCodeList" :key="item" closable
                  type="info" size="small" class="tag"
                  @on-close="handleTagClose(index)"
                  @on-click="handleTagClick(item)">
                  {{ item }}
                </b-tag>
              </template>
            </div>
          </div>
          <div class="mb-20">
            <h4 class="mb-10">条件</h4>
            <div flex>
              <div class="btn-group" style="width: 80%;">
                <b-button-group class="row" style="display: flex" v-for="(row, index) in btnList.slice(0, 2)" :key="index">
                  <b-button v-for="(btn, index) in row" :key="index"
                    type="default" class="btn" style="flex: 1"
                    @click="handleBtn(btn)">
                    {{ btn }}
                  </b-button>
                </b-button-group>
              </div>
              <b-button type="default" style="margin-left: -1px; width: 20%; height: 79px;"
                @click="handleBtn('=')">
                =
              </b-button>
            </div>
          </div>
          <div class="mb-20">
            <h4 class="mb-10">运算符号</h4>
            <div class="btn-group">
              <b-button-group class="row" v-for="(row, index) in btnList.slice(2)" :key="index">
                <b-button v-for="(btn, index) in row" :key="index"
                  type="default" class="btn"
                  @click="handleBtn(btn)">
                  {{ btn }}
                </b-button>
              </b-button-group>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="mb-10" flex="main:justify">
          <h4>EL表达式</h4>

          <span>
            <b-button type="text"
              @click="handleBackspaceBtn"
              @mousedown.native="handleMouseDown"
              @mouseup.native="handleMouseUp">
              退格
            </b-button>
            <b-button type="text" text-color="danger" @click="handleClearBtn">清空</b-button>
          </span>
        </div>

        <b-form ref="form" :model="form">
          <b-form-item prop="elText" :rules="{ required: true, message: 'el表达式不能为空', trigger: 'blur' }">
            <b-code-editor ref="editor" mode="" :readonly="true" :lint="false" v-model="form.elText">
            </b-code-editor>
          </b-form-item>
        </b-form>
      </div>
    </div>

    <!-- 返回的参数：变量编码 -->
    <edit-select-var :open="open" @close="open = false"
      @choose-mul="handleVarChooseMul"></edit-select-var>
  </b-collapse-wrap>
</template>

<script>
  import EditSelectVar from './EditSelectVar'

  export default {
    name: 'EditElVar',
    props: [
      'initData'
    ],
    components: {
      EditSelectVar
    },
    data () {
      return {
        timer: null,
        open: false,
        curCursor: 0, // 表达式输入框当前光标位置
        form: {
          elText: '#{}'
        },
        tempVarCodeList: [],
        editor: null,
        btnList: [
          ['<', '>', ':', '!'],
          ['?', '&', '|', '#'],
          ['{', '7', '8', '9', '+'],
          ['}', '4', '5', '6', '-'],
          ['(', '1', '2', '3', '*'],
          [')', '0', '.', '%', '/']
        ]
      }
    },
    watch: {
      tempVarCodeList (newVal, oldVal) {
        this.$emit('var-change', JSON.parse(JSON.stringify(newVal)))
      },
      'form.elText' (newVal, oldVal) {
        this.$emit('el-change', newVal)
      }
    },
    created () {

    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      handleBtn (str) {
        this.editor.replaceSelection(str)
      },
      // 变量选择组件回调
      handleVarChooseMul (tempVarCodeList) {
        this.tempVarCodeList = [...new Set([...this.tempVarCodeList, ...tempVarCodeList])]
      },
      // tag关闭回调
      handleTagClose (index) {
        const elArr = this.tempVarCodeList.splice(index, 1)
        const reg = new RegExp(' ' + elArr[0] + ' ', 'g')
        const str = this.form.elText.replace(reg, '')
        this.editor.setValue(str)
        this.editor.setCursor(0, this.form.elText.length - 1)
      },
      // tag点击回调
      handleTagClick (text) {
        this.editor.replaceSelection(` ${text} `)
      },
      // 退格按钮的回调
      handleBackspaceBtn () {
        this.editor.execCommand('delCharBefore')
      },
      handleMouseDown () {
        this.timer = setInterval(() => {
          this.editor.execCommand('delCharBefore')
        }, 100)
      },
      handleMouseUp () {
        clearInterval(this.timer)
      },
      // 清空按钮回调
      handleClearBtn () {
        this.editor.setValue('#{}')
        this.editor.setCursor(0, 2)
      },
      validate () {
        this.$refs.form.validate()
      },
      init () {
        this.editor = this.$refs.editor.jsonEditor

        if (this.initData) {
          this.tempVarCodeList = this.initData.tempVarCodeList
          this.editor.setValue(this.initData.elText)
          this.editor.setCursor(0, this.form.elText.length - 1)
        } else {
          this.editor.setCursor(0, 2)
        }
      }
    }
  }
</script>

<style>
  .edit-el-var .left .bin-button:focus {
    box-shadow: none;
  }
  .edit-el-var .left .bin-button:focus {
    color: #0d85ff;
    border-color: #0d85ff;
    z-index: 1;
  }
</style>

<style lang="stylus" scoped>
  .edit-el-var {
    .con {
      display: flex

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
        padding-right: 16px;
        border-right: 1px solid #f0f0f0;

        .btn-group {
          display: flex;
          flex-direction: column;

          .row {
            &:not(:first-child) {
              margin-top: -1px;
            }
            .btn {
              width: 20%;
              height: 40px;
            }
          }
        }

        .tag {
          cursor: pointer;
        }
      }
      .right {
        flex: 1;
        padding-left: 16px;
      }
    }
  }
</style>
