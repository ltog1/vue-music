import axios from 'axios'

// 获取热门搜索
export function getHotKet() {
  const url = '/api/getHotKey';

  const params = Object.assign({}, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return axios.get(url, {
    params
  }).then(res => {
    if (res.code === 0) {
      return res.data.hotkey;
    }
  })
}

// 获取搜索结果
export function search(query,page,perpage,zhida) {
  const url = '/api/search';

  const params = Object.assign({}, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });

  return axios.get(url, {
    params
  }).then(res => {
    if (res.code === 0) {
      return res.data;
    }
  })
}