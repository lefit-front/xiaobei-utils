class Location {
  constructor () {
  }
  loadAMap (callback) {
    return new Promise((resolve, reject) => {
      if (window.AMap && window.AMap.Map) {
        callback()
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = 'https://webapi.amap.com/maps?v=1.3&key=fc4920b8e2e0c77f381607444389d475';
        document.head.appendChild(script);
        let timer = setInterval(function () {
          if(window.AMap && window.AMap.Map) {
            clearInterval(timer)
            timer = null
            callback && callback()
            resolve()
          }
        }, 100)
      }
    })
  }
  getLocation () {

  }

}

export default Location