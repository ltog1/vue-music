
const SEARCH_HISTORY_KEY = '_search_';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '_play_';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '_favorite_';
const FAVORITE_MAX_LENGTH = 200;


function insertArray(list,fn,length,val) {
  let index = list.findIndex(fn);
  if (index > -1) {
    list.splice(index,1)
  }

  if (list.length >= length) {
    list.pop();
  }
  list.unshift(val);
}

function deleteFromArray(list,fn) {
  let index = list.findIndex(fn);
  if (index > -1) {
    list.splice(index,1);
  }
}


// 保存搜索历史
function saveSearch(query) {
  let searchList = getSearch();

  insertArray(searchList,(item) => {
    return item === query;
  },SEARCH_MAX_LENGTH,query);

  window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchList));
  return searchList;
}

// 获取搜索历史
function getSearch() {
  let searchList = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  return searchList;
}

function clearSearch() {
  window.localStorage.removeItem(SEARCH_HISTORY_KEY);
  return [];
}


function deleteOne(key) {
  let searchList = getSearch();

  deleteFromArray(searchList,(item) => {
    return item === key;
  });

  window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchList));
  return searchList;
}

// 保存播放列表
function savePlay(song) {
  let playList = getPlay();

  insertArray(playList,(item) => {
    return item.id === song.id;
  },PLAY_MAX_LENGTH,song);

  window.localStorage.setItem(PLAY_KEY, JSON.stringify(playList));
  return playList;
}

// 获取播放列表
function getPlay() {
  let playList = JSON.parse(window.localStorage.getItem(PLAY_KEY)) || [];
  return playList;
}

// 保存收藏列表
function saveFavorite(song) {
  let favoriteList = getFavorite();

  insertArray(favoriteList,(item) => {
    return item.id === song.id;
  },FAVORITE_MAX_LENGTH,song);

  window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList));
  return favoriteList;
}

// 删除某个收藏歌曲
function deleteFavorite(song) {
  let favoriteList = getFavorite();

  deleteFromArray(favoriteList,(item) => {
    return item.id === song.id;
  });

  window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList));
  return favoriteList;
}

// 获取收藏列表
function getFavorite() {
  let favoriteList = JSON.parse(window.localStorage.getItem(FAVORITE_KEY)) || [];
  return favoriteList;
}

export default {
  saveSearch,
  getSearch,
  clearSearch,
  deleteOne,
  savePlay,
  getPlay,
  saveFavorite,
  deleteFavorite,
  getFavorite,
}