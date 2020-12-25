export function getRandomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
  // return Math.floor(Math.random() * (max + 1))
}


// 洗牌函数(数组打乱)
export function shuffle(arr) {
  let _arr = arr.concat();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0,i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

export function debounce(func,delay) {
  let timer;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    },delay)
  }
}