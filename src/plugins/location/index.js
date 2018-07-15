import JSONP from './jsonp'
import { getCookie, setCookieDomain } from '../fit-tool-lite'
class Location {
  constructor (config) {
    this.init(config || {})
    if (this.type === 'amap') {
      this.loadAMap().then(() => {
        this.amapLoaded = true
        this.initAMap()
        this.installGeoLocation()
      })
    }
  }
  init (config) {
    this.map = null
    this.breakReTry = typeof config.breakReTry === 'number' ? config.breakReTry : 0
    this.needRefresh = Boolean(config.needRefresh)
    this.geolocation = null
    this.amapLoaded = false
    this.success = false
    this.error = null
    this.defaultPosition = {
      cityId: 2,
      cityName: '北京市'
    }
    this.getLocation = async () => {
      if (!this.amapLoaded && this.type === 'amap') {
        await new Promise((resolve, reject) => {
          let timer = setInterval(() => {
            if (this.amapLoaded) {
              clearInterval(timer)
              timer = null
              resolve(true)
            }
          }, 100)
        })
      }
      if (!this.needRefresh) {
        let fitCity = JSON.parse(getCookie('fit-city') || '{}')
        if (fitCity.success) {
          this.success = true
          this.cityId = fitCity.id
          this.cityName = fitCity.name
          this.lng = Number(getCookie('fit-lng')) || null
          this.lat = Number(getCookie('fit-lat')) || null
          return this
        }
      }
      return this._getLocation()
    }
    this.type = config.type || ''
    if (!!window.navigator.userAgent.match('LEFIT')) {
      this.type = 'app'
    } else if (window.navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
      this.type = 'wechat'
    } else {
      this.type = 'amap'
    }
  }
  async _getLocation () {
    try {
      switch (this.type) {
        case 'amap': 
          let resAMap = await this.amapLocation()
          this.address = resAMap.formattedAddress
          this.lng = Number(resAMap.position.lng)
          this.lat = Number(resAMap.position.lat)
          await this.getFitCity([this.lng, this.lat])
          break
        case 'wechat':
          let resWeChat = await this.wechatLocation()
          this.lng = Number(resWeChat.longitude)
          this.lat = Number(resWeChat.latitude)
          await Promise.all([
            this.getFitCity([this.lng, this.lat]),
            this.location2AddressQQ(this.lng, this.lat)
          ])
          break
        case 'app':
        // ios端已做纠偏处理
          let resApp = await this.appLoacation()
          this.lng = Number(resApp.longitude)
          this.lat = Number(resApp.latitude)
          await this.getFitCity([this.lng, this.lat])
      }
      this.success = true
      setCookieDomain('fit-city', JSON.stringify({
        id: this.cityId,
        name: this.cityName,
        success: true
      }), 600)
      setCookieDomain('fit-lat', this.lat, 600)
      setCookieDomain('fit-lng', this.lng, 600)
      return this
    } catch (err) { 
      console.log('_getLocation执行错误' + err)
      this.error = err
      this.success = false
      if (this.breakReTry > 0) {
        console.log('重试定位...', this.breakReTry)
        this.breakReTry--
        return this._getLocation()
      } else {
        return this
      }
    }
  }
  getFitCity (location) { // 获取乐刻场地城市
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', '/lens/conduct/h5/api/v1/lapis?lk-package=public_platform.ground_sys.region&lk-class=GET_REGEO')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify({
        location: location[0] + ',' + location[1]
      }))
      xhr.onreadystatechange = () => {
        if (xhr.status === 200) {
          if (xhr.readyState === 4) {
            let res = JSON.parse(xhr.responseText)
            if (res.code === 0) {
              this.cityName = res.data.regeo.city
              this.cityId = res.data.regeo.city_id,
              this.province = res.data.regeo.province
              this.provinceId = res.data.regeo.province_id
              this.isOpenCity = res.data.regeo.is_open_city
              resolve(true)
            } else{
              reject('getFitCity获取失败')
            }
          }
        } else {
          reject('getFitCity获取失败')
        }
      }
    })
  }
  amapLocation () { // 高德地图定位
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition((status, res) => {
        if (status === 'complete') {
          resolve(res)
        } else {
          // localhost可以 ip不能绕过
          console.warn(status, res)
          console.log('手动提示:由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。 ')
          reject(res)
        }
      })
    })
  }
  wechatLocation () { // 微信定位
    return new Promise((resolve, reject) => {
      if (!window.wx) {
        reject('没有找到window.wx!')
      } else {
        window.wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: (res) => {
            // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
            // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
            // var speed = res.speed // 速度，以米/每秒计
            // var accuracy = res.accuracy // 位置精度
            resolve(res)
          }
        })
      }
    })
  }
  appLoacation () { // 乐刻app定位
    return new Promise((resolve, reject) => {
      window.LeFitWebViewJavascriptBridge &&
      window.LeFitWebViewJavascriptBridge.callHandler('getLocation',  {
        needRefresh: true
      }, (result) => {
        this.address = result.address
        // this.lat = result.latitude
        // this.lng = result.longitude
        this.selectCityId = result.selectCityId
        this.selectCityName = result.selectCityName
        // this.cityName = result.city
        // this.province = result.province
        resolve(result)
      })
    })
  }
  location2AddressAMap (cityName, location) { // 根据经纬度获取地址名称 (高德插件)
    this.installGeocoder(cityName)
    return new Promise((resolve, reject) => {
      this.geocoder.getAddress(location, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          this.address = result.regeocode && result.regeocode.formattedAddress
          resolve(true)
        } else {
          reject('location2AddressAMap根据经纬度获取地址名称失败')
        }
      })
    })
  }
  location2AddressQQ (lng, lat) { // 根据经纬度获取地址名称 (腾讯接口)
    return new Promise((resolve, reject) => {
      JSONP({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          location: lat + ',' + lng,
          key: 'OD5BZ-OBFK6-BWUSA-MWJO6-XCXF7-5AFIV',
          get_poi: 0,
          poi_options: 'policy=1',
          output: 'jsonp'
        },
        callback: (data) => {
          if (data.status === 0) {
            this.address = data.result.address
            resolve(true)
          } else {
            reject('location2AddressQQ获取失败')
          }
        }
      })
    })
  }
  loadAMap () {
    return new Promise((resolve, reject) => {
      if (window.AMap && window.AMap.Map) {
        resolve(true)
      } else {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.defer = true
        script.src = 'https://webapi.amap.com/maps?v=1.3&key=fc4920b8e2e0c77f381607444389d475';
        document.body.appendChild(script)
        let timer = setInterval(function () {
          if(window.AMap && window.AMap.Map) {
            clearInterval(timer)
            timer = null
            resolve(true)
          }
        }, 100)
      }
    })
  }
  initAMap () {
    this.map = new AMap.Map(document.createElement('div'), {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923]
    })
  }
  installGeoLocation () {
    this.map.plugin('AMap.Geolocation', () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        noGeoLocation: 0, // 0: 可以使用浏览器定位 1: 手机设备禁止使用浏览器定位 2: PC上禁止使用浏览器定位 3: 所有终端禁止使用浏览器定位
        noIpLocate: 0, //是否禁止使用IP定位，默认值为0，可选值0-3 0: 可以使用IP定位 1: 手机设备禁止使用IP定位 2: PC上禁止使用IP定位 3: 所有终端禁止使用IP定位
        GeoLocationFirst: true, // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
        convert: true, // 是否使用坐标偏移，取值true:为高德地图坐标，取值false:为浏览器定位坐标
        extensions: 'base'
      })
    })
  }
  installGeocoder (cityName) {
    this.map.plugin('AMap.Geocoder', () => {
      this.geocoder = new AMap.Geocoder({
        city: cityName || '全国', // 可选值：城市名（中文或中文全拼）、citycode、adcode；
        extensions: 'base'
      })
    })
  }
}

export default Location


// 使用注意:
// 1 手动引入jsbriage
// 2 ios在网络代理的情况下会出现获取定位失败
// https请求中出现http请求会打断定位权限的获取