<template>
  <b-collapse-wrap title="参数配置" collapse class="edit-param-manage">
    <b-table :columns="columns" :data="list" size="small">
      <template v-slot:paraName="{ index }">
        <b-tooltip :content="list[index].paraNameMsg" max-width="200"
                  :disabled="!list[index].paraNameError" :always="list[index].paraNameError">

          <b-input v-model="list[index].paraName" :disabled="list[index].disabled"
            :class="{ error: list[index].paraNameError }"
            @on-blur="handleValidate(list[index], 'paraName')">
          </b-input>

        </b-tooltip>
      </template>
      <template v-slot:paraCode="{ index }">
        <b-tooltip :content="list[index].paraCodeMsg" max-width="200"
                  :disabled="!list[index].paraCodeError" :always="list[index].paraCodeError">

          <b-input v-model="list[index].paraCode" :disabled="list[index].disabled"
            :class="{ error: list[index].paraCodeError }"
            @on-blur="handleValidate(list[index], 'paraCode')">
          </b-input>

        </b-tooltip>
      </template>
      <template v-slot:paraType="{ index }">
        <b-tooltip :content="list[index].paraTypeMsg" max-width="200" style="width: 100%;"
                  :disabled="!list[index].paraTypeError" :always="list[index].paraTypeError">

          <b-select v-model="list[index].paraType" append-to-body
            :disabled="list[index].disabled"
            :class="{ error: list[index].paraTypeError }"
            @on-change="handleValidate(list[index], 'paraType')">
            <b-option v-for="item in paramTypeOptions" :key="item.value"
              :value="item.value">{{ item.label }}
            </b-option>
          </b-select>

        </b-tooltip>
      </template>
      <template v-slot:paraDesc="{ index }">
        <b-input v-model="list[index].paraDesc" :disabled="list[index].disabled"></b-input>
      </template>
      <template v-slot:action="{ row, index }">
        <b-button type="text" :disabled="row.disabled" @click="remove(row.orderNo)">删除</b-button>
        <b-button v-if="varType === 'Complex' && row.paraSource === null"
          type="text" :disabled="row.disabled" @click="handleSelectedBtn(index)">选择</b-button>
      </template>
    </b-table>
    <b-button
      style="width: 100%; margin-top: 10px;"
      type="primary" plain
      @click="add">+ 添加
    </b-button>
  </b-collapse-wrap>
</template>

<script>
  export default {
    name: 'IndexVarEditParamManage',
    props: {
      varType: {
        type: String // 用于控制是否table显示来源字段
      },
      params: { // 用于回显的初始化
        type: Array
      },
      paramTypeOptions: { // 用于渲染参数类型的option
        type: Array
      },
      tempVarCodeList: {
        type: Array
      }
    },
    data() {
      return {
        list: [],
        columns: []
      }
    },
    watch: {
      varType: {
        handler (newVal, oldVal) {
          if (newVal === 'Common') {
            this.columns = [
              { type: 'index', width: 50, align: 'center' },
              { title: '参数名称', slot: 'paraName' },
              { title: '参数编码', slot: 'paraCode' },
              { title: '参数类型', slot: 'paraType' },
              { title: '描述', slot: 'paraDesc' },
              { title: '操作', slot: 'action', width: 70 }
            ]
          } else if (newVal === 'Complex') {
            this.columns = [
              { type: 'index', width: 50, align: 'center' },
              { title: '参数名称', slot: 'paraName' },
              { title: '参数编码', slot: 'paraCode' },
              { title: '参数类型', slot: 'paraType' },
              { title: '描述', slot: 'paraDesc' },
              { title: '来源', key: 'paraSource', ellipsis: true, tooltip: true },
              { title: '操作', slot: 'action', width: 120 }
            ]
          }
        },
        immediate: true
      },
      params: {
        handler(newVal, oldVal) { // 观察params变化维护list状态
          const arr = JSON.parse(JSON.stringify(newVal))
          // 在这里分离person_id
          const index = arr.findIndex(item => {
            return item.paraCode === 'person_id'
          })
          if (index > -1) { // 取出并缓存paraCode为person_id的数据
            const obj = arr.splice(index, 1)[0]
          }

          const list = [...arr]
          for (let i = 0; i < list.length; i++) { // 给传递过来的参数添加初始排序字段
            const item = list[i]
            item.orderNo = i + 1
          }
          this.list = list
        },
        immediate: true
      },
      list: { // 观察list，有变化则发送携带新值的事件
        handler(newVal, oldVal) {
          let list = [...newVal]

          list.forEach(item => {
            // 禅道bug 13979会引起paraType为uundefined
            // 原因为b-select组件如果绑定的值为''、null，则组件会把绑定的值设为undefined
            if (item.paraType === undefined) item.paraType = ''
          })
          this.$emit('params-change', list)
        },
        deep: true
      }
    },
    methods: {
      // 添加一行
      add() {
        this.list.push({
          paraName: '',
          paraCode: '',
          paraDesc: '',
          paraType: '',
          paraSource: null,
          orderNo: this.list.length + 1,
          custom: true // 表示自定义参数
        })
      },
      // 移除一行
      remove(orderNo) {
        // 大于当前orderNo的其他元素的orderNo - 1
        for (const item of this.list) { // 防止addLast()插入元素的orderNo小于之前的元素
          if (item.orderNo > orderNo) item.orderNo -= 1
        }
        const index = this.list.findIndex(item => {
          return item.orderNo === orderNo
        })
        this.list.splice(index, 1)
      },
      /**
       * @author haodongdong
       * @description 选择按钮的回调，选择后发送事件，由EditElVar组件响应。
       * @param {Object} row 当前行的数据
       */
      async handleSelectedBtn (index) {
        const row = this.list[index]
        const valid = await this.validateAll([row])
        if (valid) this.$EventBus.$emit('IndexVarEditParamManage-selected', row)
      },
      // 名称与编码的blur回调，验证非空、唯一、 不在变量列表中
      async handleValidate(row, key) {
        try {
          await this.isRequired(row, key)
          if (key !== 'paraType') await this.isUnique(row, key)
          if (key === 'paraCode') {
            await this.notPersonId(row, key)
            await this.notInclude(row, key)
          }
        } catch (error) {
          console.warn(error)
        }
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
      // 判断唯一值
      isUnique(row, key) {
        return new Promise((resolve, reject) => {
          const unique = !this.list.some(item => {
            if (item.orderNo !== row.orderNo) { // 使用orderNo作为唯一值排除自己
              return item[key] === row[key]
            } else {
              return false
            }
          })
          if (!unique) {
            this.$set(row, key + 'Error', true)
            this.$set(row, key + 'Msg', `值 ${row[key]} 已存在，请重新填写`)
            reject(new Error(`值 ${row[key]} 已存在`))
          } else {
            this.$delete(row, key + 'Error')
            this.$delete(row, key + 'Msg')
            resolve()
          }
        })
      },
      // 判断是否存在于已选变量列表中 tempVarCodeList
      notInclude(row, key) {
        return new Promise((resolve, reject) => {
          const unique = !this.tempVarCodeList.some(item => {
            return item === row[key]
          })
          if (!unique) {
            this.$set(row, key + 'Error', true)
            this.$set(row, key + 'Msg', `值 ${row[key]} 已存在于【已选变量】中，请重新填写`)
            reject(new Error(`值 ${row[key]} 已存在于已选变量中`))
          } else {
            this.$delete(row, key + 'Error')
            this.$delete(row, key + 'Msg')
            resolve()
          }
        })
      },
      // 不允许添加paraCode为person_id
      notPersonId(row, key) {
        return new Promise((resolve, reject) => {
          if (row[key] === 'person_id') {
            this.$set(row, key + 'Error', true)
            this.$set(row, key + 'Msg', `不允许添加person_id`)
            reject(new Error('不允许添加person_id'))
          } else {
            this.$delete(row, key + 'Error')
            this.$delete(row, key + 'Msg')
            resolve()
          }
        })
      },
      // 验证全部字段项, 提供给组件外提交表单前使用
      async validateAll (list = this.list) {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of list) {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  if (key !== 'paraDesc' && key !== 'paraSource') await this.isRequired(item, key)
                  if (key === 'paraName' || key === 'paraCode') await this.isUnique(item, key)
                  if (key === 'paraCode') {
                    await this.notPersonId(item, key)
                    await this.notInclude(item, key)
                  }
                }
              }
            }
            resolve(true)
          } catch (error) {
            console.warn(error)
            resolve(false)
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  .edit-param-manage {
    .error .bin-input {
      border: 1px solid #f5222d !important;
    }
    .error .bin-select-selection {
      border: 1px solid #f5222d !important;
    }
  }
</style>
