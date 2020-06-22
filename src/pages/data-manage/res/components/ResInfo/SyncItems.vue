<template>
  <div style="margin-top: 16px;">
    <b-collapse-wrap v-if="hasMapList" title="配置映射" collapse>
      <b-table disabled-hover :data="mapList" :columns="mapColumns" size="small">
        <!--目标信息项-->
        <template v-slot:targetField="{row,index}">
          <b-select v-if="row.edit" v-model="mapList[index].targetField" size="small" append-to-body>
            <b-option v-for="item in targetFieldsOptions" :key="item" :value="item">{{item}}</b-option>
          </b-select>
          <span v-else>{{ row.targetField }}</span>
        </template>
        <!--值选项-->
        <template v-slot:valType="{row,index}">
          <b-select v-if="row.edit" v-model="mapList[index].valType" size="small" append-to-body>
            <b-option v-for="(o,k) in valTypeOptions" :key="k" :value="k">{{ o }}</b-option>
          </b-select>
          <span v-else>{{ valTypeOptions[row.valType] }}</span>
        </template>
        <!--值-->
        <template v-slot:value="{row,index}">
          <!--选择源字段-->
          <template v-if="row.valType==='S'">
            <b-select v-if="row.edit" v-model="mapList[index].sourceField" size="small"
                      append-to-body style="width: 200px;">
              <b-option v-for="item in sourceFieldsOptions" :key="item" :value="item">{{item}}</b-option>
            </b-select>
            <span v-else>名称：{{ row.sourceField }}</span>

            <b-tooltip v-if="row.edit" content="字典项" theme="light"
                       style="padding: 4px 8px 0;">
              <b-button type="text" icon="ios-options" @click="editDict(row,index)" :icon-style="{fontSize:'20px'}"/>
            </b-tooltip>&nbsp;
          </template>
          <template v-else>
            <b-row :gutter="10" v-if="row.edit">
              <b-col span="10">
                <b-input v-model="mapList[index].paramName" size="small" clearable placeholder="名称"/>
              </b-col>
              <b-col span="14">
                <b-input v-model="mapList[index].paramValue" size="small" clearable placeholder="常量值"/>
              </b-col>
            </b-row>
            <div v-else>
              名称：<span>{{ row.paramName }}</span>&nbsp;&nbsp;
              常量值：<span>{{ row.paramValue }}</span>
            </div>
          </template>
        </template>
        <template v-slot:action="{row,index}">
          <div v-if="row.newOne">
            <b-button @click="handleSave(row,index,'M')" type="success" size="small" transparent>添加</b-button>
            <b-button @click="handleCancel(index,'M')" size="small">取消</b-button>
          </div>
          <div v-else>
            <b-button v-if="row.edit" @click="handleSave(row,index,'M')" type="primary" size="small" transparent>保存
            </b-button>
            <b-button v-else @click="handleEdit(index,'M')" type="primary" size="small" transparent>编辑</b-button>
            <b-button v-if="row.edit" @click="handleCancel(index,'M')" size="small">取消</b-button>
            <span v-else style="margin-left: 10px;">
            <b-popover
              confirm append-to-body
              title="确认删除此项吗?"
              @on-ok="handleRemove(index,'M')">
              <b-button type="danger" size="small" transparent>删除</b-button>
            </b-popover>
          </span>
          </div>
        </template>
      </b-table>
      <b-button type="primary" icon="ios-add-circle-outline" dashed
                style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
                @click="handleAdd('M')">添加配置映射
      </b-button>
    </b-collapse-wrap>
    <b-collapse-wrap v-if="hasConditionList" title="关联条件" collapse>
      <b-table disabled-hover :data="conditionList" :columns="conditionColumns" size="small">
        <!--目标信息项-->
        <template v-slot:targetField="{row,index}">
          <b-select v-if="row.edit" v-model="conditionList[index].targetField" size="small" append-to-body>
            <b-option v-for="(item,index) in targetFields"
                      :key="item.fieldName+'-'+index" :value="item.fieldName">{{item.fieldName}}
            </b-option>
          </b-select>
          <span v-else>{{ row.targetField }}</span>
        </template>
        <!--条件-->
        <template v-slot:condition="{row,index}">
          <b-select v-if="row.edit" v-model="conditionList[index].condition" size="small" append-to-body>
            <b-option v-for="(value,k) in conditionOptions" :key="k" :value="k">{{value}}</b-option>
          </b-select>
          <span v-else>{{ conditionOptions[row.condition] }}</span>
        </template>
        <!--值选项-->
        <template v-slot:valType="{row,index}">
          <b-select v-if="row.edit" v-model="conditionList[index].valType" size="small" append-to-body>
            <b-option v-for="(o,k) in valTypeOptions" :key="k" :value="k">{{ o }}</b-option>
          </b-select>
          <span v-else>{{ valTypeOptions[row.valType] }}</span>
        </template>
        <!--值-->
        <template v-slot:value="{row,index}">
          <!--选择源字段-->
          <template v-if="row.valType==='S'">
            <b-select v-if="row.edit" v-model="conditionList[index].sourceField" size="small"
                      append-to-body style="width: 200px;">
              <b-option v-for="item in sourceFieldsOptions" :key="item" :value="item">{{item}}</b-option>
            </b-select>
            <span v-else>名称：{{ row.sourceField }}</span>
          </template>
          <template v-else>
            <b-row :gutter="10" v-if="row.edit">
              <b-col span="10">
                <b-input v-model="conditionList[index].paramName" size="small" clearable placeholder="名称"/>
              </b-col>
              <b-col span="14">
                <b-input v-model="conditionList[index].paramValue" size="small" clearable placeholder="常量值"/>
              </b-col>
            </b-row>
            <div v-else>
              名称：<span>{{ row.paramName }}</span>&nbsp;&nbsp;
              常量值：<span>{{ row.paramValue }}</span>
            </div>
          </template>
        </template>
        <template v-slot:action="{row,index}">
          <div v-if="row.newOne">
            <b-button @click="handleSave(row,index,'C')" type="success" size="small" transparent>添加</b-button>
            <b-button @click="handleCancel(index,'C')" size="small">取消</b-button>
          </div>
          <div v-else>
            <b-button v-if="row.edit" @click="handleSave(row,index,'C')" type="primary" size="small" transparent>保存
            </b-button>
            <b-button v-else @click="handleEdit(index,'C')" type="primary" size="small" transparent>编辑</b-button>
            <b-button v-if="row.edit" @click="handleCancel(index,'C')" size="small">取消</b-button>
            <span v-else style="margin-left: 10px;">
            <b-popover
              confirm append-to-body
              title="确认删除此项吗?"
              @on-ok="handleRemove(index,'C')">
              <b-button type="danger" size="small" transparent>删除</b-button>
            </b-popover>
          </span>
          </div>
        </template>
      </b-table>
      <b-button type="primary" icon="ios-add-circle-outline" dashed
                style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
                @click="handleAdd('C')">添加关联条件
      </b-button>
    </b-collapse-wrap>

    <!--添加字典项配置弹窗-->
    <dict-edit-dialog ref="dictEditDialog" @on-save="confSave"/>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import DictEditDialog from '../../../exchange/components/SwitchingMission/DictEditDialog'

  export default {
    name: 'SyncItems',
    components: { DictEditDialog },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      syncType: { // 同步类型
        type: String,
        required: true
      },
      targetFields: { // 目标信息项
        type: Array,
        default() {
          return []
        }
      },
      sourceFields: { // 原信息项
        type: Array,
        default() {
          return []
        }
      },
      valTypeOptions: {
        type: Object,
        default() {
          return {}
        }
      },
      conditionOptions: { // 条件枚举
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        mapColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '目标信息项', slot: 'targetField', width: 150 },
          { title: '值选项', slot: 'valType', width: 150 },
          { title: '值', slot: 'value' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        mapList: [], // 配置映射列表
        conditionColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '目标信息项', slot: 'targetField', width: 150 },
          { title: '条件', slot: 'condition', width: 150 },
          { title: '值选项', slot: 'valType', width: 150 },
          { title: '值', slot: 'value' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        conditionList: [] // 关联条件列表
      }
    },
    computed: {
      // 是否有配置映射列表
      hasMapList() {
        return this.syncType === 'A' || this.syncType === 'M'
      },
      // 是否有关联条件
      hasConditionList() {
        return this.syncType === 'M' || this.syncType === 'D'
      },
      // 数组去重
      targetFieldsOptions() {
        return [...new Set(this.targetFields.map(i => i.fieldName))]
      },
      sourceFieldsOptions() {
        return [...new Set(this.sourceFields.map(i => i.fieldName))]
      }
    },
    watch: {
      value: {
        handler(val) {
          this.mapList = [] // 配置映射列表
          this.conditionList = [] // 关联条件列表
          // 初始化两个，映射，条件列表
          if (val.length > 0) {
            val.forEach(item => {
              // 映射
              if (item.category === 'M') {
                this.mapList.push(item)
              }
              // 关联条件
              if (item.category === 'C') {
                this.conditionList.push(item)
              }
            })
            this.mapListCopy = deepCopy(this.mapList)
            this.conditionListCopy = deepCopy(this.conditionList)
          }
        },
        immediate: true
      },
      syncType(type) {
        let hasMapList = type === 'A' || type === 'M'
        let hasConditionList = type === 'M' || type === 'D'

        // 默认增加一条
        if (hasMapList && this.mapList.length === 0) {
          this.mapList.push({
            targetField: '',
            sourceField: '',
            category: 'M',
            valType: 'S',
            paramName: '',
            paramValue: '',
            edit: true,
            newOne: true
          })
        }
        if (hasConditionList && this.conditionList.length === 0) {
          this.conditionList.push({
            targetField: '',
            sourceField: '',
            category: 'C',
            valType: 'S',
            paramName: '',
            paramValue: '',
            condition: '',
            edit: true,
            newOne: true
          })
        }
        this.emitValue()
      }
    },
    methods: {
      editDict(row, index) {
        this.conf = { ...row }
        let maps = []
        if (this.mapList[index].dictMap) {
          maps = deepCopy(this.mapList[index].dictMap)
        } else {
          this.$set(this.mapList[index], 'dictMap', maps)
        }
        this.$refs.dictEditDialog.open(maps)
      },
      // 保存字典配置
      confSave(dict) {
        this.mapList[this.conf._index].dictMap = deepCopy(dict)
        // 更新响应值
        this.emitValue()
      },
      // 添加项
      handleAdd(type) {
        let newRow = {
          targetField: '',
          sourceField: '',
          category: type,
          valType: 'S',
          paramName: '',
          paramValue: '',
          edit: false,
          newOne: true
        }
        // 添加映射值
        if (type === 'M') {
          this.mapList.push({ ...newRow, dictMap: [] })
          this.handleEdit(this.mapList.length - 1, type)
        } else { // 添加关联条件
          this.conditionList.push({ ...newRow, condition: '' })
          this.handleEdit(this.conditionList.length - 1, type)
        }
        this.emitValue()
      },
      // 编辑项
      handleEdit(index, type) {
        if (type === 'M') {
          this.mapList[index].edit = true
        } else {
          this.conditionList[index].edit = true
        }
      },
      handleCancel(index, type) {
        if (type === 'M') {
          if (this.mapList[index].newOne) { // 如果当前是新增未保存的则取消即为移除
            if (this.mapList.length === 1) {
              this.$message({ type: 'danger', content: '[配置映射]至少需要配置一条数据' })
              return
            }
            this.mapList.splice(index, 1)
            this.emitValue() // 移除后需要更新
          } else { // 编辑的则设置取消
            // 从value里获取当前行恢复
            const { targetField, sourceField, paramName, paramValue } = this.mapListCopy[index]
            this.mapList[index].targetField = targetField
            this.mapList[index].sourceField = sourceField
            this.mapList[index].paramName = paramName
            this.mapList[index].paramValue = paramValue
            this.mapList[index].edit = false
          }
        } else {
          if (this.conditionList[index].newOne) { // 如果当前是新增未保存的则取消即为移除
            if (this.conditionList.length === 1) {
              this.$message({ type: 'danger', content: '[关联条件]至少需要配置一条数据' })
              return
            }
            this.conditionList.splice(index, 1)
            this.emitValue() // 移除后需要更新
          } else { // 编辑的则设置取消
            // 从value里获取当前行恢复
            const { targetField, sourceField, paramName, paramValue, condition } = this.conditionListCopy[index]
            this.conditionList[index].targetField = targetField
            this.conditionList[index].sourceField = sourceField
            this.conditionList[index].paramName = paramName
            this.conditionList[index].paramValue = paramValue
            this.conditionList[index].condition = condition
            this.conditionList[index].edit = false
          }
        }
      },
      handleRemove(index, type) {
        // 清除一个未保存的项
        if (type === 'M') {
          if (this.mapList.length === 1) {
            this.$message({ type: 'danger', content: '[配置映射]至少需要配置一条数据' })
            return
          }
          this.mapList.splice(index, 1)
        } else {
          if (this.conditionList.length === 1) {
            this.$message({ type: 'danger', content: '[关联条件]至少需要配置一条数据' })
            return
          }
          this.conditionList.splice(index, 1)
        }
        this.emitValue()
      },
      handleSave(row, index, type) {
        let currentRow = type === 'M' ? this.mapList[index] : this.conditionList[index]
        // 判断校验条件
        if (currentRow.targetField.length === 0) {
          this.$message({ type: 'danger', content: '目标信息项必选' })
          return
        }
        if (type === 'C' && currentRow.condition.length === 0) {
          this.$message({ type: 'danger', content: '关联条件必选' })
          return
        }
        if (currentRow.valType === 'S' && currentRow.sourceField.length === 0) {
          this.$message({ type: 'danger', content: '源信息值必选' })
          return
        }
        if (currentRow.valType === 'N' && (currentRow.paramName.length === 0 || currentRow.paramValue.length === 0)) {
          this.$message({ type: 'danger', content: '常量名称和值必填' })
          return
        }
        // 判断条件结束，更新状态
        if (type === 'M') {
          this.mapList[index].edit = false
          this.mapList[index].newOne = false
        } else {
          this.conditionList[index].edit = false
          this.conditionList[index].newOne = false
        }
        this.emitValue()
      },
      // 更新model value
      emitValue() {
        let totalData = [
          ...this.mapList.map(this.valueMap),
          ...this.conditionList.map(this.valueMap)
        ]
        this.$emit('input', totalData)
        this.$emit('on-change', totalData)
      },
      valueMap(item, index) {
        let obj = { ...item }
        if (obj.valType === 'S') {
          obj.paramName = obj.paramValue = ''
        } else {
          obj.sourceField = ''
        }
        return { ...obj, sortNum: index }
      }
    }
  }
</script>
