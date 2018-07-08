# Cans - canvas static

### canvas的静态方法处理方案

> 基于营销业务对于海报的强大需求 结合每次海报分享图的样式分析 封装的一款h5端canvas的静态方法集

## 使用方法

```javascript
  import Cans from 'cans'

  let cans = new Cans()
  // or let cans new Cans(this.$refs.canvas)
  let cansConfig = {
    width: 100,
    height: 500,
    background: '#fa4a11',
    images: [...],
    texts: [...],
    lines: [...]
  }
  await cans.render(cansConfig)
  let imgStc = cans.output()
```

## Properties

### `cans.canvas`

  cans操作的canvas对象

### `cans.ctx`

  cans操作的contentText对象

### `cans.cache`

  cans绘制src资源的缓存 包含base64和网络资源

## Methods

### `cans.render`
> cans.render(config)

parameters
 - config
 ```javascript
  // eg: 
  {
    width: 100,
    height: 500,
    background: '#fa4a11',
    images: [...],
    texts: [...],
    lines: [...]
  }
 ```
 返回值: cans对象


- config

  Object 具体查考最下方的配置文件

### `cans.output`

> cans.output(0.7)

parameters
- tiny
  undefined: 调用toDataURL() 导出png图片
  number: 调用toDataURL('image/jpeg', tiny) 导出压缩的jpeg图片

-----
## 下面是cans绘制实现的封装 一般无需调用 配置render函数的配置文件即可

### `cans.drawImage`

> cans.drawImage(source, x, y, w, h, props?)

Parameters

- source: 

  Object: Canvas对象或Image对象
  String: http链接资源或base64 自动判断跨域并默认开启缓存

- x, y, w, h:

  canvas上的x y坐标以及宽高

- props?:

  可选参, 可传对象Object:

```javascript
  {
    border: '1px dashed rgba(255,255,255,.5)',
     // string  'borderWidth borderStyle borderColor'
    shadow,: '2 2 5 rgba(0,0,0,.3)'
    // string  'shadowOffsetX shadowOffsetY shadowBlur shadowColor'
    borderRadius: '30%',
    // string 
    callback: async () => {}
    // 回调函数 例如在绘制完text之后需要根据上个文字的最终位置类确定下次的绘制; 如果是异步的函数操作并想计算如render绘制时间内,请将callback写成一个async函数或返回Promise对象
  }
```

### `cans.drawText`

> cans.drawText(text, x, y, props?)

Parameters

- text: 
  string 
- x, y :
  canvas上的x y坐标以及宽高

- props?:
  可选参, 可传对象Object:

  ```javascript
    {
      text: '字符间距测试',
      fontSize: '36px',
      fontWeight: 'bold',
      // string   bold / normal
      fontFamily: 'Avenir',
      // letterSpacing: '20px',
      // 失效 待修复
      color: '#000',
      x,
      y,
      width: 375,
      textAlign: 'center',
      shadow,
      // 宽度 如果设置了宽度则开启自动换行功能 设置textAlign属性也必须设置width
      callback
    }
  ```

### `cans.drawLine`

Parameters

```javascript
  {
    sx: 0,
    // numbder 起点x坐标
    sy: 0,
    // numbder 起点y坐标
    ex: 750,
    // numbder 终点x坐标
    ey: 750,
    // numbder 终点y坐标
    lineWidth: 10,
    // number 线条宽度
    color: 'red',
    style: 'solid',
    // string solid dashed
    callback
  }
```

## config配置eg: 

```javascript
export default {
  background: '#0f0',
  width: 750,
  height: 1334,
  images: [
    {
      source: 'https://cdn.leoao.com/$24OI2B848%5B%5BK82IT0%25C25W1512445425623.jpg',
      x: 0,
      y: 0,
      width: 550,
      height: 633,
      async callback (cans) {
        await cans.drawImage('https://cdn.leoao.com/experice-rule/rank_1.png', 160, 1146, 102, 30)
        // 如果想要在render结果返回之前执行 请吧callback写成async函数或返回promise
      }
    },
    {
      source: 'https://img.leoao.com/o_1b4aqahi9cof1fgnqrs1dedkscp.jpg',
      x: 30,
      y: 1161,
      width: 100,
      height: 100,
      border: '10px solid #000',
      borderRadius: '50%'
    },
    {
      source: 'https://img.leoao.com/o_1b4aqahi9cof1fgnqrs1dedkscp.jpg',
      x: 500,
      y: 800,
      width: 100,
      height: 100,
      borderRadius: '30%'
    },
    {
      source: 'https://img.leoao.com/o_1b4aqahi9cof1fgnqrs1dedkscp.jpg',
      x: 630,
      y: 800,
      width: 100,
      height: 100,
      shadow: '0 0 20 rgba(0,0,0, .5)'
    }
  ],
  texts: [
    {
      text: '字符间距测试',
      fontSize: '36px',
      fontWeight: 'bold',
      fontFamily: 'Avenir',
      letterSpacing: '20px',
      color: '#000',
      x: 150,
      y: 1200,
      callback (cans, data) {
        console.log(cans, data)
      }
    },
    {
      text: '自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 自动换行 + 行高测试 ',
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: '',
      lineHeight: '36px',
      textAlign: 'left',
      letterSpacing: '5px',
      color: '#000',
      width: 375,
      x: 100,
      y: 700
    },
    {
      text: '居中 + 斜体 + 阴影',
      fontSize: '56px',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontFamily: '',
      textAlign: 'center',
      shadow: '0 0 20 rgba(0,0,0, .5)',
      color: '#ff0',
      width: 750,
      x: 0,
      y: 1050
    }
  ],
  lines: [
    {
      sx: 0,
      sy: 0,
      ex: 750,
      ey: 750,
      lineWidth: 10,
      color: 'red',
      style: 'solid',
      callback (cans) {
        console.log(cans)
      }
    },
    {
      sx: 750,
      sy: 0,
      ex: 0,
      ey: 750,
      lineWidth: 5,
      color: '#ff0',
      style: 'dashed'
    },
  ]
}
```

## 效果预览:

不知道为什么链接被转了: [ojbk](http://cdn.leoao.com/UC20180708_215652.png)

![ojbk](http://cdn.leoao.com/UC20180708_215652.png)