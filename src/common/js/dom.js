
export const addClass = (el,className) => {
  if (el.classList.contains(className)) {
    return className;
  }
  el.classList.add(className);
}

export const getDataAttr = (el,name) => {
  const prefix = 'data-';
  return el.getAttribute(prefix + name);
}