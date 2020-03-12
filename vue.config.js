// cli3,4很多配置文件都被隐藏到node_modules的@vue中，建议不修改@vue中的配置文件
// 创建一个vue.config.js文件，来修改配置文件，这里的配置文件最后会和@vue中的配置文件合并
module.exports = {
  // 配置路径别名
  configureWebpack: {
    resolve: {
      //配置可以不添加后缀 默认配置过了
      // extensions: [],
      // 配置别名
      alias: {
        // 默认配置
        // '@': 'src'
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  } 
}