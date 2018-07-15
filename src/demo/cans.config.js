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