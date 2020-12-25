
const SEARCH_HISTORY_KEY = '_search_';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '_play_';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '_favorite_';
const FAVORITE_MAX_LENGTH = 200;

// 保存搜索历史
export function saveSearch(query) {
  let searchList = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_KEY)) || [];

  let index = searchList.indexOf(query);
  if (index > -1) {
    searchList.splice(index,1);
  }

  if (searchList.length >= SEARCH_MAX_LENGTH) {
    searchList.pop();
  }

  searchList.unshift(query);
  window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchList));
  return searchList;
}

// 获取搜索历史
export function getSearch() {
  let searchList = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  return searchList;
}

export function clearSearch() {
  window.localStorage.removeItem(SEARCH_HISTORY_KEY);
  return [];
}

export function deleteOne(key) {
  let searchList = getSearch();
  let index = searchList.indexOf(key);
  if (index > -1) {
    searchList.splice(index,1);
  }
  window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchList));
  return searchList;
}

// 保存播放列表
export function savePlay(song) {
  let playList = JSON.parse(window.localStorage.getItem(PLAY_KEY)) || [];

  let index = playList.findIndex(item => {
    return item.id === song.id;
  })
  if (index > -1) {
    playList.splice(index,1);
  }

  if (playList.length >= PLAY_MAX_LENGTH) {
    playList.pop();
  }

  playList.unshift(song);
  window.localStorage.setItem(PLAY_KEY, JSON.stringify(playList));
  return playList;
}

// 获取播放列表
export function getPlay() {
  let playList = JSON.parse(window.localStorage.getItem(PLAY_KEY)) || [];
  return playList;
}


