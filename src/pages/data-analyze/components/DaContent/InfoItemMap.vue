<template>
  <div class="info-item-map">
    <page-header-wrap title="信息项映射" show-close @on-close="$emit('close')">
      <v-edit-wrap>

        <b-form label-position="left" :label-width="50">
          <div flex="box:mean">
            <b-form-item label="别名" class="mr-15">
              <b-input disabled placeholder="key"></b-input>
            </b-form-item>

            <b-form-item label="标题" class="mr-15">
              <b-input placeholder="请输入标题"></b-input>
            </b-form-item>

            <b-form-item label="类型" class="mr-15">
              <b-select style="width: 100%;">
                <!-- <b-option></b-option> -->
              </b-select>
            </b-form-item>

            <b-form-item label="" class="mr-15">
              <b-button type="primary" plain>移除</b-button>
            </b-form-item>
          </div>
        </b-form>

        <b-button type="primary" plain style="width: 100%;"
          @click="openSelectResponse = true">
          添加
        </b-button>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" >确 认</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

    <select-response v-model="openSelectResponse">
    </select-response>
  </div>
</template>

<script>
  import SelectResponse from './SelectResponse'

  export default {
    name: 'InfoItemMap',
    props: {
      initMappingItems: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      SelectResponse
    },
    data () {
      return {
        openSelectResponse: false,
        columns: [
          { type: 'index', width: 50 },
          { title: '别名', key: '' },
          { title: '标题', key: '' },
          { title: '类型', key: '' },
          { title: '配置', key: '' },
          { title: '操作', slot: 'action' }
        ]
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .info-item-map {

  }
</style>
