import loadJsBridge from './loadJsBridge'

export default {
  install (Vue) {

    const callHandler = function (...arg) {
      loadJsBridge().then(function () {
        window.LeFitWebViewJavascriptBridge && window.LeFitWebViewJavascriptBridge.callHandler(arg)
        console.log('jsbridge 执行的参数:\n', ...arg)
      })
    }
    
    Object.defineProperty(Vue.prototype, '$JB', {
      get () {
        return {
          callHandler,
          call: callHandler
        }
      }
    })
  }
}