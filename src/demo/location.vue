<template>
  <div>
    <p v-for="(val, key) in location" :key="key">
      <b>{{key}}</b> <span>{{format(val)}}</span>
    </p>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Location from '../plugins/location'
  import jsbridge from '../plugins/jsbridge'
  import weChat from '../plugins/wechat'
  Vue.use(jsbridge)
  Vue.use(weChat)
  export default {
    data () {
      return {
        location: {}
      }
    },
    methods: {
      format (val) {
        if (val === null || val === undefined) return 'null'
        try {
          return JSON.stringify(val)
        } catch (err) {
          console.log(val)
          return val.toString()
        }
      }
    },
    created () {
      this.location = new Location({
        breakReTry: 1
      })
      this.location.getLocation().then(res => {
        console.log(res, 234)
      })
      window.locationData = this.location
    }
  }
</script>
<style>
</style>

