<template>
  <div class="repair-apply-detail">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <div style="position: relative; min-height: 200px;">
            <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
            <table class="table">
              <tr v-for="(row, index) in fieldList" :key="index">
                <template v-for="col in row">
                  <td :key="col.fieldName">
                    {{ col.fieldTitle}}
                  </td>

                  <td :key="col.fieldName + '2'" :colspan="row.length < 2 ? 3 : 1">
                    {{ baseInfo[col.fieldName] }}
                  </td>

                  <!-- <template v-if="row.length < 2">
                    <td :key="col.fieldName + '3'"></td>
                    <td :key="col.fieldName + '4'"></td>
                  </template> -->
                </template>
              </tr>
            </table>
          </div>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import { Decode, MaskCode } from '../../../../common/utils/secret'
  import {
    getCreditInfo, getNaturalDetail,
    getResourceDetailField, getDetailContent
  } from '../../../../api/credit-rating/model-count.api'

  export default {
    name: 'FocusRosterBaseInfo',
    props: [
      'title',
      'personId',
      'resourceKey'
    ],
    components: {

    },
    data () {
      return {
        loading: false,
        fieldList: [], // 字段列表
        baseInfo: {}
      }
    },
    created () {
      this.getBaseInfo(this.personId, this.resourceKey)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 根据主体id，resourceKey获取对应详情字段与详情信息
       * @param {string} id 主体id
       * @param {string} resourceKey 资源key
       * @returns {Promise}
       */
      async getBaseInfo (id, resourceKey) {
        this.loading = true
        try {
          const [fieldList, baseInfo] = await Promise.all([
            getResourceDetailField(resourceKey),
            getDetailContent(id, resourceKey)
          ])

          // 删除掉person_id字段
          const index = fieldList.findIndex(item => item.fieldName === 'person_id')
          fieldList.splice(index, 1)

          const list = []
          for (let i = 0; i < fieldList.length; i++) {
            const el = fieldList[i]
            if (i % 2 === 0) list.push(fieldList.slice(i, i + 2))
            if (el.isEncrypt === '1') baseInfo[el.fieldName] = Decode(baseInfo[el.fieldName])
            if (el.maskModel) baseInfo[el.fieldName] = MaskCode(baseInfo[el.fieldName], el.maskModel)
          }

          this.fieldList = list
          this.baseInfo = baseInfo
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
.repair-apply-detail {
  .table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    width: 100%;

    td, th {
      border: 1px solid #cad9ea;
      border: 1px solid #e8eaec;
      color: #666;
      height: 40px;
    }
    td:nth-child(odd), th:nth-child(odd) {
      width: 20%;
      padding-right: 15px;
      text-align: right;
      background: #f5fafa;
      background: #fafafa;
    }
    td:nth-child(even), th:nth-child(even) {
      width: 30%;
      padding: 5px;
      padding-left: 10px;
      text-align: left;
      background: #ffffff;
    }
    tr:hover {
      td {
        background: #f4f5f6;
        transition: background 0.7s;
      }
    }
    // tr:nth-child(odd) {
    //   background: #f5fafa;
    // }
    // tr:nth-child(even) {
    //   background: #ffffff;
    // }
  }
}
</style>
