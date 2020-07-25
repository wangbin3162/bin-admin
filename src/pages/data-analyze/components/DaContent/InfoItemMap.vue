<template>
  <div class="info-item-map">
    <page-header-wrap title="信息项映射" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-table :columns="[]" :data="[]" class="mb-15">
          <template v-slot:action="">
            <b-button type="text">
              移除
            </b-button>
          </template>
        </b-table>

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
