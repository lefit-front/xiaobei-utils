let cbList = []
let loaded = false
let firstEntry = true
import {isApp} from '../fit-tool-lite'

export default async function (callback = () => {}) {
  if (!firstEntry) {
    cbList.push(callback)
  } else {
    firstEntry = false
    // 封装的加载方法
    if (!isApp()) {
      callback()
      return true
    }
    async function setupWebViewJavascriptBridge(callback) {
      if (window.LeFitWebViewJavascriptBridge) { return callback(LeFitWebViewJavascriptBridge); }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'lefit://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      await new Promise((resolve, reject) => {
        setTimeout(function () { document.documentElement.removeChild(WVJBIframe);resolve() }, 0)
      })
    }
    await setupWebViewJavascriptBridge(function (bridge) { })
  
    await new Promise((resolve, reject) => {
      let callback = function(bridge) {
        bridge.init(function(message, responseCallback) {})
      }
      if (window.LeFitWebViewJavascriptBridge) {
        callback(LeFitWebViewJavascriptBridge)
        resolve()
      } else {
        document.addEventListener('LeFitWebViewJavascriptBridgeReady', function() {
          callback(LeFitWebViewJavascriptBridge)
          resolve()
        }, false)
      }
    })
    // 
    loaded = true
    callback()
    if (cbList.length) {
      cbList.forEach(cb => cb())
      cbList = []
    }
  }
}
