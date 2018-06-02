<template>
  <le-picker :slots="slots" value-key="name" :show="show" title="时间选择" :submit="submit" :cancel="cancel" @change="change"></le-picker>
</template>
<script>
/*
食用方法:
 <le-date-picker ref="leDatePicker"
  format="YYYY-MM-DD HH:mm:ss" :divi="{mm: 15}"
  :show="leDatePickerShow"
  initTime="1994/10/01"
  startTime="1984/10/01"
  endTime="1999/10/01"
  @change="changeHandler"
  @confirm="confirmHandler"
  @cancel="cancelHandler"></le-date-picker>

  @params divi
  刻度差 以对象方式传入 {YYYY:2, mm:15}
  即得到 [2018, 2020, 2022 ...] [0, 15, 30...] 等slot数组
  @params format
  picker的显示格式化
  eg: YYYY-MM-DD YYYY MM DD YYYY年MM月DD日
  @params initTime startTime endTime
  可取值[Number, String, Object, Date]
*/
import lePicker from 'le-ui/src/components/picker'
import leMoment from 'lefit-moment'
import 'le-ui/dist/styles/leui.css'
export default {
  components: {
    lePicker
  },
  name: 'leDatePicker',
  data () {
    return {
      slots: [
      ],
      YYYY: [],
      MM: [],
      DD: [],
      HH: [],
      mm: [],
      ss: [],
      rules: ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss'],
      _format: '',
      _divi: {},
      initTimeLemoment: {},
      date31: []
    }
  },
  props: {
    format: {
      type: String,
      default: () => 'YYYY-MM-DD HH:mm'
    },
    initTime: {
      type: [Number, String, Object, Date],
      default: () => new Date()
    },
    startTime: {
      type: [Number, String, Object, Date],
      default: () => +new Date() - 315360000000
    },
    startYear: {
      type: [Number, String],
      default: ''
    },
    endTime: {
      type: [Number, String, Object, Date],
      default: () => +new Date() + 315360000000
    },
    endYear: {
      type: [Number, String],
      default: ''
    },
    divi: Object, // 尺度分割
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.initTimeLemoment = leMoment(this.initTime)
        this.setIndex()
      }
    }
  },
  methods: {
    initSlots () {
      this._divi = Object.assign({
        YYYY: 1,
        MM: 1,
        DD: 1,
        HH: 1,
        mm: 1,
        ss: 1
      }, this.divi)
      let startTime = this.startYear ? leMoment({year: this.startYear}).get('year') : leMoment(this.startTime).get('year')
      let endTime = this.endYear ? leMoment({year: this.endYear}).get('year') : leMoment(this.endTime).get('year')
      this.YYYY = this.createSlot(startTime, endTime, this._divi.YYYY)
      this.MM = this.createSlot(1, 12, this._divi.MM)
      this.DD = this.createSlot(1, 31, this._divi.DD)
      this.HH = this.createSlot(0, 23, this._divi.HH)
      this.mm = this.createSlot(0, 59, this._divi.mm)
      this.ss = this.createSlot(0, 59, this._divi.ss)
      this.date31 = this.createArr(1, 31, 1)
      this._format = this.format
      this.rules.forEach(key => {
        let regexp = new RegExp('^' + key)
        let divRegexp = /^[/-\s:年月日时分秒]*/
        if (regexp.test(this._format)) {
          this.slots.push(Object.assign(this[key], {key}))
          this._format = this._format.replace(regexp, '')
        }
        let result = this._format.match(divRegexp)
        if (result) {
          this.slots.push({
            divider: true,
            content: result[0]
          })
          this._format = this._format.replace(divRegexp, '')
        }
      })
    },
    setIndex () {
      const compareTimeData = {
        YYYY: this.initTimeLemoment.get('year'),
        MM: this.initTimeLemoment.get('month') + 1,
        DD: this.initTimeLemoment.get('date'),
        HH: this.initTimeLemoment.get('hour'),
        mm: this.initTimeLemoment.get('minute')
      }
      for (let key in compareTimeData) {
        for (let i = 0; i < this[key].values.length; i++) {
          if (this[key].values[i].value === compareTimeData[key]) {
            this[key].defaultIndex = i
            break
          }
        }
      }
    },
    createSlot (...arg) {
      return {
        flex: 1,
        values: this.createArr(...arg),
        textAlign: 'center'
      }
    },
    createArr (start, end, divi) {
      let arr = []
      for (let i = start; i <= end; i += divi) {
        arr.push({
          name: i < 10 ? '0' + i : '' + i,
          value: i
        })
      }
      return arr
    },
    arr2time (arr) {
      let _slots = this.slots.filter(v => v.key)
      let timeData = {}
      for (let i = 0; i < arr.length; i++) {
        if (_slots[i].key === 'MM') {
          timeData[_slots[i].key] = arr[i].value - 1
        } else {
          timeData[_slots[i].key] = arr[i].value
        }
      }
      return timeData
    },
    submit (arr) {
      let timeObj = this.arr2time(arr)
      this.$emit('confirm', this.translate(timeObj))
    },
    translate (timeObj) {
      let _timeObj = {}
      let translate = {
        YYYY: 'year',
        MM: 'month',
        DD: 'date',
        HH: 'hour',
        mm: 'minute',
        ss: 'second'
      }
      for (let key in timeObj) {
        _timeObj[translate[key]] = timeObj[key]
      }
      return _timeObj
    },
    cancel () {
      this.$emit('cancel')
    },
    change (vm, arr) {
      let timeObj = this.arr2time(arr)
      if (timeObj.MM !== undefined) {
        this.takeTime(vm, timeObj)
      }
      this.$emit('change', this.translate(timeObj))
    },
    takeTime (vm, time) {
      let slotValues = []
      slotValues = this.date31.slice(0, this.takeDateLength(time))
      let index = this.slots.findIndex(v => v.key === 'DD')
      if (index !== -1) {
        this.slots[index].values = slotValues
      }
    },
    takeDateLength (time) {
      let month = time.MM + 1
      let year = time.YYYY || new Date().getFullYear()
      if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
        return 31
      } else if ([4, 6, 9, 11].indexOf(month) > -1) {
        return 30
      } else if (month === 2) {
        if (this.isLeapYear(year)) {
          return 29
        } else {
          return 28
        }
      }
    },
    isLeapYear (year) {
      let cond1 = year % 4 === 0
      let cond2 = year % 100 !== 0
      let cond3 = year % 400 === 0
      return cond1 && cond2 || cond3
    }
  },
  created () {
    this.initTimeLemoment = leMoment(this.initTime)
    this.initSlots()
    this.setIndex()
  }
}
</script>
