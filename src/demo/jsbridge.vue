<template>
  <div>
    <p v-for="(val, key) in location" :key="key">
      <b>{{key}}</b> <span>{{format(val)}}</span>
    </p>
    <p>resume: {{resume}}</p>
  </div>
</template>
<script>
  import jsbridge from '../plugins/jsbridge'
  import Vue from 'vue'
  Vue.use(jsbridge)
  export default {
    data() {
      return {
        location: {},
        resume: false
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
      window.$native = this.$native
      this.$native.call('getLocation', {
        needRefresh: true
      }, (res) => {
        this.location = res
      })
      this.$native.addEvent('resume', (data, responseCallback) => {
        this.resume = true
      })
    }
  }
</script>
