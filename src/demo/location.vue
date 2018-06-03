<template>
  <div></div>
</template>
<script>
  import Location from '../plugins/location'
  export default {
    data () {
      return {
        location
      }
    },
    created () {
      console.log(Location)
      this.location = new Location()
    }
  }
</script>
<style>
</style>

