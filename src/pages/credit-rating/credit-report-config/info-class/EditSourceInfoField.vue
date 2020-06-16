<template>
  <div class="edit-source-info-field">
    <b-modal v-model="showDialog"
      title="编辑资源信息"
      width="72%"
      :styles="{ top: '5%'}"
      :body-styles="{ padding: '10px' }"
      footer-hide
      @on-visible-change="handleVisibleChange">
      <b-table
        :columns="[
          { title: '资源名称', key: 'resourceName', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '资源性质', slot: 'resProperty', align: 'center' },
        ]" :data="[detail]" size="small">
        <template v-slot:personClass="{ row }">
          {{ personClassEnum[row.personClass] }}
        </template>
        <template v-slot:resProperty="{ row }">
          {{ resPropertyEnum[row.resProperty] }}
        </template>
      </b-table>

      <v-title-bar label="配置信用报告信息项" class="mb-15">
        <b-button type="text" @click="handleSwitchTable">
          {{ this.isEdit ? '添加字段' : '编辑字段' }}
        </b-button>
      </v-title-bar>

      <div class="mb-15" style="max-height: 350px; overflow: auto;">
        <!-- 选择用table -->
        <b-table v-if="!isEdit" :key="isEdit"
          :columns="columns" :data="list"
          size="small" :loading="loading">
          <template v-slot:controlType="{ row }">
            {{ fieldCtrlEnum[row.controlType] }}
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

        <!-- 编辑用table -->
        <b-table v-else :key="isEdit" no-data-text="暂无已选字段"
          :draggable="true" @on-drag-drop="handleDragDrop"
          :columns="columnsEdit" :data="listEdit"
          size="small" :loading="loading">
          <template v-slot:fieldTitle="{ index }">
            <b-input v-model="listEdit[index].fieldTitle" @on-blur="handleInputBlur(index)"></b-input>
          </template>

          <template v-slot:fullRow="{ index }">
            <b-checkbox v-model="listEdit[index].customFullRow"></b-checkbox>
          </template>

          <template v-slot:dragSort>
            <b-icon name="ios-move" style="cursor: move;"></b-icon>
          </template>

          <template v-slot:action="{ index }">
            <b-button
              size="small" plain
              type="danger"
              @click="handleCancelBtn(index)">
              取消
            </b-button>
          </template>
        </b-table>
      </div>

      <div style="text-align: center;">
        <b-button @click="showDialog = false">取 消</b-button>
        <b-button type="primary" @click="handleSaveBtn">保 存</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { getResPropertyTree } from '../../../../api/data-manage/res-info.api'
  import { getPersonClassTree } from '../../../../api/data-manage/metadata.api'
  import { getResourceDetail } from '../../../../api/credit-rating/credit-report-config.api'
  import { getFieldCtrl } from '../../../../api/enum.api'

  export default {
    name: 'EditSourceInfoField',
    props: [
      'open',
      'resourceKey',
      'fieldMap' // 用于回显字段
    ],
    data () {
      return {
        loading: false,
        isEdit: true, // 用于显示选择的table还是编辑的table
        personClassEnum: {}, // 主体类别枚举
        resPropertyEnum: {}, // 资源性质枚举
        fieldCtrlEnum: {}, // 控件类型枚举
        detail: {},
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字段名称', key: 'fieldName', align: 'center' },
          { title: '字段标题', key: 'fieldTitle', align: 'center' },
          { title: '控件类型', slot: 'controlType', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        listEdit: [], // 存储已选中用于编辑的信息项字段
        columnsEdit: [
          { type: 'index', width: 50, align: 'center' },
          { title: '字段名称', key: 'fieldName', align: 'center' },
          { title: '字段标题', slot: 'fieldTitle', align: 'center' },
          { title: '占满一行', slot: 'fullRow', align: 'center' },
          { title: '拖动排序', slot: 'dragSort', align: 'center' },
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
          this.detail = {}
          this.list = []
          this.listEdit = []
          this.isEdit = true
        }
      },
      // 添加字段按钮回调
      handleSwitchTable () {
        this.isEdit = !this.isEdit
      },
      // 选择按钮回调
      handleSelectBtn (index) {
        // 要注意bin-ui的table内容row的变化不会影响原本所在的data绑定值
        const row = this.list[index]
        row.customSelected = !row.customSelected
        this.listEdit = this.filterSelected(this.list)
      },
      // 取消按钮的回调
      handleCancelBtn (index) {
        const row = this.listEdit[index]
        this.list.forEach(item => { // 取消选择
          if (item.fieldName === row.fieldName) item.customSelected = false
        })
        this.listEdit.splice(index, 1) // 删除
      },
      // 编辑table拖拽的回调
      handleDragDrop (index1, index2) {
        const startIndex = Number(index1)
        const endIndex = Number(index2)
        if (startIndex !== endIndex) {
          console.log(startIndex, endIndex)
          const arr = this.listEdit.splice(startIndex, 1)
          console.log(this.listEdit)
          this.listEdit.splice(endIndex, 0, ...arr)
        }
      },
      // input blur回调
      handleInputBlur (index) {
        this.listEdit[index].fieldTitle = this.listEdit[index].fieldTitle.replace(',', '')
      },
      // 保存按钮回调
      handleSaveBtn () {
        const fieldNames = []
        const fieldTitles = []
        const onelineNames = []

        for (const item of this.listEdit) {
          fieldNames.push(item.fieldName)
          fieldTitles.push(item.fieldTitle)
          if (item.customFullRow) onelineNames.push(item.fieldName) // 存放占满一行的fieldName
        }

        this.$emit('save', {
          fieldNames: fieldNames.join(','),
          fieldTitles: fieldTitles.join(','),
          onelineNames: onelineNames.join(',')
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
        getFieldCtrl().then(res => {
          if (res.status === 200) {
            this.fieldCtrlEnum = res.data.data
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
          this.list.forEach(item => {
            this.$set(item, 'customSelected', false) // 自定义选择标识
            this.$set(item, 'customFullRow', false) // 自定义占满一行字段
          })
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      // 用于同步已选、占满一行
      asyncSelect (list) {
        console.log(this.fieldMap)
        // 同步选择状态
        list.forEach(item => {
          const fieldObj = this.fieldMap.get(item.fieldName)
          if (fieldObj) { // 存在则选中
            item.customSelected = true

            if (fieldObj.isOneLine) { // 是否占满一行
              item.customFullRow = true
            }
          }
        })
        // 取出已选字段
        const filterArr = this.filterSelected(list)
        // 对已选字段按字符串顺序排序
        const resArr = []
        for (const key of this.fieldMap.keys()) {
          const el = filterArr.find(item => key === item.fieldName)
          if (el) resArr.push(el)
        }
        // 放入编辑列表
        this.listEdit = resArr
      },
      // 过滤出已选择的字段存入listEdit，并且同步已选择的字段标题
      filterSelected (list) {
        const filteredList = JSON.parse(JSON.stringify(list.filter(item => item.customSelected)))
        filteredList.forEach(item => {
          const fieldObj = this.fieldMap.get(item.fieldName)
          if (fieldObj) {
            item.fieldTitle = fieldObj.fieldTitle // 更新fieldTitle
          }
        })
        return filteredList
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
