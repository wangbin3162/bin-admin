<template>
  <div class="edit-el-var">
    <b-form-item label="el表达式" prop="tplContent" :rules="{ required: true, message: 'el表达式不能为空', trigger: 'blur' }">
      <b-code-editor ref="editor" mode="" :readonly="true" :lint="false" v-model="elText" height="100px">
      </b-code-editor>
    </b-form-item>

    <b-form-item>
      <div class="con">
        <div class="left">
          <div style="width: 100%;">
            <div class="mb-20">
              <div class="mb-10" flex="main:justify">
                <h4 >操作面板</h4>

                <span>
                  <b-button type="text" text-color="danger" @click="handleClearBtn">清空</b-button>
                </span>
              </div>
              <div class="btn-group">
                <b-button-group class="row" v-for="(row, index) in btnList" :key="index">
                  <b-button v-for="(btn, index) in row" :key="index"
                    type="default" class="btn"
                    @click="handleBtn(btn)"
                    @mousedown.native="handleMouseDown(btn)"
                    @mouseup.native="handleMouseUp(btn)">
                    {{ btn }}
                  </b-button>
                </b-button-group>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="var-select-con">
            <div flex="main:justify">
              <h4 class="mb-10">变量</h4>
              <b-button type="text" plain style="margin-left: 5px;" size="small" @click="open = true">
                选择
              </b-button>
            </div>
            <div>
              <b-empty v-if="tempVarCodeList.length === 0">暂无已选变量</b-empty>
              <template v-else>
                <b-tag v-for="(varCode, index) in tempVarCodeList" :key="varCode" closable
                  :type="isCustcom(varCode) ? 'info' : 'primary'" size="small" class="tag"
                  @on-close="handleTagClose(index)"
                  @on-click="handleTagClick(varCode)">
                  {{ varCode }}
                </b-tag>
              </template>
            </div>
          </div>
        </div>
      </div>
    </b-form-item>

    <!-- 返回的参数：变量编码 -->
    <edit-select-var :open="open" @close="open = false"
      @choose-mul="handleVarChooseMul"></edit-select-var>

  </div>
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
        elText: '#{}',
        varMap: new Map(),
        customVarParamsMap: new Map(), // 存储由参数配置组件（EditParamManage）自定义添加的参数
        tempVarCodeList: [],
        varParams: [],
        editor: null,
        btnList: [
          ['(', ')', '\'', '#', '←', '/'],
          ['{', '}', '7', '8', '9', '*'],
          ['<', '>', '4', '5', '6', '-'],
          [':', '!', '1', '2', '3', '+'],
          ['?', '&', '0', '.', '%', '=']
        ]
      }
    },
    watch: {
      tempVarCodeList (newVal, oldVal) {
        const res = []
        const originList = JSON.parse(JSON.stringify(newVal))
        originList.forEach(paraCode => {
          if (!this.customVarParamsMap.get(paraCode)) res.push(paraCode) // 不是自定义参数则压入
        })
        this.$emit('var-change', res)
      },
      'elText': {
        handler (newVal, oldVal) {
          this.$emit('el-change', newVal)
        },
        immediate: true
      },
      varParams: {
        handler (newVal, oldVal) {
          this.$emit('var-params-change', this.$util.deepClone(newVal))
        },
        deep: true
      }
    },
    created () {
      this.$EventBus.$on('IndexVarEditParamManage-selected', param => {
        // 把自定义参数存入customVarParamsMap，用于判断tempVarCodeList中的数据是否是自定义参数。
        this.customVarParamsMap.set(param.paraCode, param)

        const customVarObj = {
          varCode: param.paraCode,
          params: [this.customVarParamsMap.get(param.paraCode)]
        }

        this.varMap.set(customVarObj.varCode, customVarObj)
        this.buildResData()
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      handleBtn (str) {
        if (str === '←') {
          this.editor.execCommand('delCharBefore')
        } else {
          this.editor.replaceSelection(str)
        }
      },
      // 变量选择组件回调
      handleVarChooseMul (varList) {
        varList.forEach(newItem => {
          this.varMap.set(newItem.varCode, newItem)
        })
        this.buildResData()
      },
      // tag关闭回调
      handleTagClose (index) {
        const elArr = this.tempVarCodeList.splice(index, 1)

        const reg = new RegExp(' ' + elArr[0] + ' ', 'g')
        const str = this.elText.replace(reg, '')
        this.editor.setValue(str)
        this.editor.setCursor(0, this.elText.length - 1)

        this.varMap.delete(elArr[0]) // 删除map中对应的变量
        this.buildResData() // 根据varMap构建返回数据
      },
      // tag点击回调
      handleTagClick (text) {
        this.editor.replaceSelection(` ${text} `)
      },
      // 退格按钮的回调
      handleBackspaceBtn (str) {
        if (str === '←') this.editor.execCommand('delCharBefore')
      },
      handleMouseDown (str) {
        if (str === '←') {
          this.timer = setInterval(() => {
            this.editor.execCommand('delCharBefore')
          }, 70)
        }
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
      /**
       * @author haodongdong
       * @description 根据选择的变量构建需要返回出组件的外的数据
       */
      buildResData () {
        // 产生本身tag的list
        const tempVarCodeList = []
        const varParams = []
        for (const item of this.varMap.values()) {
          tempVarCodeList.push(item.varCode)
          item.params.forEach(newParam => {
            // 不是自定义参数则添加来源
            if (!newParam.custom) newParam.paraSource = item.varCode
            // 在map中的数据都设置禁用属性，不允许参数配置组件修改
            newParam.disabled = true

            const isExistParam = varParams.find(oldParam => oldParam.paraCode === newParam.paraCode)
            // 存在则给paraSource追加所属的varCode，不存在则新增
            if (isExistParam) {
              isExistParam.paraSource += ',' + newParam.paraSource
            } else {
              varParams.push(newParam)
            }
          })
        }
        this.tempVarCodeList = tempVarCodeList
        this.varParams = varParams
      },
      /**
       * @author haodongdong
       * @description 检查是否是自定义变量
       * @param {String} paraCode 参数编码
       */
      isCustcom (paraCode) {
        let res = false
        if (this.customVarParamsMap.get(paraCode)) res = true
        return res
      },
      init () {
        this.editor = this.$refs.editor.jsonEditor

        if (this.initData) {
          this.tempVarCodeList = this.initData.tempVarCodeList
          this.editor.setValue(this.initData.elText)
          this.editor.setCursor(0, this.elText.length - 1)
          const params = [] // 存放还原多来源参数后的param
          const paramsCopy = this.$util.deepClone(this.initData.params)
          // 还原多来源参数为与来源一对一形式的param，如果为其中由自定义参数则直接还原为对应的变量对象存入map
          paramsCopy.forEach(param => {
            // 不为null表示非自定义参数，用于还原多来源参数
            if (param.paraSource) {
              const paraSourceArr = param.paraSource.split(',')
              paraSourceArr.forEach(paraSource => {
                const copy = this.$util.deepClone(param)
                copy.paraSource = paraSource
                params.push(copy)
              })
            } else {
              // 这里构建自定义参数的map
              param.custom = true
              const customVarObj = {
                varCode: param.paraCode,
                params: [param]
              }
              this.customVarParamsMap.set(param.paraCode, param)
              this.varMap.set(customVarObj.varCode, customVarObj)
            }
          })
          // 还原非自定义param为对应于变量的对象，存入map
          this.tempVarCodeList.forEach(varCode => {
            const varParams = []
            params.forEach(param => { // 查找属于当前varCode变量的param，然后存入数组
              if (param.paraSource === varCode) varParams.push(param)
            })
            const varObj = {
              varCode,
              params: varParams
            }
            this.varMap.set(varObj.varCode, varObj)
          })
          this.buildResData()
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
      // border: 1px solid #f0f0f0;

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        padding-right: 16px;
        border-right: 1px solid #f0f0f0;

        .btn-group {
          display: flex;
          flex-direction: column;

          .row {
            display: flex;

            &:not(:first-child) {
              margin-top: -1px;
            }
            .btn {
              flex: 1;
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
