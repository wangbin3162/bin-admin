<template>
  <div>
    <b-drawer v-model="open" title="编辑对象" width="720" append-to-body :mask-closable="false">
      <b-form :model="formInline" ref="form" label-position="top">
        <div flex="box:mean">
          <b-form-item label="用户名" prop="name" class="mr-15">
            <b-input v-model="formInline.name" placeholder="用户名"></b-input>
          </b-form-item>
          <b-form-item label="邮箱" prop="mail">
            <b-input v-model="formInline.mail" placeholder="邮箱"></b-input>
          </b-form-item>
        </div>
        <div flex="box:mean">
          <b-form-item label="用户名" prop="name" class="mr-15">
            <b-input v-model="formInline.name" placeholder="用户名"></b-input>
          </b-form-item>
          <b-form-item label="邮箱" prop="mail">
            <b-input v-model="formInline.mail" placeholder="邮箱"></b-input>
          </b-form-item>
        </div>
        <div flex="box:mean">
          <b-form-item label="出生日期" prop="birthday" class="mr-15">
              <b-date-picker type="date" v-model="formInline.birthday" placeholder="选择出生日期"></b-date-picker>
          </b-form-item>
          <b-form-item label="时间" prop="time">
              <b-time-picker v-model="formInline.time" placeholder="选择时间"></b-time-picker>
          </b-form-item>
        </div>
        <div flex="box:mean">
          <b-form-item label="城市" prop="city" class="mr-15">
            <b-select v-model="formInline.city" clearable>
              <b-option value="beijing" label="北京"></b-option>
              <b-option value="shanghai" label="上海"></b-option>
              <b-option value="xuzhou" label="徐州"></b-option>
            </b-select>
          </b-form-item>
          <b-form-item label="地址" prop="mail">
            <b-input v-model="formInline.address" placeholder="地址"></b-input>
          </b-form-item>
        </div>
        <b-form-item label="描述" prop="desc">
          <b-input v-model="formInline.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></b-input>
        </b-form-item>
      </b-form>
      <div slot="footer">
        <b-button @click="open = false">取 消</b-button>
        <b-button type="primary" @click="open = false">提 交</b-button>
      </div>
    </b-drawer>
  </div>
</template>

<script>
  export default {
    name: 'EditSection',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        open: this.value,
        formInline: {
          name: '',
          mail: '',
          birthday: '',
          time: '',
          city: '',
          address: '',
          desc: ''
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    methods: {

    }
  }
</script>
