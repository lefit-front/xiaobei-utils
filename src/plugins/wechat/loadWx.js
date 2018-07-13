import wx from 'weixin-js-sdk'
import {isWeChat} from '../fit-tool-lite'
let cbList = []
let loaded = false
let firstEntry = true

export default async function loadWx(callback = () => {}) {
  if (!isWeChat()) {
    return true
  }
  if (!firstEntry) {
    cbList.push(callback)
  } else {
    firstEntry = false
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
      wx.error((err) => resolve(err))
    })
    loaded = true
    callback()
    if (cbList.length) {
      cbList.forEach(cb => cb())
      cbList = []
    }
  }
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