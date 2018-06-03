<template>
<div></div>
</template>
<script>
  import jsbridge from '../plugins/jsbridge'
  import Vue from 'vue'
  Vue.use(jsbridge)
  export default {
    created () {
      this.$JB.callHandler('setOptionMenu', {
        title : '  ', //  icon   
        titleColor : '#ff00ff00', //       ARGB 
        icon : 'http://pic.leoao.com/xxx.png'
      })
      this.$JB.call('setOptionMenu', {
        title : '  ', //  icon   
        titleColor : '#ff00ff00', //       ARGB 
        icon : 'http://pic.leoao.com/xxx.png'
      })
    }
  }
</script>
