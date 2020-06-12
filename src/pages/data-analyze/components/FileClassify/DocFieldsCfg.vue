<template>
  <div class="fields-config-wrap">
    <b-row>
      <b-col span="8">
        <b-tag type="primary" font-size="14" style="margin-bottom: 8px;">未选择信息项</b-tag>
        <div class="fields-wrap">
          <draggable class="list-group" :list="items"
                     v-bind="{animation: 100,group:'item',disabled: false, ghostClass: 'ghost'}">
            <div
              class="list-group-item"
              v-for="(element, index) in items"
              :key="element.name||index"
            >
              <span :title="element.title">{{ element.title }}</span>
              <span>{{ element.name }}</span>
            </div>
          </draggable>
        </div>
      </b-col>
      <b-col span="4">
        <div flex="dir:top main:center cross:center" style="padding: 24px;height:460px;">
          <b-button type="primary" plain @click="chooseAll">全部选择
            <b-icon name="ios-arrow-round-forward"/>
          </b-button>
          <b-button type="danger" plain @click="removeAll" style="margin: 24px 0 0;">
            <b-icon name="ios-arrow-round-back"/>
            全部移除
          </b-button>
        </div>
      </b-col>
      <b-col span="8">
        <b-tag type="success" font-size="14" style="margin-bottom: 8px;">已选信息项</b-tag>
        <div class="fields-wrap">
          <draggable class="list-group" :list="checkFields"
                     v-bind="{animation: 100,group:'item',disabled: false, ghostClass: 'ghost'}"
                     @add="fieldsChange" @remove="fieldsChange" @update="fieldsChange">
            <div
              class="list-group-item"
              v-for="(element, index) in checkFields"
              :key="element.name||index"
            >
              <span :title="element.title">{{ element.title }}</span>
              <span>{{ element.name }}</span>
            </div>
          </draggable>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'DocFieldsCfg',
    components: { draggable },
    props: {
      fieldNames: String,
      fieldTitles: String,
      allFields: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        items: [],
        checkFields: [] // 已配置的字段
      }
    },
    watch: {
      fieldNames: {
        handler(val) {
          this.checkFields = []
          // 根据存储的名称和标题字符串初始化已选列表
          if (this.$isNotEmpty(this.fieldNames) && this.$isNotEmpty(this.fieldTitles)) {
            // 拆分两个字符为数组
            let names = this.fieldNames.split(',')
            let titles = this.fieldTitles.split(',')
            if (names.length === titles.length) {
              for (let i = 0; i < names.length; i++) {
                this.checkFields.push({ name: names[i], title: titles[i] })
              }
            }
          }
          // 选中后过滤剩余信息项
          this.items = this.filterItems()
        },
        immediate: true
      },
      allFields() {
        this.items = this.filterItems()
      }
    },
    methods: {
      fieldsChange() {
        let names = []
        let titles = []
        this.checkFields.forEach(item => {
          names.push(item.name)
          titles.push(item.title)
        })
        let fieldNames = this.$isEmpty(names) ? '' : names.join(',')
        let fieldTitles = this.$isEmpty(titles) ? '' : titles.join(',')
        this.$emit('on-change', [fieldNames, fieldTitles])
      },
      // 选择全部
      chooseAll() {
        this.checkFields = deepCopy(this.allFields.map(i => ({ name: i.fieldName, title: i.fieldTitle })))
        this.fieldsChange()
      },
      // 移除全部
      removeAll() {
        this.checkFields = []
        this.fieldsChange()
      },
      filterItems() {
        return this.allFields
          .filter(item => {
            return this.checkFields.findIndex(field => field.name === item.fieldName) === -1
          })
          .map(i => ({ name: i.fieldName, title: i.fieldTitle }))
      }
    }
  }
</script>

<style scoped lang="stylus">
  .fields-config-wrap {
    .fields-wrap {
      height: 418px;
      overflow-y: auto;
      border: 1px solid rgba(0, 0, 0, .125);
      border-radius: .25rem;
      padding: 8px;
      background: #fafafa;
    }
    .list-group {
      display: flex;
      flex-direction: column;
      padding-left: 0;
      margin-bottom: 0;
      border-radius: .25rem;
      min-height: 400px;
    }
    .list-group-item {
      cursor: move;
      position: relative;
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      padding: 0 20px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, .125);
      &:last-child {
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
      }
      &:first-child {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
      }
      + .list-group-item {
        border-top-width: 0;
      }
      &.ghost {
        opacity: 0.5;
        background: #b5d0f6;
      }
      span:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:last-child {
        color: rgba(0, 0, 0, .45);
      }
    }
  }
</style>
