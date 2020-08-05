<template>
  <div class="content-test-panel">
    <page-header-wrap show-close :title="`[${contentName}] 测试`" @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <interface-test
          :initParam="{
            contentId,
            mappingFields
          }"
          :inside="false">
        </interface-test>

        <div slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
        </div>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import InterfaceTest from './InterfaceTest'

  export default {
    name: 'ContentTestPanel',
    props: {
      initContentId: {
        type: String,
        required: true
      },
      initContentName: {
        type: String,
        rtequired: true
      },
      initMappingFields: {
        type: String,
        required: true
      }
    },
    components: {
      InterfaceTest
    },
    data () {
      return {
        loading: false,
        contentId: this.initContentId,
        contentName: this.initContentName,
        mappingFields: this.initMappingFields
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
 .content-test-panel {
    .test-con {
      display: flex;

      .border {
        border-bottom: 1px solid #d9d9d9;
      }

      .left {
        padding: 0 10px;
        width: 50%;
        border-right: 1px solid #d9d9d9;

        .btn-con {
          display: flex;
          flex-wrap: wrap;
          width: 100%

          .block-btn {
            margin-bottom: 20px;
            padding: 10px;
            width: 30%;
            border: 1px solid #d9d9d9;
            cursor: pointer;
            transition: all 0.4s;

            p {
              font-size: 13px;
            }

            &:hover {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
            &.actived {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
            &.error {
              border: 1px solid #ff7072;
              box-shadow: 0 2px 10px 0 rgba(255, 112, 114, 1);
            }
          }
        }

        .form {
          display: flex;
          flex-wrap: wrap;

          .form-item {
            width: 45%;
          }
        }
      }

      .right {
        padding: 0 10px;
        width: 50%;
      }
    }
 }
</style>
