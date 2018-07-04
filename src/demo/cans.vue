<template>
  <div class="canvas-demo">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
  import Cans from '../plugins/cans'
  export default {
    data () {
      return {
        canvas: null,
        cans: null,
        source: {
          bg: 'https://cdn.leoao.com/experice-rule/Group%203%20Copy@2x%20%281%29.png',
          head: 'https://img.leoao.com/o_1b4aqahi9cof1fgnqrs1dedkscp.jpg'
        }
      }
    },
    async mounted () {
      this.canvas = this.$refs.canvas
      this.cans = new Cans({
        width: 750,
        height:  1334
      }, this.canvas)
      await this.cans.drawImage(this.source.bg, 0, 0, 750, 1121)
      await this.cans.drawImage(this.source.head, 30, 1161, 100, 100, {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.05)',
        circle: true,
        shadow: '0 0 20 rgba(0,0,0,.1)'
      })
      this.cans.drawText('讲真的', 150, 1211, {
        fontSize: '36px',
        fontWeight: 'bold',
      })
      this.cans.drawText('会不会是我被鬼迷心窍了', 150, 1266, {
        fontSize: '22px'
      })
      this.cans.drawText('啦啦啦', 150, 1144, {
        fontSize: '28px',
        fontWeight: 'bold'
      })
      this.cans.drawLine(153, 1194, 542, 1194, 1, 'rgba(0,0,0,.2)')
      this.cans.toDataURL()
    }
  }
</script>
<style lang="scss">
  .canvas-demo{
    >canvas{
      width:100%;
    }
  }
</style>

