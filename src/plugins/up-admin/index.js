/*
  建议全局只定义一个子例 这样方便管理uptoken的请求以及时效性
  食用方法:
  1.formdata
  var uploader = new UpAdmin()
  uploader.upload(event.target.files[0])
  2.sdk
  var uploader = new UpAdmin(Qiniu, config)
  uploader.upload(file)
  uploader.onuploadproress = function (percent) {
    console.log('上传进度:' + percent)
  }
  详情看以下函数入参注解
*/
class UpAdmin{
  /**
   * Creates an instance of UpAdmin.
   * @param {any} Qiniu 七牛sdk
   * @param {any} config 上传配置 会自动merge默认配置
   * @memberof UpAdmin
   */
  constructor(Qiniu, config) {
    this.uptoken = ''
    this.formData = null
    this.file = null
    this.tagTime = 0
    this.config = {}
    if (Qiniu) {
      this.config = Object.assign(defaultConfig, config || {})
      let me = this
      let browse_button = document.createElement('div')
      let container = document.createElement('div')
      container.style.display = 'none'
      container.appendChild(browse_button)
      document.body.appendChild(container)
      browse_button.id = `upBtn${Math.random().toString(36).slice(2)}`,
        this.config.browse_button = browse_button.id
      this.qiniu = new Qiniu.uploader(this.config)
    }
  }
  /**
   * 
   * 
   * @param {any} file 可传base64或file文件
   * @returns 
   * @memberof UpAdmin
   */
  async upload(file, prefix) {
    if (typeof file === 'string') {
      this.file = this.convertBase64UrlToBlob(file)
    } else {
      this.file = file
    }
    if (this.qiniu) {
      return this.sdkUpload(prefix)
    } else {
      return this.formDataUpload(prefix)
    }
  }
  sdkUpload() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.qiniu.addFile(this.file)
        this.qiniu.start()
        this.qiniu.bind('FileUploaded', (up, file, {response}) => {
          let info = JSON.parse(response)
          resolve(info)
          this.reset()
        })
        this.qiniu.bind('UploadProgress', (up, file) => {
          this.onuploadproress(file.percent)
        })
      }, 100)
    })
  }
  async formDataUpload(prefix = '') {
    await this.getToken()
    this.formData = new FormData()
    this.formData.append('file', this.file)
    this.formData.append('token', this.uptoken)
    let name = this.takeKey(this.file.name, prefix)
    // let name = this.file.name ? this.file.name.replace(/\.\S*$/, v => +new Date() + v): Math.random().toString(36).slice(2)
    this.formData.append('key', prefix + name)
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://up.qbox.me/', true)
      xhr.send(this.formData)
      xhr.onreadystatechange = () => {
        if (xhr.status === 200) {
          if (xhr.readyState === 4) {
            resolve({
              ...JSON.parse(xhr.responseText),
              origin: 'https://cdn.leoao.com/'
            })
            this.reset()
          }
        }
      }
    })
  }
  reset() {
    this.file = null
    this.formData = null
    if (this.qiniu) {
      this.qiniu = new Qiniu.uploader(this.config)
    }
  }
  /**
   * 
   * 
   * @param {any} urlData 需要转换的base64字符串
   * @returns 
   * @memberof UpAdmin
   */
  convertBase64UrlToBlob(urlData) {
    let bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/png' })
  }
  takeKey (fileName, prefix) {
    prefix = prefix || 'up-admin'
    return fileName
    ? prefix + fileName.replace(/\.\S*$/, v => +new Date() + v)
    : `${prefix}-${Math.random().toString(36).slice(2)}`
  }
  getToken() {
    let me = this
    return new Promise((resolve, reject) => {
      if (this.uptoken && (new Date().valueOf() - this.tagTime < 360000)) {
        resolve(this.uptoken)
        return
      }
      let xhr = new XMLHttpRequest()
      xhr.open('GET', `/lens/fit/h5/api/v1/qiniu/uptoken?time=${+new Date()}`, true)
      xhr.send()
      xhr.onreadystatechange = () => {
        if (xhr.status === 200) {
          if (xhr.readyState === 4) {
            var res = JSON.parse(xhr.responseText)
            this.uptoken = res.uptoken
            this.tagTime = new Date().valueOf()
            resolve(this.uptoken)
          }
        } else {
          reject(xhr)
        }
      }
    })
  }
}

const defaultConfig = {
  disable_statistics_report: false,
  runtimes: 'html5,html4,flash',
  // browse_button: browse_button.id,
  // uptoken: this.uptoken,
  uptoken_url: `/lens/fit/h5/api/v1/qiniu/uptoken?time=${+new Date()}`,
  get_new_uptoken: false,
  unique_names: false,
  save_key: false,
  domain: 'cdn.leoao.com',
  chunk_size: '0mb', // 安卓不能分片 ios可以分片  结果视频砍掉了 这个东西以后再优化
  max_retries: 3,
  dragdrop: false,
  auto_start: true,
  multi_selection: false, // 是否可多选 ios下不可为true 否则无法上传
  init: {
    BeforeUpload (up, file) {
    },
    UploadProgress(up, file) {
    },
    FileUploaded(up, file, info) {
    },
    Error (up, err, errTip) {
    },
    Key (up, file) {
      return this.takeKey(file.name)
    }
  }
}

export default UpAdmin
