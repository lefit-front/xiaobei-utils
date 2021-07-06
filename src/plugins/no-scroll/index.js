function getScrollTop() {
  return document.scrollingElement.scrollTop
}
export default {
  install(Vue) {
    Vue.directive('noScroll', {
      inserted: function (el, binding, vnode) {
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.top = -getScrollTop() + 'px'
      },
      unbind: function (el, binding, vnode) {
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        document.scrollingElement.scrollTop = getScrollTop()
      }
    })
  }
}