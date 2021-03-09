// 配置路径别名
var path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 配置基础链接地址，根据发布环境添加
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',
  // dev跨域问题
  // devServer: {
  //   proxy: {
  //     '/admin': { target: 'http://localhost:8088/cms' }
  //   }
  // },
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  assetsDir: 'static',
  filenameHashing: true, // 发布打包文件是否有哈希后缀
  configureWebpack: {
    externals: {
      './cptable': 'var cptable',
      '../xlsx.js': 'var _XLSX'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
