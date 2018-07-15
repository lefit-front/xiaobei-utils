import Cansf from './cansf'
import './letter-spacing'
class Cans extends Cansf{
  constructor (canvas) {
    super(canvas)
    this.render = async (config) => {
      this.setCanvas(config)
      await this.resolveImages(config.images)
      await this.resolveTexts(config.texts)
      await this.resolveLines(config.lines)
      return this
    }
  }
  setCanvas ({background, width, height}) {
    width && (this.canvas.width = width)
    height && (this.canvas.height = height)
    this.ctx.fillStyle = background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  async resolveLines (lines = []) {
    for (let i = 0; i < lines.length; i++) {
      let {sx, sy, ex, ey, lineWidth, color, style, shadow, callback} = lines[i]
      await this.drawLine(sx, sy, ex, ey, lineWidth, color, style, shadow, callback)
    }
  }
  async resolveTexts (texts = []) {
    for (let i = 0; i < texts.length; i++) {
      let { text, x, y, ...arg } = texts[i]
      await this.drawText(text, x, y, arg)
    }
  }
  async resolveImages (images = []) {
    let res = await Promise.all(images.map(v => this.getCache(v.source)))
    for (let i = 0; i < res.length; i++) {
      let img = res[i]
      if (!img) {
        console.log('图片加载失败 无法渲染: ' + images[i].source)
        break
      }
      const {x, y, width, height, border, shadow, borderRadius, callback} = images[i]
      await this.drawImage(
        img,
        x,
        y,
        width,
        height,
        {
          border,
          shadow,
          borderRadius,
          callback
        }
      )
    }
  }
}

export default Cans