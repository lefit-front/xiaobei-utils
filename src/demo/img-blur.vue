<template>
  <div>
    <img style="width:100%;" v-blur-load="'http://www.lotsfun.com.tw/upload/articles/20150604195203317_new.jpg'" alt="">
  </div>
</template>
<script>
  import Vue from 'vue'
  import ImgBlur from '../plugins/img-blur'
  Vue.use(ImgBlur)
  export default {
    created () {

    }
  }
</script>
<style>

</style>

