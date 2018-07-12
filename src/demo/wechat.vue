<template>
  <div></div>
</template>
<script>
  import weChat from '../plugins/wechat'
  import Vue from 'vue'
  Vue.use(weChat)
  export default {
    created () {
      this.$wx.onMenuShareTimeline({
          title: '已经配置好jsdk 直接调用即可', // 分享标题
          link: window.location.href, // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: 'https://cdn.leoao.com/logo_0803.png', // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      })
      this.$wx.onMenuShareAppMessage({
        title: '已经配置好jsdk 直接调用即可', // 分享标题
        desc: '已经配置好jsdk 直接调用即可', // 分享描述
        link: window.location.href, // 分享链接，该链接域名必须与当前企业的可信域名一致
        imgUrl: 'https://cdn.leoao.com/logo_0803.png', // 分享图标
        // type: '', // 分享类型,music、video或link，不填默认为link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
      })
    }
  }
</script>
<style>

</style>

