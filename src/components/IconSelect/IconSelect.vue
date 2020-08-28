<template>
  <div class="icon-select">
    <b-input :size="size" :value="iconName"
             readonly clearable @on-clear="selectIcon('')">
      <b-icon :name="iconName" slot="prefix"></b-icon>
    </b-input>
    <b-button :type="buttonType" :size="size" @click="openIcon">选择</b-button>
    <b-modal title="选择图标" v-model="iconDialog" width="1000"
             :body-styles="{padding:0}" footer-hide :stop-remove-scroll="stopRemoveScroll">
      <div style="height: 500px; overflow: auto;padding: 12px 7px;">
        <div class="icon-wrap">
          <div class="icon-item" v-for="icon in iconList" :key="icon" :title="icon"
               @click="selectIcon(icon)">
            <b-icon :name="icon"></b-icon>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { icon } from './icons'

export default {
  name: 'IconSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    },
    buttonType: {
      type: String,
      default: 'default'
    },
    stopRemoveScroll: Boolean
  },
  data() {
    return {
      iconName: '',
      iconDialog: false,
      iconList: icon.split(',')
    }
  },
  watch: {
    value: {
      handler(val) {
        this.iconName = val
      },
      immediate: true
    }
  },
  methods: {
    openIcon() {
      this.iconDialog = true
    },
    selectIcon(iconName) {
      this.iconName = iconName
      this.iconDialog = false
      this.emitValue()
    },
    emitValue() {
      this.$emit('input', this.iconName)
      this.$emit('on-change', this.iconName)
    }
  }
}
</script>

<style scoped lang="stylus">
.icon-select {
  width: 100%;
  display: flex;
  .bin-button {
    left: -1px;
  }
  .icon-wrap {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    width: 970px;
    .icon-item {
      cursor: pointer;
      width: 45px;
      height: 45px;
      line-height: 45px;
      font-size: 12px;
      text-align: center;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-right: -1px;
      margin-bottom: -1px;
      .iconfont {
        font-size: 20px;
        transition: .2s;
      }
      &:hover {
        .iconfont {
          font-size: 26px;
          color: #0d85ff;
        }
      }
    }
  }
}
</style>
