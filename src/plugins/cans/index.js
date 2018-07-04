// canvas 静态方法
class cans {
  constructor (config, canvas) {
    this.canvas = canvas || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = config.width
    this.canvas.height = config.height
    this.cache = {}
    this.drawImage = async (source, x, y, w, h, props = {}) => {
      let { borderWidth, borderColor, circle, shadow } = props
      this.ctx.strokeStyle = borderColor
      this.ctx.lineWidth = borderWidth
      if (shadow) {
        this.setShadow(shadow, x, y, w, h)
      }
      let img = typeof source === 'string' ? await this.getCache(source) : source
      if (circle) {
        let canvas = this.clipAvatar(img, w, h)
        this.ctx.drawImage(canvas, x, y, w, h)
        this.ctx.beginPath()
        this.ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI)
        this.ctx.stroke()
      } else{
        this.ctx.drawImage(img, x, y, w, h)
        this.ctx.strokeRect(x - borderWidth / 2, y - borderWidth / 2, w + borderWidth, h + borderWidth)
      }
    }
    this.drawLine = (sx, sy, ex, ey, w, color) => {
      this.ctx.beginPath()
      this.ctx.moveTo(sx,sy)
      this.ctx.lineWidth = w
      this.ctx.lineTo(ex, ey)
      this.ctx.strokeStyle = color
      this.ctx.stroke()
    }
    this.drawText = (text, x, y, props = {}) => {
      let { color = '#000', fontSize = '10px', fontWeight = '', fontStyle = ''} = props
      this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize} PingFangSC-Regular`
      this.ctx.fillStyle = color
      this.ctx.fillText(text, x, y + ~~fontSize.replace(/([\d]+)px/, '$1'))
    }
    this.toDataURL = function (...arg) {
      this.canvas.toDataURL(...arg)
    }
    this.reset = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

  }
  async loadImg (src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      if (!this.isBase64(src) && !this.isSomeHost(src)) {
        img.crossOrigin = 'Anonymous'
      }
      img.src = src
      img.addEventListener('load', loadEvt)
      img.addEventListener('error', errorEvt)
      function loadEvt () {
        return resolve(img)
        removeEvt()
      }
      function errorEvt() {
        console.log('loadImg 图片加载失败: ' + src)
        return resolve()
        removeEvt()
      }
      function removeEvt () {
        img.removeEventListener('load', loadEvt)
        img.removeEventListener('error', errorEvt)
      }
    })
  }
  async getCache (src) {
    let key = this.isBase64(src) ? src.slice(-18) : src
    if (!Object.hasOwnProperty(this.cache, key)) {
      this.cache[key] = await this.loadImg(src)
    }
    return this.cache[key]
  }
  isBase64 (src) {
    return /^data:image\/jpg;base64,/.test(src)
  }
  isSomeHost (src) {
    let result = src.match(/^https?:\/\/[^\/\?#:]+/)
    if (result && result[0] === window.location.hostname) {
      return true
    } else {
      return false
    }
  }
  clipAvatar (imgObj, w, h) {
    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(imgObj, 0, 0, w, h)
    return canvas
  }
  setShadow (shadow) {
    let [,shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor]  = (shadow || {}).match(/([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]+([rgba#()\d,\.\s\w]+)/)
    this.ctx.shadowOffsetX = shadowOffsetX
    this.ctx.shadowOffsetY = shadowOffsetY
    this.ctx.shadowBlur = shadowBlur
    this.ctx.shadowColor = shadowColor
  }
}

export default cans