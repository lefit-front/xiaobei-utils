import leDatePicker from './demo/le-date-picker.vue'
import disScroll from './demo/dis-scroll'
import ImgBlur from './demo/img-blur.vue'
import UpAdmin from './demo/up-admin'
import Jsbridge from './demo/jsbridge.vue'
import Location from './demo/location.vue'
import Cans from './demo/cans.vue'
import App from './app'

export default {
  routes: [{
    path: '/',
    name: 'app',
    component: App
  }, {
    path: '/up-admin',
    name: 'up-admin',
    component: UpAdmin
  }, {
    path: '/le-date-picker',
    name: 'le-date-picker',
    component: leDatePicker
  }, {
    path: '/img-blur',
    name: 'img-blur',
    component: ImgBlur
  }, {
    path: '/dis-scroll',
    name: 'dis-scroll',
    component: disScroll
  }, {
    path: '/jsbridge',
    name: 'jsbridge',
    component: Jsbridge
  }, {
    path: '/location',
    name: 'location',
    component: Location
  }, {
    path: '/cans',
    name: 'cans',
    component: Cans
  }]
}