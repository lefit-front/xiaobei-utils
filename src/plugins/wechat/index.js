export default {
  requestJsbill () {
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
  },
  wxConfig () {
    
  }
}