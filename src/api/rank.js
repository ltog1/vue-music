import axios from 'axios'

// 获取排行榜列表
export function getTopList() {
  const url = '/api/getTopList';

  const params = Object.assign({}, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return axios.get(url, {
    params
  }).then(res => {
    if (res.code === 0) {
      return res.data.topList;
    }
  })
}

// 获取排行榜列表歌曲
export function getMusicList(topid) {
  const url = '/api/getTopMusicList';

  const params = Object.assign({}, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return axios.get(url, {
    params
  }).then(res => {
    if (res.code === 0) {
      return res.songlist;
    }
  })
}