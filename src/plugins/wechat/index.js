import wx from 'weixin-js-sdk'
import {isWeChat} from '../fit-tool-lite'
import loadWx from './loadWx'

const _wx = new Proxy(wx, {
  get (target, name) {
    if (!isWeChat()) {
      return function (){
        console.log('当前不是微信环境 跳过jsdk配置')
      }
    } else if (name in target) {
      return wx[name]
    } else {
      return function (...arg) {
        loadWx(() => wx[name](...arg)).catch((err) => console.log(err) )
      }
    }
  }
})

export default {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$wx', {
      value: _wx
    })
    Object.defineProperty(window, 'wx', {
      value: _wx
    })
    loadWx().catch((err) => console.log(err) )
  },
  init: loadWx
}