<template>
  <div class="level-standard-set-score">
    <page-header-wrap title="评分标准" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div class="table-con" slot="full">
          <b-table :columns="columns" :data="list" :loading="loading" size="small">
            <template v-slot:levelCode="{ index }">
              <b-input v-model="list[index].levelCode" :class="{ error: list[index].levelCodeError }"
                       @on-blur="handleLevelCodeBlur(list[index], 'levelCode')"></b-input>
            </template>
            <template v-slot:upScore="{ index }">
              <b-input-number v-model="list[index].upScore" :class="{ error: list[index].upScoreError }"
                              style="width: 100%;" :min="0"
                              @on-blur="handleCommonBlur(list[index], 'upScore')"></b-input-number>
            </template>
            <template v-slot:dnScore="{ index }">
              <b-input-number v-model="list[index].dnScore" :class="{ error: list[index].dnScoreError }"
                              style="width: 100%;" :min="0"
                              @on-blur="handleCommonBlur(list[index], 'dnScore')"></b-input-number>
            </template>
            <template v-slot:levelDesc="{ index }">
              <b-input v-model="list[index].levelDesc"/>
            </template>
            <template v-slot:orderNo="{ row }">
              <v-sort-arrow @on-up="sortUp(row.orderNo)" @on-down="sortDn(row.orderNo)"/>
            </template>
            <template v-slot:action="{ row }">
              <b-button type="text" @click="addNext(row.orderNo)">添加</b-button>
              <b-button type="text" @click="remove(row.orderNo)">移除</b-button>
            </template>
          </b-table>

          <b-button style="margin-top: 15px; width: 100%;" type="primary" plain @click="addLast()">+ 添加</b-button>
          <p class="tip">标度，符合统计区间按最低值下限  ( ，最高值上限  ]  进行计算</p>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="submit">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { queryByRankId, batchSave } from '../../../api/credit-rating/level-standard.api'

  export default {
    name: 'LevelStandardSetScore',
    props: ['ratingId'],
    data() {
      return {
        loading: false,
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '等级', slot: 'levelCode', width: 200 },
          { title: '下限值 ( ', slot: 'dnScore', width: 120 },
          { title: '上限值 ] ', slot: 'upScore', width: 120 },
          { title: '描述', slot: 'levelDesc' },
          { title: '排序', slot: 'orderNo', width: 120, align: 'center' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    created() {
      this.getScoreListById()
    },
    methods: {
      // 插入下一行
      addNext(orderNo) {
        // 大于当前orderNo的其他元素的orderNo + 1
        for (const item of this.list) {
          if (item.orderNo > orderNo) item.orderNo += 1
        }
        // 新插入的元素的orderNo在当前orderNo上 + 1
        this.list.push({
          levelCode: '',
          upScore: '',
          dnScore: '',
          levelDesc: '',
          orderNo: orderNo + 1
        })
        // 按照orderNo升序排序
        this.sort(this.list)
      },
      // 插入最后一行
      addLast() {
        this.list.push({
          levelCode: '',
          upScore: 1,
          dnScore: 0,
          levelDesc: '',
          orderNo: this.list.length + 1
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
      // 上升一行
      sortUp(orderNo) {
        const curIndex = this.list.findIndex(item => {
          return item.orderNo === orderNo
        })
        if (curIndex !== 0) { // 不是第一个元素的话，则寻找上一个元素然后交换orderNo
          const curEl = this.list[curIndex] // 当前元素
          const preEl = this.list[curIndex - 1] // 上一个元素
          const curOrderNo = curEl.orderNo // 缓存当前元素orderNo
          curEl.orderNo = preEl.orderNo // 交换
          preEl.orderNo = curOrderNo // 交换
          // 重新排序
          this.sort(this.list)
        }
      },
      // 下降一行
      sortDn(orderNo) {
        const curIndex = this.list.findIndex(item => {
          return item.orderNo === orderNo
        })
        if (curIndex !== this.list.length - 1) { // 不是最后一个元素的话，则寻找下一个元素然后交换orderNo
          const curEl = this.list[curIndex] // 当前元素
          const nextEl = this.list[curIndex + 1] // 下一个元素
          const curOrderNo = curEl.orderNo // 缓存当前元素orderNo
          curEl.orderNo = nextEl.orderNo // 交换
          nextEl.orderNo = curOrderNo // 交换
          // 重新排序
          this.sort(this.list)
        }
      },
      // 自动填充上限，考虑到上下限的升降序填写的可能性，暂时不使用自动填充。
      autoFillUpScore(index) {
        // if (index > 0) { // 排除第一个元素
        //   const curEl = this.list[index]
        //   const preEl = this.list[index - 1]
        //   if (curEl.upScore === '') { // 初次时自动填充
        //     curEl.upScore = preEl.dnScore
        //   }
        // }
      },
      // 验证上下限
      upLoValidate(row, key) {
        return new Promise((resolve, reject) => {
          if (row.upScore !== '' && row.dnScore !== '') {
            if (Number(row.upScore) <= Number(row.dnScore)) {
              this.$set(row, key + 'Error', true)
              this.$message({
                type: 'warning',
                content: '下限值必须小于上限值'
              })
              reject(new Error('下限值必须小于上限值'))
            } else {
              this.$delete(row, key + 'Error')
              resolve()
            }
          } else {
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
            this.$message({
              type: 'warning',
              content: `值 ${row[key]} 已存在，请重新填写`
            })
            reject(new Error(`值 ${row[key]} 已存在`))
          } else {
            this.$delete(row, key + 'Error')
            resolve()
          }
        })
      },
      // 非空验证，接收当前行对象row，与当前字段key
      isRequired(row, key) {
        return new Promise((resolve, reject) => {
          if (row[key] === '' || row[key] === null) {
            this.$set(row, key + 'Error', true)
            this.$message({
              type: 'warning',
              content: '请不要为空'
            })
            reject(new Error('字段为空'))
          } else {
            this.$delete(row, key + 'Error')
            resolve()
          }
        })
      },
      // 等级框blur回调，验证非空、唯一
      async handleLevelCodeBlur(row, key) {
        try {
          await this.isRequired(row, key)
          await this.isUnique(row, key)
        } catch (error) {

        }
      },
      // 通用的blur回调，验证非空 、 上下限
      async handleCommonBlur(row, key) {
        // console.log(row)
        try {
          await this.isRequired(row, key)
          if (key === 'upScore' || key === 'dnScore') {
            await this.upLoValidate(row, key)
          }
        } catch (error) {
          console.warn(error)
        }
      },
      // 验证全部字段项
      validateAll(list) {
        return new Promise(async (resolve, reject) => {
          try {
            for (const item of this.list) {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  if (key !== 'levelDesc') await this.isRequired(item, key)
                  if (key === 'levelCode') {
                    await this.isUnique(item, key)
                  } else if (key === 'upScore' || key === 'dnScore') {
                    await this.upLoValidate(item, key)
                  }
                }
              }
            }
            resolve()
          } catch (error) {
            reject(new Error('未通过全部校验验证'))
          }
        })
      },
      // 提交
      async submit() {
        try {
          await this.validateAll(this.list)
          for (const item of this.list) { // 保留两位小数
            item.upScore = Number(Number(item.upScore).toFixed(2))
            item.dnScore = Number(Number(item.dnScore).toFixed(2))
            item.levelName = item.levelCode // 接口中有levelName字段，后端要求填写levelCode即可
          }
          const obj = {
            ratingId: this.ratingId,
            items: this.list
          }
          try {
            const [success, errorMsg] = await batchSave(obj)
            if (success) {
              this.$emit('close')
              this.$message({ type: 'success', content: '操作成功' })
            } else {
              this.$notice.danger({ title: '操作错误', desc: errorMsg })
            }
          } catch (error) {
            this.$notice.danger({ title: '操作错误', desc: error })
          }
        } catch (error) {
          console.warn(error)
        }
      },
      // 获取初始评分标准列表
      async getScoreListById() {
        this.loading = true
        try {
          const res = await queryByRankId(this.ratingId)
          this.list = res.data
        } catch (error) {
          this.$notice.danger({ title: '操作错误', desc: error })
          console.log(error)
        }
        this.loading = false
      },
      // 按照orderNo升序排序
      sort(list) {
        list.sort((pre, next) => {
          return Number(pre.orderNo) - Number(next.orderNo)
        })
      }
    }
  }
</script>

<style lang="stylus">
  .level-standard-set-score {
    .table-con {
      .error .bin-input {
        border: 1px solid #f5222d !important;
      }
      .error.bin-input-number {
        border: 1px solid #f5222d !important;
      }
    }
  }
</style>

<style lang="stylus" scoped>
  .level-standard-set-score {
    .table-con {

      .tip {
        margin-top: 15px;
        padding: 10px;
        background-color: #fafafa;
      }
    }
  }
</style>
