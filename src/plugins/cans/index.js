import Cansf from './cansf'
class Cans extends Cansf{
  constructor (canvas) {
    super(canvas)
  }
  async render (config) {
    this.setCanvas(config)
    await this.resolveImages(config.images)
    this.resolveTexts(config.texts)
    this.resolveLines(config.lines)
  }
  setCanvas ({background, width, height}) {
    width && (this.canvas.width = width)
    height && (this.canvas.height = height)
    this.ctx.fillStyle = background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  resolveLines (lines = []) {
    lines.forEach(v => {
      this.drawLine(
        v.sx,
        v.sy,
        v.ex,
        v.ey,
        v.lineWidth,
        v.color,
        v.style,
        v.shadow,
        v.callback
      )
    })
  }
  resolveTexts (texts = []) {
    texts.forEach(v => {
      this.drawText(
        v.text,
        v.x,
        v.y,
        {
          fontSize: v.fontSize,
          fontWeight: v.fontWeight,
          color: v.color,
          letterSpacing: v.letterSpacing,
          fontStyle: v.fontStyle,
          width: v.width,
          textAlign: v.textAlign,
          lineHeight: v.lineHeight,
          shadow: v.shadow,
          callback: v.callback
        }
      )
    })
  }
  async resolveImages (images = []) {
    let res = await Promise.all(images.map(v => this.getCache(v.source)))
    // 下面虽然异步 但实际执行的同步代码
    res.map(async (img, index) => {
      if (!img) {
        console.log('图片加载失败 无法渲染: ' + images[index].source)
        return null
      }
      const {x, y, width, height, border, shadow, borderRadius, callback} = images[index]
      return await this.drawImage(
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
    })
  }
}

export default Cans