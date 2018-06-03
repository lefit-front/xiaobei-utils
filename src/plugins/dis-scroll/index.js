function hasSign (dom, sign) {
  while (dom.attributes) {
    if (dom.attributes.hasOwnProperty(sign)) {
      return true
    }
    dom = dom.parentNode
  }
  return false
}

function getDomList(selector) { 
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0)
}

function touchstartHandle(data, evt) {
  evt.stopPropagation()
  let target = evt.target
  while (target !== this && target) {
    target = target.parentNode
  }
  if (target) {
    data.elScroll = target
    data.posY = evt.touches[0].pageY
    data.scrollY = target.scrollTop
    data.maxScroll = target.scrollHeight - target.clientHeight
  } else {
    evt.preventDefault()
  }
}

function touchmoveHandle(data, evt) {
  evt.stopPropagation()
  if (data.maxScroll <= 0) {
    evt.preventDefault()
  }
  let elScroll = data.elScroll
  let scrollTop = elScroll.scrollTop
  let distanceY = evt.touches[0].pageY - data.posY
  if (distanceY > 0 && scrollTop === 0) {
    evt.preventDefault()
  }
  if (distanceY < 0 && (scrollTop + 1 >= data.maxScroll)) {
    evt.preventDefault()
  }
}

function touchendHandle(data, evt) {
  evt.stopPropagation()
  data.maxScroll = 0
}

function removeEvt(el) {
  el.removeEventListener('touchstart', touchstartHandle)
  el.removeEventListener('touchmove', touchstartHandle)
  el.removeEventListener('touchend', touchendHandle)
}

export default {
  install(Vue) {
    Vue.directive('disScroll', {
      inserted: function (el, { value, modifiers }, vnode, oldVnode) {
        const { selector } = value || {}
        const { strict } = modifiers || {}
        let excludeList = []
        let excludeClassName = 'can-touch'
        if (strict) {
          excludeList = getDomList(`.${excludeClassName}`)
        }
        let sign = `le-${Math.random().toString(36).slice(2)}`
        el.setAttribute(sign, '')
        let data = {
          posY: 0,
          maxScroll: 0
        }
        removeEvt(el)
        el.addEventListener('touchstart', touchstartHandle.bind(el, data), false)
        el.addEventListener('touchmove', touchmoveHandle.bind(el, data), false)
        el.addEventListener('touchend', touchendHandle.bind(el, data), false)
        if (selector) {
          getDomList(selector).forEach(item => {
            item.addEventListener(strict ? 'touchstart' : 'touchmove', (evt) => {
              let condition = strict
                ? excludeList.some(v => evt.target.className.includes(excludeClassName))
                : false
              !hasSign(evt.target, sign) && !condition && evt.preventDefault()
            }, false)
          })
        }
      },
      unbind: function (el) {
        removeEvt(el)
      }
    })
  }
}