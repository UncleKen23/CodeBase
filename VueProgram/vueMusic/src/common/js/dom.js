export function addClass(el, clsName) {
  if (hasClass(el, clsName)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(clsName)
  el.className = newClass.join(' ')
}

export function hasClass(el, clsName) {
  let reg = new RegExp('(^|\\s)' + clsName + '(\\s|$)')
  return reg.test(el.className)
}