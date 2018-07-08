// canvas 静态方法
const px2Num = function (val) {
  return ~~val.replace(/([\d]+)px/, '$1')
}
const percent2Num = function (v) {
  return ~~v.replace('%', '') / 100
}

class Cansf {
  constructor (canvas) {
    this.canvas = canvas || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.cache = {}
    this.drawImage = async (source, x, y, w, h, props = {}) => {
      let { border, shadow, borderRadius, callback } = props
      let bw = 0
      if (shadow) {
        this.setShadow(shadow)
      } else {
        this.setShadow('0 0 0 transparent')
      }
      if (border) {
        let [, borderWidth, borderStyle, borderColor] = border.match(/([\d]+(px)?)\s+(solid|dashed)\s+([#\w\d]+)/)
        this.ctx.strokeStyle = borderColor
        bw = px2Num(borderWidth)
        this.ctx.lineWidth = bw
        borderStyle === 'dashed' && this.ctx.setLineDash([2, 2])
      }
      let img = await this.getCache(source)
      if (borderRadius) {
        let canvas = this.imageRadiusClip(img, borderRadius)
        this.ctx.drawImage(canvas, x, y, w, h)
        border && this.borderRadiusClip(x, y, w, h , borderRadius)
      } else{
        this.ctx.drawImage(img, x, y, w, h)
        bw && this.ctx.strokeRect(x - bw / 2, y - bw / 2, w + bw, h + bw)
      }
      callback && await callback(this)
    }
    this.drawLine = async (sx, sy, ex, ey, w, color, style, shadow, callback) => {
      if (shadow) {
        this.setShadow(shadow)
      } else {
        this.setShadow('0 0 0 transparent')
      }
      style === 'dashed' && this.ctx.setLineDash([2, 2])
      this.ctx.beginPath()
      this.ctx.moveTo(sx,sy)
      this.ctx.lineWidth = w
      this.ctx.lineTo(ex, ey)
      this.ctx.strokeStyle = color
      this.ctx.stroke()
      callback && await callback(this)
    }
    this.drawText = async (text, x, y, props = {}) => {
      let { color = '#000', fontSize = '10px', fontWeight = '', fontStyle = '', letterSpacing = '',
       width, textAlign, hasBreak = false, lineHeight, shadow, callback} = props
      if (shadow) {
        this.setShadow(shadow)
      } else {
        this.setShadow('0 0 0 transparent')
      }
      this.canvas.style.letterSpacing = letterSpacing ?  letterSpacing : '0px'
      this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize} PingFangSC-Regular`
      this.ctx.fillStyle = color
      if (width) {
        for (let i = 0; i < text.length; i++) {
          if (this.ctx.measureText(text.slice(0, i + 1)).width > width) {
            this.drawText(text.slice(0, i), x, y, {
              ...props,
              hasBreak: true
            })
            lineHeight = lineHeight ? px2Num(lineHeight) : px2Num(fontSize)
            this.drawText(text.slice(i), x, y + lineHeight, props)
            return
          }
        }
      }
      if (textAlign && width || hasBreak) {
        switch (textAlign) {
          case 'right':
            x = x + width
            this.ctx.textAlign = 'right'
            break
          case 'center':
            x = (x + width )/ 2
            this.ctx.textAlign = 'center'
            break
        }
      }
      this.ctx.fillText(text, x, y + ~~fontSize.replace(/([\d]+)px/, '$1'))
      callback && await callback(this, this.ctx.measureText(text))

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
        removeEvt()
        return resolve(img)
      }
      function errorEvt() {
        console.log('loadImg 图片加载失败: ' + src)
        removeEvt()
        return resolve()
      }
      function removeEvt () {
        img.removeEventListener('load', loadEvt)
        img.removeEventListener('error', errorEvt)
      }
    })
  }
  async getCache (source) {
    if (typeof source === 'string') {
      let key = this.isBase64(source) ? source.slice(-18) : source
      if (!Object.hasOwnProperty(this.cache, key)) {
        let img = await this.loadImg(source)
        if (img) {
          this.cache[key] = img
        }
      }
      return this.cache[key] || null
    } else {
      return source
    }
    
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
  imageRadiusClip (imgObj, r) {
    let canvas = document.createElement('canvas')
    let w = imgObj.width
    let h = imgObj.height
    canvas.width = w
    canvas.height = h
    let ctx = canvas.getContext('2d')
    let pattern = ctx.createPattern(imgObj, 'no-repeat')
    let min_size = Math.min(w, h)
    let x = 0
    let y = 0
    r = min_size * percent2Num(r)
    if (r > min_size / 2) r = min_size / 2
    // 开始绘制
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    ctx.fillStyle = pattern
    ctx.fill()
    return canvas
  }
  borderRadiusClip (x, y, w, h, r) {
    let min_size = Math.min(w, h)
    r = min_size * percent2Num(r)
    this.ctx.beginPath()
    this.ctx.moveTo(x + r, y)
    this.ctx.arcTo(x + w, y, x + w, y + h, r)
    this.ctx.arcTo(x + w, y + h, x, y + h, r)
    this.ctx.arcTo(x, y + h, x, y, r)
    this.ctx.arcTo(x, y, x + w, y, r)
    this.ctx.closePath()
    this.ctx.stroke()
  }
  setShadow (shadow) {
    let [,shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor]  = (shadow || {}).match(/([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]+([rgba#()\d,\.\s\w]+)/)
    this.ctx.shadowOffsetX = shadowOffsetX
    this.ctx.shadowOffsetY = shadowOffsetY
    this.ctx.shadowBlur = shadowBlur
    this.ctx.shadowColor = shadowColor
  }
  output (tiny) {
    if (!tiny) {
      return this.canvas.toDataURL()
    } else {
      return this.canvas.toDataURL('image/jpeg', tiny)
    }
  }
}
export default Cansf