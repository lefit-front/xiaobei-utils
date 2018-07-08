<template>
  <div class="canvas-demo">
    <!-- <canvas ref="canvas"></canvas> -->
    <img :src="output" alt="">
  </div>
</template>
<script>
  import Cans from '../plugins/cans'
  import Cansf from '../plugins/cans/cansf.js'
  import config from './cans.config.js'
  // console.log(new Cansf())
  export default {
    data () {
      return {
        canvas: null,
        cans: null,
        output: '',
        source: {
          bg: 'https://cdn.leoao.com/experice-rule/Group%203%20Copy@2x%20%281%29.png',
          head: 'https://img.leoao.com/o_1b4aqahi9cof1fgnqrs1dedkscp.jpg'
        }
      }
    },
    async mounted () {
      this.cans = new Cans()
      await this.cans.render(config)
      this.output = this.cans.output()
      console.log(this.cans)
    }
  }
</script>
<style lang="scss">
  .canvas-demo{
    >canvas, img{
      width:100%;
    }
  }
</style>

