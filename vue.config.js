const path = require('path');
const axios = require('axios');

// function resolve(dir) {
//   return path.join(__dirname,dir);
// }
// 上面resolve函数等同于
const resolve = dir => {
  // __dirname表示当前目录
  return path.join(__dirname,dir);
}

module.exports = {
  devServer: {
    // server端发起axios请求
    before(app) {
      // 热门歌单推荐
      app.get('/api/getDiscList', (req,res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
        axios.get(url,{
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query,
        }).then(data => {
          res.json(data.data);
        }).catch(e => {
          console.log(e);
        })
      });
    },
    proxy: {
      // 代理轮播图接口
      '/api/getTopBanner': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true,
        pathRewrite: {
          '^/api/getTopBanner': ''
        }
      },
      // 代理歌手列表接口
      '/api/getSingerList': {
        target: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
        changeOrigin: true,
        pathRewrite: {
          '^/api/getSingerList': ''
        }
      },
      // 代理歌手详情接口
      '/api/getSingerDetail': {
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        changeOrigin: true,
        pathRewrite: {
          '^/api/getSingerDetail': ''
        }
      },
    },
  },

  chainWebpack(config) {
    config.resolve.alias
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('components', resolve('src/components'))
      .set('base',resolve('src/base'))
  }
}
