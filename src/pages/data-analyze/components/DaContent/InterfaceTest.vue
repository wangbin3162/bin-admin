<template>
  <div class="interface-test">
    <b-collapse-wrap  title="测试接口" collapse>
      <div class="test-con">
        <div class="left">
           <div class="btn-con">
             <div class="block-btn mr-15" v-for="n in 7" :key="n">
              <p class="t-ellipsis" title="接口1">
                接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1接口1
              </p>
              <p class="t-ellipsis" title="名称">
                名称：
              </p>
            </div>
           </div>
        </div>

        <div class="right">
          <b-ace-editor value="" readonly>
          </b-ace-editor>
        </div>
      </div>
    </b-collapse-wrap>
  </div>
</template>

<script>
  import { getMultiInterfaceTemplateParam } from '../../../../api/data-analyze/da-content.api'

  export default {
    name: 'InterfaceTest',
    props: {
      initParam: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        contentId: '',
        mappingFields: []
      }
    },
    watch: {
      initParam: {
        handler (newVal) {
          if (newVal) {
            this.contentId = newVal.contentId
            this.mappingFields = JSON.parse(newVal.mappingFields)
          }
        }
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .interface-test {
    .test-con {
      display: flex;

      .left {
        width: 50%;

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
              // padding-top: 5px;
              font-size: 13px;
              // color: #bfbfbf;
            }

            &:hover {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
            &.actived {
              box-shadow: 0 2px 10px 0 rgba(121, 187, 255, 1);
            }
          }
        }
      }

      .right {
        width: 50%;
      }
    }
  }
</style>
