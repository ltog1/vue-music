import jsonp from 'jsonp'

// 转换url地址参数
const param = (param) => {
  let url = ''
  for (let key in param) {
    let value = param[key] ? param[key] : '';
    url += `&${key}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}

// data是url地址的参数
export default (url,data,options) => {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);

  return new Promise((resolve, reject) => {
    jsonp(url,options,(err,data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}