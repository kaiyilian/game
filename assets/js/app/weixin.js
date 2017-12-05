define(['jweixin'], function(wx) {

    var initConfig = function(signPackage) {

        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: signPackage.appId, // 必填，公众号的唯一标识
            timestamp: signPackage.timestamp, // 必填，生成签名的时间戳
            nonceStr: signPackage.nonceStr, // 必填，生成签名的随机串
            signature: signPackage.signature, // 必填，签名，见附录1
            jsApiList: ["uploadImage", "getLocation", "chooseImage", "previewImage", "uploadImage", "scanQRCode", "chooseWXPay", 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.error(function(res) {
            console.log(res);
        });
    }


    var pay = {

        initPayV2: function(signPackage, param, success, error) {
            pay.weixinJSBridge(param, success, error);
        },

        initPayV3: function(signPackage, param, success, error, cancel) {
            wx.ready(function() {
                wx.chooseWXPay({
                    timestamp: param.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: param.nonceStr, // 支付签名随机串，不长于 32 位
                    package: param.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: param.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: param.paySign, // 支付签名
                    success: function(res) {
                        // 支付成功后的回调函数
                        typeof success == "function" && success(res);
                    },
                    fail: function(res) {
                        typeof success == "function" && error(res);
                    },
                    cancel: function(res) {
                        typeof error == "function" && cancel(res);
                    }
                });
            });
        },

        onBridgeReady: function(param, success, error) {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', param,
                function(res) {
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        success();
                    } else {
                        error();
                    }
                }
            )
        },

        weixinJSBridge: function(param, success, error) {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', pay.onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', pay.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', pay.onBridgeReady);
                }
            } else {
                pay.onBridgeReady(param, success, error);
            }

        }

    }

    var scanQRCode = function(needResult, callback) {
        wx.scanQRCode({
            needResult: needResult || 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                typeof callback == 'function' && callback(result);
            }
        });
    };

    var getLocation = function(callback) {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function(res) {
                // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                // var speed = res.speed; // 速度，以米/每秒计
                // var accuracy = res.accuracy; // 位置精度
                typeof callback == "function" && callback(res);
            }
        });
    };

    var chooseImage = function(callback, count) {
        wx.chooseImage({
            count: count || 5, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有('original', 'compressed')
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                typeof callback == "function" && callback(localIds);
            }
        });
    };

    var uploadImage = function(localId, callback) {
        wx.uploadImage({
            localId: localId,
            isShowProgressTips: 1,
            success: function(res) {
                typeof callback == "function" && callback(res.serverId);
            }
        });
    };

    var previewImage = function(current, urls) {
        wx.previewImage({
            current: current || '', // 当前显示图片的http链接
            urls: urls || [] // 需要预览的图片http链接列表
        });
    };

    // 分享到朋友圈
    var onMenuShareTimeline = function(title, link, imgURL, success, cancel) {
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgURL, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                typeof success == 'function' && success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                typeof cancel == 'function' && cancel();
            }
        });
    };

    var onMenuShareAppMessage = function(title, desc, link, imgURL, type, dataURL,success, cancel) {
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgURL, // 分享图标
            type: type, // 分享类型,music、video或link，不填默认为link
            dataUrl: dataURL, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                typeof success == 'function' && success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                typeof cancel == 'function' && cancel();
            }
        });
    };

    var onMenuShareQQ = function(title, desc, link, imgURL, success, cancel) {
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgURL, // 分享图标
            success: function () {
               // 用户确认分享后执行的回调函数
               typeof success == 'function' && success();
            },
            cancel: function () {
               // 用户取消分享后执行的回调函数
               typeof cancel == 'function' && cancel();
            }
        });
    };

    var onMenuShareQZone = function(title, desc, link , imgURL, success, cancel) {
        wx.onMenuShareQZone({
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
               // 用户确认分享后执行的回调函数
               typeof success == 'function' && success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                typeof cancel == 'function' && cancel();
            }
        });
    };



    return {
        initConfig: initConfig,
        doPayV2: pay.initPayV2,
        doPayV3: pay.initPayV3,
        scanQRCode: scanQRCode,
        getLocation: getLocation,
        chooseImage: chooseImage,
        uploadImage: uploadImage,
        previewImage: previewImage,
        onMenuShareTimeline: onMenuShareTimeline,
        onMenuShareAppMessage: onMenuShareAppMessage,
        onMenuShareQQ: onMenuShareQQ,
        onMenuShareQZone: onMenuShareQZone
    };
});
