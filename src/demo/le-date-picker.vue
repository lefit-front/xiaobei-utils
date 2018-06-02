<template>
  <div>
     <le-date-picker ref="leDatePicker"
      format="YYYY-MM-DD HH:mm:ss" :divi="{mm: 15}"
      :show="leDatePickerShow"
      initTime="1994/10/01"
      startTime="1984/10/01"
      endTime="1999/10/01"
      @change="changeHandler"
      @confirm="confirmHandler"
      @cancel="cancelHandler"></le-date-picker>
  </div>
</template>
<script>
  import Vue from 'vue'
  import leDatePicker from '../plugins/le-date-picker'
  // console.log(leDatePicker)
  Vue.use(leDatePicker)
  export default {
    data () {
      return {
        leDatePickerShow: true
      }
    },
    components: {
      // leDatePicker
    },
    methods: {
      changeHandler () {
        console.log(arguments)
      },
      confirmHandler () {
        console.log(arguments)
      },
      cancelHandler () {
        console.log(arguments)
      }
    },
    created () {
    }
  }
</script>