// 序列化歌手详情数据,创建每首歌所需数据
export const createSong = (musicData) => {
  return {
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url,
    filename: `C400${musicData.mid}.m4a`
  }
}

const filterSinger = (singer) => {
  let result = [];
  singer.forEach(item => {
    result.push(item.name)
  });
  return result.join('/');
}