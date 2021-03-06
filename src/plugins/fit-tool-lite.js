export function getCookie (name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}
export function setCookieDomain (cName, value, maxAge) {
  document.cookie = cName + '=' + escape(value) + ((maxAge === null) ? '' : ';max-age=' + maxAge) + ';path=/;domain=leoao.com'
}
export function isWeChat () {
  return window.navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1
}
export function isApp () {
  return !!window.navigator.userAgent.match('LEFIT')
}