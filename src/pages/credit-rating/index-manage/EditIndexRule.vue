<template>
  <div>
    <b-code-editor :value="JSON.stringify(this.list)"></b-code-editor>
    <b-table v-if="natureType" :columns="columnsQ" :data="list">
      <template v-slot:itemValue="{ index }">
        <b-input v-model="list[index].itemValue"></b-input>
      </template>
      <template v-slot:itemDesc="{ index }">
        <b-input v-model="list[index].itemDesc"></b-input>
      </template>
      <template v-slot:score="{ index }">
        <b-input v-model="list[index].score"></b-input>
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
        <b-input v-model="list[index].upValue"></b-input>
      </template>
      <template v-slot:dnValue="{ index }">
        <b-input v-model="list[index].dnValue"></b-input>
      </template>
      <template v-slot:score="{ index }">
        <b-input v-model="list[index].score"></b-input>
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
        list: [],
        columnsQ: [
          { type: 'index', width: 50 },
          { title: '指标值', slot: 'itemValue' },
          { title: '指标描述', slot: 'itemDesc' },
          { title: '得分', slot: 'score' },
          { title: '排序', slot: 'sort', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        columnsR: [
          { type: 'index', width: 50 },
          { title: '上限值', slot: 'upValue' },
          { title: '下限值', slot: 'dnValue' },
          { title: '得分', slot: 'score' },
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
      nature: {
        handler (newVal, oldVal) {
          this.initArr(newVal, this.scale)
        },
        immediate: true
      },
      scale: {
        handler (newVal, oldVal) {
          this.initArr(this.nature, newVal)
        },
        immediate: true
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
        console.log(this.list.length, curScaleLength)
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
      // 根据指标性质返回对应的数据结构
      initObj (nature) {
        // 定性结构
        const objQ = {
          orderNo: 0,
          score: '',
          itemValue: '', // 指标值
          itemDesc: '' // 指标描述
        }
        // 定量结构
        const objR = {
          orderNo: 0,
          score: '',
          upValue: '', // 上限
          dnValue: '' // 下限
        }
        const obj = nature === 'Q' ? objQ : objR // 判断定量或定性
        return obj
      },
      // 根据指标性质、标度初始化数组
      initArr (nature, scale) {
        const list = []
        const num = scale === 'F' ? 5 : 10 // 判断标度确定数组构建数量
        for (let i = 0; i < num; i++) {
          const obj = this.initObj(nature) // 根据性质返回对应数据结构
          obj.orderNo = i // 添加排序字段
          list.push(obj)
        }
        this.list = list
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
