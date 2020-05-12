<template>
  <div class="index-manage-index-rule">
    <b-code-editor :value="JSON.stringify(this.list)"></b-code-editor>
    <b-table v-if="natureType" :columns="columnsQ" :data="list">
      <template v-slot:itemValue="{ index }">
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].itemValueMsg"
          :disabled="!list[index].itemValueError"
          :always="list[index].itemValueError">
          <b-input v-model="list[index].itemValue"
            :class="{ error: list[index].itemValueError }"
            @on-blur="handleValidate(list[index], 'itemValue')"></b-input>
        </b-tooltip>
      </template>
      <template v-slot:itemDesc="{ index }">
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].itemDescMsg"
          :disabled="!list[index].itemDescError"
          :always="list[index].itemDescError">
          <b-input v-model="list[index].itemDesc"
            :class="{ error: list[index].itemDescError }"
            @on-blur="handleValidate(list[index], 'itemDesc')"></b-input>
        </b-tooltip>
      </template>
      <template v-slot:score="{ index }">
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].scoreMsg"
          :disabled="!list[index].scoreError"
          :always="list[index].scoreError">
          <b-input-number v-model="list[index].score"
            :class="{ error: list[index].scoreError }"
            @on-blur="handleValidate(list[index], 'score')"></b-input-number>
        </b-tooltip>
      </template>
      <template v-slot:sort>
        <v-sort-arrow></v-sort-arrow>
      </template>
      <template v-slot:action="{ index }">
        <b-button type="text" @click="addNext(index)">
          添加
        </b-button>
        <b-button type="text" @click="remove(index)">
          移除
        </b-button>
      </template>
    </b-table>

    <b-table v-else :columns="columnsR" :data="list">
      <template v-slot:upValue="{ index }">
        <!-- <b-input-number v-model="list[index].upValue"></b-input-number> -->
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].upValueMsg"
          :disabled="!list[index].upValueError"
          :always="list[index].upValueError">
          <b-input-number v-model="list[index].upValue"
            :class="{ error: list[index].upValueError }"
            @on-blur="handleValidate(list[index], 'upValue')"></b-input-number>
        </b-tooltip>
      </template>
      <template v-slot:dnValue="{ index }">
        <!-- <b-input-number v-model="list[index].dnValue"></b-input-number> -->
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].dnValueMsg"
          :disabled="!list[index].dnValueError"
          :always="list[index].dnValueError">
          <b-input-number v-model="list[index].dnValue"
            :class="{ error: list[index].dnValueError }"
            @on-blur="handleValidate(list[index], 'dnValue')"></b-input-number>
        </b-tooltip>
      </template>
      <template v-slot:score="{ index }">
        <!-- <b-input-number v-model="list[index].score"></b-input-number> -->
        <b-tooltip
          max-width="200" placement="right"
          :content="list[index].scoreMsg"
          :disabled="!list[index].scoreError"
          :always="list[index].scoreError">
          <b-input-number v-model="list[index].score"
            :class="{ error: list[index].scoreError }"
            @on-blur="handleValidate(list[index], 'score')"></b-input-number>
        </b-tooltip>
      </template>
      <template v-slot:sort="{ index }">
        <v-sort-arrow @on-up="up(index)" @on-down="dn(index)"></v-sort-arrow>
      </template>
      <template v-slot:action="{ index }">
        <b-button type="text" @click="addNext(index)">
          添加
        </b-button>
        <b-button type="text" @click="remove(index)">
          移除
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    name: 'IndexManageEditIndexRule',
    props: {
      nature: { // 性质 Q: 定性 R: 定量
        required: true
      },
      scale: { // 标度 F: 5分 T: 10分
        required: true
      },
      rules: { // 已有的指标规则数组，可以为空数组
        type: Array,
        required: true
      }
    },
    data () {
      return {
        editDataInitFlag: false,
        list: [],
        columnsQ: [
          { type: 'index', width: 50 },
          { title: '指标值', slot: 'itemValue', align: 'center' },
          { title: '指标描述', slot: 'itemDesc', align: 'center' },
          { title: '得分', slot: 'score', align: 'center' },
          { title: '排序', slot: 'sort', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        columnsR: [
          { type: 'index', width: 50 },
          { title: '上限值', slot: 'upValue', align: 'center' },
          { title: '下限值', slot: 'dnValue', align: 'center' },
          { title: '得分', slot: 'score', align: 'center' },
          { title: '排序', slot: 'sort', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    computed: {
      natureType () {
        return this.nature === 'Q' // 默认显示定量
      }
    },
    watch: {
      rules: {
        handler () {
          this.initArr(this.nature, this.scale)
        },
        immediate: true
      },
      // 暂先注释，改由父组件在下拉框change事件内调用当前组件的initArr创建对应数组
      // nature: {
      //   handler (newVal, oldVal) {
      //     this.initArr(newVal, this.scale)
      //   },
      //   immediate: true
      // },
      // scale: {
      //   handler (newVal, oldVal) {
      //     this.initArr(this.nature, newVal)
      //   },
      //   immediate: true
      // },
      list: {
        handler (newVal, oldVal) {
          this.$emit('data-change', newVal)
        },
        immediate: true,
        deep: true
      }
    },
    created () {

    },
    methods: {
      init () {
        // 初始化标度数组，主要用于编辑时的数据初始化
      },
      // 插入下一行
      addNext(index) {
        const curScaleLength = this.scale === 'F' ? 5 : 10
        if (this.list.length < curScaleLength) { // 数组长度小于当前标度长度才允许添加
          const obj = this.initObj(this.nature)
          this.list.splice(index + 1, 0, obj)
          this.resetOrderNo(this.list)
        }
      },
      remove (index) {
        this.list.splice(index, 1)
        this.resetOrderNo(this.list)
      },
      up (index) {
        const curEl = this.list.splice(index, 1)[0]
        this.list.splice(index - 1, 0, curEl)
        this.resetOrderNo(this.list)
      },
      dn (index) {
        const curEl = this.list.splice(index, 1)[0]
        this.list.splice(index + 1, 0, curEl)
        this.resetOrderNo(this.list)
      },
      // 非空验证，接收当前行对象row，与当前字段key
      isRequired(row, key) {
        return new Promise((resolve, reject) => {
          if (row[key] === '' || row[key] === null) {
            this.$set(row, key + 'Error', true)
            this.$set(row, key + 'Msg', `请不要为空`)
            reject(new Error('字段为空'))
          } else {
            this.$delete(row, key + 'Error')
            this.$delete(row, key + 'Msg')
            resolve()
          }
        })
      },
      // 输入框blur回调
      async handleValidate(row, key) {
        try {
          await this.isRequired(row, key)
        } catch (error) {
          this.$log.pretty('验证失败', error, 'warning')
        }
      },
      // 验证所有
      validateAll() {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of this.list) {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  if (key !== 'itemDesc') { // 不校验描述
                    // 由于后端返回数据不会过滤掉不需要的字段，为了处理校验，不同指标性质下需忽略不需校验的字段
                    if (this.nature === 'R') { // 定量
                      if (key !== 'itemValue') await this.isRequired(item, key)
                    } else { // 定性
                      if (key !== 'upValue' && key !== 'dnValue') await this.isRequired(item, key)
                    }
                  }
                }
              }
            }
            resolve(true)
          } catch (error) {
            resolve(false)
          }
        })
      },
      // 根据指标性质、标度初始化数组
      initArr (nature, scale) {
        let list = []
        const num = scale === 'F' ? 5 : 10 // 判断标度确定数组构建数量
        for (let i = 0; i < num; i++) {
          const obj = this.initObj(nature) // 根据性质返回对应数据结构
          obj.orderNo = i // 添加排序字段
          list.push(obj)
        }
        if (this.rules.length > 0 && this.editDataInitFlag === false) {
          // 此段if只用在编辑的时候于取一次可能存在的rules用作初始化
          list = JSON.parse(JSON.stringify(this.rules))
          this.editDataInitFlag = true
        }
        this.list = list
      },
      // 根据指标性质返回对应的数据结构
      initObj (nature) {
        // 定性结构
        const objQ = {
          orderNo: 0,
          itemValue: '', // 指标值
          itemDesc: '', // 指标描述
          score: null
        }
        // 定量结构
        const objR = {
          orderNo: 0,
          upValue: null, // 上限
          dnValue: null, // 下限
          score: null
        }
        const obj = nature === 'Q' ? objQ : objR // 判断定量或定性
        return obj
      },
      // 重新设置orderNo， 使其等于当前下标
      resetOrderNo (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].orderNo = i
        }
      }
    }
  }
</script>

<style lang="stylus">
  .index-manage-index-rule {
    .error .bin-input {
      border: 1px solid #f5222d !important;
    }
    .error.bin-input-number {
      border: 1px solid #f5222d !important;
    }
  }
</style>
