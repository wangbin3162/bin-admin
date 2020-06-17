<template>
  <div class="source-wrap">
    <div class="logo">
      <img v-if="dbTypeName==='kingbase'"
           src="../../../../../assets/images/db/kingbase.png" alt="kingbase">

      <img v-if="dbTypeName==='mysql'"
           src="../../../../../assets/images/db/mysql.png" alt="mysql">

      <img v-if="dbTypeName==='oracle'"
           src="../../../../../assets/images/db/oracle.png" alt="oracle">

      <img v-if="dbTypeName==='postgresql'"
           src="../../../../../assets/images/db/postgresql.png" alt="postgresql">

      <img v-if="dbTypeName==='sqlserver'"
           src="../../../../../assets/images/db/sqlserver.png" alt="sqlserver">
    </div>
    <div class="info">
      <div flex="box:mean">
        <v-simple-label label="数据源名称">{{ dataSourceName }}</v-simple-label>
        <v-simple-label label="连接类型">{{ dbType }}</v-simple-label>
      </div>
      <div flex="box:mean">
        <v-simple-label label="数据库名称">{{ dbName }}</v-simple-label>
        <v-simple-label label="连接驱动">{{ driverClass }}</v-simple-label>
      </div>
      <div flex="box:mean">
        <v-simple-label label="主机地址">{{ host }}</v-simple-label>
        <v-simple-label label="端口号">{{ port }}</v-simple-label>
      </div>
      <v-simple-label label="用户名">{{ userName }}</v-simple-label>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SourceInfo',
    props: {
      dataSourceName: String,
      dbType: String,
      dbName: String,
      driverClass: String,
      host: String,
      port: [String, Number],
      userName: String
    },
    computed: {
      dbTypeName() {
        if (this.$isNotEmpty(this.dbType)) {
          return this.dbType.toLowerCase()
        }
        return null
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .source-wrap {
    display: flex;
    margin: 8px;
    border: 1px solid #eeeeee;
    box-shadow: 0 0 5px #eeeeee;
    user-select: text;
    .logo {
      width: 211px;
      height: 170px;
      background: #fafafa;
      border-right: 1px solid #eeeeee;
      img {
        width: 100%;
      }
    }
    .info {
      padding: 16px;
      height: 170px;
      flex: 1;
      .key-label {
        padding-bottom: 4px;
      }
    }
  }
</style>
