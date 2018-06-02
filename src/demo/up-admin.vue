<template>
  <div>
    <input type="file" @change="changeHandler">点我上传
  </div>
</template>
<script>
  import UpAdmin from '../plugins/up-admin'
  export default {
    data () {
      return {
        upAdmin: null
      }
    },
    methods: {
      async changeHandler (evt) {
        let file = evt.target
        let res = await this.upAdmin.upload(file)
        console.log(res)
        // let res = await upAdmin.upload(file, 'act-head-img-528-2018-')
      }
    },
    created () {
      this.upAdmin = new UpAdmin()
    }
  }
</script>
<style lang="scss">

</style>