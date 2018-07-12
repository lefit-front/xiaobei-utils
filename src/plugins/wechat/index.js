import wx from 'weixin-js-sdk'
import {isWeChat} from '../fit-tool-lite'
let cbList = []
let loaded = false
let firstEntry = true
const _wx = new Proxy(wx, {
  get (target, name) {
    if (!isWeChat()) {
      return function (){
        console.log('当前不是微信环境 跳过jsdk配置')
      }
    } else if (loaded && name in target) {
      return wx[name]
    } else {
      return function (...arg) {
        if (!firstEntry) {
          cbList.push({name, arg: arg})
        } else {
          firstEntry = false
          loadWx().then((res) => {
            loaded = true
            wx[name](...arg)
            if (cbList.length) {
              cbList.forEach(({name, arg}) => {
                arg = arg || {}
                wx[name](...arg)
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
  }
}

async function loadWx() {
  let res = await requestJsbill()
  wx.config({
    debug: false,
    appId: res.data.appId,
    timestamp: res.data.timestamp,
    nonceStr: res.data.nonceStr,
    signature: res.data.signature,
    jsApiList: [
      'checkJsApi', 'openLocation', 'getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems', 'uploadImage', 'chooseImage', 'scanQRCode', 'chooseWXPay'
    ]
  })
  await new Promise((resolve, reject) => {
    wx.ready(() => resolve())
    wx.error(() => reject())
  })
}
function requestJsbill () {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', '/lens/fit/h5/api/v1/wechat/jsbill?type=1&url=' + encodeURIComponent(window.location.href))
    xhr.send(null)
    xhr.onreadystatechange = () => {
      if (xhr.status === 200) {
        if (xhr.readyState === 4) {
          resolve(JSON.parse(xhr.responseText))
        }
      }
    }
  })
}