<template>
  <div class="edit-source-info-field">
    <b-modal v-model="showDialog"
      title="编辑资源信息"
      width="72%"
      :styles="{ top: '5%'}"
      :body-styles="{ padding: '15px' }"
      footer-hide
      @on-visible-change="handleVisibleChange">
      <!-- <table class="table mb-15">
        <tr>
          <th>资源名称</th>
          <th>主体类别</th>
          <th>资源性质</th>
        </tr>
        <tr>
          <td>{{ detail.resourceName }}</td>
          <td>{{ personClassEnum[detail.personClass] }}</td>
          <td>{{ resPropertyEnum[detail.resProperty] }}</td>
        </tr>
      </table> -->
      <b-table
        :columns="[
          { title: '资源名称', key: 'resourceName', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '资源性质', slot: 'resProperty', align: 'center' },
        ]" :data="[detail]" size="small" class="mb-15">
        <template v-slot:personClass="{ row }">
          {{ personClassEnum[row.personClass] }}
        </template>
        <template v-slot:resProperty="{ row }">
          {{ resPropertyEnum[row.resProperty] }}
        </template>
      </b-table>

      <b-table :columns="columns" :data="list" class="mb-15" size="small" :loading="loading">
        <template v-slot:fullRow>
          full
        </template>

        <template v-slot:action="{ index }">
          <b-button
            size="small" plain
            :type="list[index].customSelected ? 'danger' : 'primary'"
            @click="handleSelectBtn(index)">
            {{ list[index].customSelected ? '取消' : '选择' }}
          </b-button>
        </template>
      </b-table>

      <div style="text-align: center;">
        <b-button @click="showDialog = false">取 消</b-button>
        <b-button type="primary" @click="handleSaveBtn">保 存</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { getResPropertyTree, getResDetail } from '../../../../../api/data-manage/res-info.api'
  import { getPersonClassTree } from '../../../../../api/data-manage/metadata.api'
  import { getResourceDetail } from '../../../../../api/sys/credit-report-config.api'

  export default {
    name: 'EditSourceInfoField',
    props: [
      'open',
      'resourceKey',
      'fieldNames' // 用于回显的字段
    ],
    data () {
      return {
        loading: false,
        personClassEnum: {}, // 主体类别枚举
        resPropertyEnum: {}, // 资源性质枚举
        detail: {},
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字段名称', key: 'fieldName', align: 'center' },
          { title: '字段标题', key: 'fieldTitle', align: 'center' },
          { title: '占满一行', slot: 'fullRow', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created () {
      this.getEnum()
    },
    methods: {
      // b-modal组件的可视状态事件回调，用于初始化
      handleVisibleChange (visible) {
        if (visible) {
          this.init()
        } else {
          this.list = []
        }
      },
      // 选择按钮回调
      handleSelectBtn (index) {
        // 要注意bin-ui的table内容row的变化不会影响原本所在的data绑定值
        const row = this.list[index]
        if (row.customSelected) {
          row.customSelected = false
        } else {
          row.customSelected = true
        }
      },
      // 保存按钮回调
      handleSaveBtn () {
        const fieldNames = []
        const fieldTitles = []
        for (const item of this.list) {
          if (item.customSelected) {
            fieldNames.push(item.fieldName)
            fieldTitles.push(item.fieldTitle)
          }
        }
        this.$emit('save', {
          fieldNames: fieldNames.join(','),
          fieldTitles: fieldTitles.join(',')
        })
        this.showDialog = false
      },
      // 通用枚举
      getEnum() {
        // 主体类别树信息 code=A
        getPersonClassTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let personClasses = []
            let mapper = (node, parentCode) => {
              personClasses.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            const keyValue = {}
            // 转换类型映射值（扁平化）
            personClasses.forEach(item => {
              keyValue[item.key] = item.value
            })
            this.personClassEnum = keyValue
            mapper = null
          }
        })
        // 资源性质树信息 code=B
        getResPropertyTree().then(res => {
          if (res.status === 200) {
            // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次
            let tree = res.data.data
            let temp = []
            let mapper = (node, parentCode) => {
              temp.push({ key: node.code, value: node.text })
              let parents = parentCode ? parentCode.split(',') : []
              parents.push(node.code)
              let child = []
              if (node.children) {
                node.children.forEach(item => {
                  child.push(mapper(item, parents.join(',')))
                })
              }
              return {
                value: node.code,
                label: node.text,
                choose: parents, // 配合级联展开时使用
                children: child
              }
            }
            // 转换级联菜单格式
            let data = tree ? mapper(tree) : {}
            const keyValue = {}
            // 转换类型映射值（扁平化）
            temp.forEach(item => {
              keyValue[item.key] = item.value
            })
            this.resPropertyEnum = keyValue
            mapper = null
          }
        })
      },
      // 获取资源详情
      async getResourceDetail (resourceKey) {
        this.loading = true
        try {
          const res = await getResourceDetail(resourceKey)
          this.detail = res
          this.list = res.items
          this.list.forEach(item => { // 默认设置自定义的选择标识，默认不选择
            this.$set(item, 'customSelected', false)
          })
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      // 用于同步已选
      asyncSelect (list) {
        const fieldNameArr = this.fieldNames.split(',')
        list.forEach(item => {
          const exist = fieldNameArr.includes(item.fieldName)
          if (exist) {
            item.customSelected = true
          }
        })
      },
      async init () {
        await this.getResourceDetail(this.resourceKey) // 获取详情、字段项
        this.asyncSelect(this.list) // 同步已选择的字段项
      }
    }
  }
</script>

<style lang="stylus" scoped>
.edit-source-info-field {
  .table {
    width: 100%;
    border-collapse:separate;
    border-spacing:0px 10px;

    th {
      height: 47px;
      background: #fafafa;
    }

    td {
      text-align: center;
    }
  }
}
</style>
