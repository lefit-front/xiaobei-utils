<template>
  <div></div>
</template>
<script>
  import Location from '../plugins/location'
  import loadJsBridge from '../plugins/jsbridge/loadJsBridge.js'
  export default {
    data () {
      return {
        location
      }
    },
    created () {
      loadJsBridge().then(() => {
        this.location = new Location({
          breakReTry: 1
        })
        this.location.getLocation().then(res => {
          console.log(res, 234)
        })
        window.locationData = this.location
      })
    }
  }
</script>
<style>
</style>

