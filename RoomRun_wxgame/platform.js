/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

class WxgamePlatform {

    name = 'wxgame'

    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    resolve(res)
                }
            })
        })
    }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function (res) {
          let sysInfo = wx.getSystemInfoSync();
          //获取微信界面大小
          let width = sysInfo.screenWidth;
          let height = sysInfo.screenHeight;
          var authSetting = res.authSetting
          if (authSetting['scope.userInfo'] === true) {
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
                var result = { "nickname": nickName, "avatar": avatarUrl }
                resolve(result)
              }
            })
          } else if (authSetting['scope.userInfo'] === false) {
            let button = wx.createUserInfoButton({
              type: 'text',
              text: '',
              style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                backgroundColor: '#0000000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
              }
            })
            button.onTap((res) => {
              if (res.userInfo) {
                var nickName = res.userInfo.nickName
                var avatarUrl = res.userInfo.avatarUrl
                var result = { "nickname": nickName, "avatar": avatarUrl }
                resolve(result)
                button.destroy();
              }
            })
          } else {
            let button = wx.createUserInfoButton({
              type: 'text',
              text: '',
              style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                backgroundColor: '#0000000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
              }
            })
            button.onTap((res) => {
              if (res.userInfo) {
                var nickName = res.userInfo.nickName
                var avatarUrl = res.userInfo.avatarUrl
                var result = { "nickname": nickName, "avatar": avatarUrl }
                resolve(result)
                button.destroy();
              }
            })
          }
        }
      })

    })
  }

  ShowshareMenu() {
    return new Promise((resolve, reject) => {
      wx.showShareMenu({
        withShareTicket: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { }
      })
      wx.onShareAppMessage(function () {
        return {
          title: '密室逃生',
          imageUrl: "http://static.egret-labs.org/h5game/icons/10000008.jpg"
        }
      })
    })
  }

  shareAppMessage() {
    return new Promise((resolve, reject) => {
      wx.shareAppMessage({
        title: '密室逃生',
        imageUrl: "http://static.egret-labs.org/h5game/icons/10000008.jpg"
      })
    })
  }

    openDataContext = new WxgameOpenDataContext();
}

class WxgameOpenDataContext {

    createDisplayObject(type, width, height) {
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        if (egret.Capabilities.renderMode == "webgl") {
            const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
            const context = renderContext.context;
            ////需要用到最新的微信版本
            ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
            ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
            if (!context.wxBindCanvasTexture) {
                egret.startTick((timeStarmp) => {
                    egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                    bitmapdata.webGLTexture = null;
                    return false;
                }, this);
            }
        }
        return bitmap;
    }


    postMessage(data) {
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }
}


window.platform = new WxgamePlatform();