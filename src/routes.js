import leDatePicker from './demo/le-date-picker.vue'
import ImgBlur from './demo/img-blur.vue'
import UpAdmin from './demo/up-admin'
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
  }]
}