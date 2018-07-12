import {isApp} from '../fit-tool-lite'
import loadJsBridge from './loadJsBridge'
let cbList = []
let loaded = false
let firstEntry = true

const funHander = function (operate, name, ...arg) {
  if (!isApp()) {
    console.log('当前不是app环境 无法执行操作')
  } else if (loaded && window.LeFitWebViewJavascriptBridge) {
    window.LeFitWebViewJavascriptBridge[operate](name, ...arg)
  } else {
    if (!firstEntry) {
      cbList.push({name, arg: arg, operate})
    } else {
      firstEntry = false
      loadJsBridge().then((res) => {
        loaded = true
        window.LeFitWebViewJavascriptBridge[operate](name, ...arg)
        console.log(cbList)
        if (cbList.length) {
          cbList.forEach(({operate, name, arg}) => {
            window.LeFitWebViewJavascriptBridge[operate](name, ...arg)
          })
          cbList = []
        }
      }).catch(err => {
        loaded = true
        console.log(err)
      })
    }
  }
}

export default {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$native', {
      get () {
        return {
          callHandler: funHander.bind(null, 'callHandler'),
          call: funHander.bind(null, 'callHandler'),
          registerHandler: funHander.bind(null, 'registerHandler'),
          register: funHander.bind(null, 'registerHandler'),
          addEventListener: funHander.bind(null, 'registerHandler'),
          addEvent: funHander.bind(null, 'registerHandler')
        }
      }
    })
  }
}
