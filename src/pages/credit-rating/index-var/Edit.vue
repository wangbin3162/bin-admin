<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-form :model="form" ref="form" :rules="rules" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="变量名称" prop="">
                <b-input v-model="cache" placeholder="请输入变量名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="变量编码" prop="">
                <b-input v-model="cache" placeholder="请输入变量编码" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="变量类型" prop="">
                <b-select v-model="selected">
                  <b-option :value="0">复合变量</b-option>
                  <b-option :value="1">一般变量</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="数据类型" prop="">
                <b-select v-model="cache">
                  <b-option :value="''">数值类型</b-option>
                  <b-option :value="''">字符串类型</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row v-if="selected === 1">
            <b-col span="12">
              <b-form-item label="所属类型">
                <div flex style="width:100%;">
                  <b-input :value="cache" readonly class="choose-btn"></b-input>
                  <b-button slot="suffix" type="primary" plain
                    @click="openBelongTypeHandler" style="flex: 0 0 auto;">
                    选择
                  </b-button>
                </div>
              </b-form-item>
            </b-col>
            <b-col span="12"></b-col>
          </b-row>
          <b-row v-else>
            <b-col span="22">
              <b-form-item label="表达式">
                <b-input type="textarea" v-model="cache" placeholder="请输入el表达式"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="2" style="text-align: center">
              <b-button type="primary" plain
                @click="openSelectVarHandler">
                选择
              </b-button>
            </b-col>
          </b-row>
          <b-form-item label="描述" prop="desc">
            <b-input placeholder="请输入描述" type="textarea" :maxlength="100"></b-input>
          </b-form-item>
        </b-form>
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

      <EditParamManage></EditParamManage>
    </page-header-wrap>

    <EditBelongType :open="openBelongType" @close="openBelongType = false"></EditBelongType>
    <EditSelectVar :open="openSelectVar" @close="openSelectVar = false"></EditSelectVar>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import EditBelongType from '@/pages/credit-rating/index-var/EditBelongType'
  import EditSelectVar from '@/pages/credit-rating/index-var/EditSelectVar'
  import EditParamManage from '@/pages/credit-rating/index-var/EditParamManage'

  export default {
    name: 'IndexVarEdit',
    mixins: [commonMixin, permission],
    props: ['title'],
    components: {
      EditBelongType,
      EditSelectVar,
      EditParamManage
    },
    data () {
      return {
        cache: '',
        selected: 1,
        form: {},
        rules: {},
        openBelongType: false,
        openSelectVar: false
      }
    },
    created () {

    },
    methods: {
      handleSubmit () {

      },
      openBelongTypeHandler () {
        this.openBelongType = true
      },
      openSelectVarHandler () {
        this.openSelectVar = true
      }
    }
  }
</script>
