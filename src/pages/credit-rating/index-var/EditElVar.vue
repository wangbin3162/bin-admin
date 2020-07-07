<template>
  <div class="edit-el-var">
    <b-form-item label="el表达式" prop="tplContent" :rules="{ required: true, message: 'el表达式不能为空', trigger: 'change' }"
      flex="cross:center">
      <slot></slot>
      <div class="el-exp">
        <draggable
          v-model="elList"
          v-bind="dragOptions"
          @start="handleDragStart"
          @end="handleDragEnd"
          @choose="handleDragChoose">

          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <span v-for="item in elList" :key="item.id"
              :class="{ actived: item.actived}" :style="{ color: item.color } ">{{ item.label }}</span>
          </transition-group>
        </draggable>
      </div>
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
                <b-button-group class="row" v-for="(row, index) in btnListEvo" :key="index">
                  <b-button v-for="(btn, index) in row" :key="index"
                    type="default" class="btn"
                    @click="handleBtn(btn)"
                    @mousedown.native="handleMouseDown(btn)"
                    @mouseup.native="handleMouseUp(btn)">
                    {{ btn.label }}
                  </b-button>
                </b-button-group>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="var-select-con">
            <div flex="main:justify">
              <h4 class="mb-10">已选变量</h4>
              <b-button type="text" plain style="margin-left: 5px;" size="small"
                @click="open = true" :disabled="initData !== null">
                选择
              </b-button>
            </div>
            <div>
              <b-empty v-if="tempVarCodeList.length === 0">暂无已选变量</b-empty>
              <template v-else>
                <b-tag v-for="(varCode, index) in tempVarCodeList" :key="varCode"
                  :type="isCustcom(varCode) ? 'info' : 'primary'"
                  size="small" class="tag"
                  :closable="initData === null"
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
  import draggable from 'vuedraggable'
  import EditSelectVar from './EditSelectVar'

  const color1 = '#21a8cc'
  const color2 = '#bfbfbf'
  const colorVar = '#569cd6'

  export default {
    name: 'EditElVar',
    props: [
      'initData'
    ],
    components: {
      draggable,
      EditSelectVar
    },
    data () {
      return {
        drag: false,
        setTimer: null,
        intTimer: null,
        open: false,
        curCursor: 0, // 表达式输入框当前光标位置
        curElListIndex: 1,
        elList: [
          { id: 1, label: '#', color: color1, actived: false },
          { id: 2, label: '{', color: color1, actived: true },
          { id: 3, label: '}', color: color1, actived: false }
        ],
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
        ],
        btnListEvo: [
          [
            { label: '(', color: color2, actived: false },
            { label: ')', color: color2, actived: false },
            { label: '\'', color: color2, actived: false },
            { label: '#', color: color1, actived: false },
            { label: '←', color: color2, actived: false },
            { label: '/', color: color2, actived: false }
          ],
          [
            { label: '{', color: color1, actived: false },
            { label: '}', color: color1, actived: false },
            { label: '7', color: color2, actived: false },
            { label: '8', color: color2, actived: false },
            { label: '9', color: color2, actived: false },
            { label: '*', color: color2, actived: false }
          ],
          [
            { label: '<', color: color2, actived: false },
            { label: '>', color: color2, actived: false },
            { label: '4', color: color2, actived: false },
            { label: '5', color: color2, actived: false },
            { label: '6', color: color2, actived: false },
            { label: '-', color: color2, actived: false }
          ],
          [
            { label: ':', color: color2, actived: false },
            { label: '!', color: color2, actived: false },
            { label: '1', color: color2, actived: false },
            { label: '2', color: color2, actived: false },
            { label: '3', color: color2, actived: false },
            { label: '+', color: color2, actived: false }
          ],
          [
            { label: '?', color: color2, actived: false },
            { label: '&', color: color2, actived: false },
            { label: '0', color: color2, actived: false },
            { label: '.', color: color2, actived: false },
            { label: '%', color: color2, actived: false },
            { label: '=', color: color2, actived: false }
          ]
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
      elList: {
        handler (newVal, oldeVal) {
          const strArr = []
          newVal.forEach(item => { strArr.push(item.label) })
          this.$emit('el-change', { elText: strArr.join(''), elJson: JSON.stringify(newVal) })
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
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        }
      }
    },
    created () {
      this.$EventBus.$on('IndexVarEditParamManage-selected', param => {
        // 把自定义参数存入customVarParamsMap，用于判断tempVarCodeList中的数据是否是自定义参数。
        this.customVarParamsMap.set(param.paraCode, param)

        const customVarObj = {
          varCode: param.paraCode,
          params: [param]
        }

        this.varMap.set(customVarObj.varCode, customVarObj)
        this.buildResData()
      })
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 拖拽组件选中多拽元素的回调
       * @param {Object} obj 回调参数
       * @param {number} obj.oldIndex 移动前的序号
       * @param {number} obj.newIndex 移动后的序号
       */
      handleDragChoose ({ oldIndex, newIndex }) {
        this.curElListIndex = oldIndex
        this.setActived(this.elList, this.curElListIndex)
      },
      /**
       * @author haodongdong
       * @description 拖拽组件拖动开始时的回调，设置drag为true，用于应用vue过度效果。
       */
      handleDragStart () {
        this.drag = true
      },
      /**
       * @author haodongdong
       * @description 拖拽组件拖动结束时的回调，设置drag为false，用于应用vue过度效果。
       * 并更新当前选中下标(curElListIndex)为拖拽后的位置
       */
      handleDragEnd ({ newIndex }) {
        this.curElListIndex = newIndex
        this.drag = false
      },
      handleBtn (btn) {
        if (btn.label === '←') {
          this.removeElFromElListByCurIndex()
        } else {
          const el = this.$util.deepClone(btn)
          el.id = new Date().getTime()
          this.addElToElListByCurIndex(el)
        }
      },
      // 变量选择组件回调
      handleVarChooseMul (varList) {
        varList.forEach(newItem => {
          newItem.params.forEach(param => { delete param.id }) // 后端要求处理id
          this.varMap.set(newItem.varCode, newItem)
        })
        this.buildResData()
      },
      handleMouseDown (btn) {
        if (btn.label === '←') {
          this.setTimer = setTimeout(() => {
            this.intTimer = setInterval(() => {
              this.removeElFromElListByCurIndex()
            }, 70)
          }, 300)
        }
      },
      handleMouseUp () {
        clearTimeout(this.setTimer)
        clearInterval(this.intTimer)
      },
      // 清空按钮回调
      handleClearBtn () {
        this.elList = [
          { id: 1, label: '#', color: color1, actived: false },
          { id: 2, label: '{', color: color1, actived: true },
          { id: 3, label: '}', color: color1, actived: false }
        ]
        this.curElListIndex = 1
      },
      // tag关闭回调
      handleTagClose (index) {
        const elArr = this.tempVarCodeList.splice(index, 1)

        const filteredArr = this.elList.filter(item => item.label !== elArr[0])
        this.elList = filteredArr

        this.varMap.delete(elArr[0]) // 删除map中对应的变量
        this.buildResData() // 根据varMap构建返回数据
      },
      // tag点击回调
      handleTagClick (text) {
        const obj = {
          id: new Date().getTime(),
          label: text,
          color: colorVar
        }
        this.addElToElListByCurIndex(obj)
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
       * @description 设置渲染el表达式的列表中的选中状态。
       * @param {Array} elList 渲染el表达式的数组
       * @param {number} index 需要选中的元素下标
       */
      setActived (elList, index) {
        elList.forEach(item => { item.actived = false })

        const newItem = elList[index]
        newItem.actived = true

        elList.splice(index, 1, newItem)
      },
      /**
       * @author haodongdong
       * @description 插入新的元素至elList，插入位置在当前选中的下标(curElListIndex)后，并更新当前选中下标。
       * @param {Object} el 要插入的元素
       */
      addElToElListByCurIndex (el) {
        if (this.elList.length === 0) {
          this.elList.push(el)
        } else {
          this.elList.splice(this.curElListIndex + 1, 0, el)
          this.curElListIndex += 1 // 插入新数据后向后移动表示选中的当前下标
        }
        this.setActived(this.elList, this.curElListIndex)
      },
      /**
       * @author haodongdong
       * @description 根据当前下标(curElListIndex)从elList删除元素，并更新当前下标。
       */
      removeElFromElListByCurIndex () {
        if (this.elList.length > 0) {
          this.elList.splice(this.curElListIndex, 1)
          if (this.curElListIndex > 0) {
            this.curElListIndex -= 1
            this.setActived(this.elList, this.curElListIndex)
          } else {
            if (this.elList.length > 0) {
              this.setActived(this.elList, this.curElListIndex)
            }
          }
        }
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
        if (this.initData) {
          this.tempVarCodeList = this.initData.tempVarCodeList
          this.elList = JSON.parse(this.initData.elJson)
          this.curElListIndex = this.elList.length - 1

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
    .el-exp {
      padding: 5px;
      // background-color: #fafafa;

      .flip-list-enter, .flip-list-leave-to {
        opacity: 0;
        transform: translateY(30px);
      }
      .flip-list-enter-active, .flip-list-leave-active {
        transition: all 0.5s;
      }
      .flip-list-leave-active {
        position: absolute;
      }
      .flip-list-move {
        transition: transform 0.5s;
      }
      .no-move {
        transition: transform 0s;
      }
      .ghost {
        // opacity: 0.5;
        // background: #c8ebfb;
      }
      span {
        display: inline-block;
        padding: 0 0.5px;
        cursor: move;
        font-size: 20px;
        font-weight: 700;
        color: #3ac1e5;
      }
      .actived::after {
        content: '';
        position: absolute;
        top: 31%;
        height: 20px;
        border-right: 1.5px solid #aeb6be;
        animation: blink 1.1s infinite steps(1, end);
      }

      @keyframes blink {
        0%, 100% {
          border-right-color: #aeb6be;
        }
        50% {
          border-right-color: transparent;
        }
      }
    }

    .con {
      display: flex

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
