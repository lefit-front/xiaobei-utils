import {isApp} from '../fit-tool-lite'
import loadJsBridge from './loadJsBridge'

const funHander = function (operate, name, ...arg) {
  if (!isApp()) {
    console.log('当前不是app环境 无法执行操作')
  } else if (window.LeFitWebViewJavascriptBridge) {
    window.LeFitWebViewJavascriptBridge[operate](name, ...arg)
  } else {
    loadJsBridge(function () {
      console.log(window.LeFitWebViewJavascriptBridge, 11)
      window.LeFitWebViewJavascriptBridge[operate](name, ...arg)
    })
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
    loadJsBridge()
  },
  init: loadJsBridge
}
