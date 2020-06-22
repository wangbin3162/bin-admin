<template>
  <!--添加字典项配置弹窗-->
  <b-modal v-model="dialogFormVisible" width="800" title="配置映射">
    <template>
      <div style="padding: 0 140px 5px 5px;" flex="box:mean">
        <span class="mr-15">源值</span><span>目标值</span>
      </div>
      <div flex="box:last" v-for="(item,index) in dictMaps" :key="index" class="mb-5">
        <b-input class="mr-10" v-model="item.sourceKey" placeholder="请输入键"/>
        <b-input v-model="item.sourceValue" placeholder="请输入值"/>
        <!--操作栏-->
        <div style="width: 140px;text-align: center;">
          <b-button type="danger" icon="ios-remove-circle" transparent
                    @click="removeBufferRow(item)">移除
          </b-button>
        </div>
      </div>
      <div class="pt-20">
        <b-button type="primary" dashed icon="ios-add-circle-outline" @click="addBufferRow">
          添加配置
        </b-button>
      </div>
    </template>
    <div slot="footer">
      <b-button @click="dialogFormVisible = false">取 消</b-button>
      <b-button type="primary" @click="confSave">确 定</b-button>
    </div>
  </b-modal>
</template>

<script>
  import { deepCopy, isNotEmpty } from '../../../../../common/utils/assist'

  export default {
    name: 'DictEditDialog',
    data() {
      return {
        dialogFormVisible: false,
        dictMaps: []
      }
    },
    methods: {
      open(dictData) {
        this.dictMaps = deepCopy(dictData)
        this.dialogFormVisible = true
      },
      // 添加一行选项
      addBufferRow() {
        this.dictMaps.push({ sourceKey: '', sourceValue: '' })
      },
      // 删除一行
      removeBufferRow(item) {
        let index = this.dictMaps.indexOf(item)
        this.dictMaps.splice(index, 1)
      },
      // 保存配置
      confSave() {
        let noEmpty = this.dictMaps.every(dict => {
          return isNotEmpty(dict.sourceKey) && isNotEmpty(dict.sourceValue)
        })
        if (noEmpty) {
          this.dialogFormVisible = false
          this.$emit('on-save', this.dictMaps)
        } else {
          this.$message({ type: 'danger', content: '原值和目标值不能为空！' })
        }
      }
    }
  }
</script>
