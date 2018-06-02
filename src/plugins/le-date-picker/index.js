
import leDatePicker from './le-date-picker.vue'
export default {
  install (Vue) {
    Vue.component('le-date-picker', Vue.extend(leDatePicker))
  }
}