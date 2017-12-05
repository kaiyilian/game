define(['zepto', 'underscore', 'backbone',
        'echo', 'app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/bindPhoneStep2.html'
    ],

    function($, _, Backbone, echo, Api, Token, utils, bindPhoneStep2Template) {

        var $page = $("#bind-phone-step2");

        var $phoneNumber ;

        var $btn;

        var $verificationCode;

        var telephoneMobile;

        var bindPhoneStep2View = Backbone.View.extend({
            el: $page,
            render: function(mobile) {
                console.log("mobile: " + mobile);
                telephoneMobile = mobile;
                utils.showPage($page, function() {

                    $page.empty().append(bindPhoneStep2Template);
                    
                    $phoneNumber = $page.find(".phone_number");

                    $btn = $page.find(".btn_countdown");

                    $verificationCode = $page.find(".verification_code");

                    setMobilePhone(); 

                    //验证码按钮倒计时
                    countDown();  
                });
            },
            events: {
                //
                "tap .btn_next":"next",
            },

            next: function(){

                //判断验证码是否为空
                var code = $verificationCode.val();
                if (code == "") {
                    $.Dialog.info("请输入验证码")
                    return false;
                }

                bindStep2(code);
            },

        });

        var bindStep2 = function(code){

            var fromData = "captcha=" + code;

            var param = {fromData:fromData}; 

            Api.bindStep2(param, function(successsData){

                window.location.hash = "bindPhone";
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){  

                        bindStep2(code);

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }

            });
        };

        var setMobilePhone = function(){
            var mumber = telephoneMobile.substring(0, 3) + "********";

            $phoneNumber.html(mumber);
        };

        var countDown = function(){
            var timeout = 60;

            $btn.off('tap');

            var handler = window.setInterval(function () {
                --timeout;
                if (timeout <= 0) {
                    //$btn.text("获取验证码").removeClass("disabled").on("tap", RegisterModel.sendCode);
                    $btn.text("获取验证码");
                    sendCode();
                    return window.clearInterval(handler);
                }
                $btn.text(timeout + "秒后重新获取");
            }, 1000)

        };

        //得到验证码
        var sendCode = function(){
            //验证手机号码
            if (!verifyMobile(telephoneMobile)) 
                return;
            //用户协议
            //TODO

            var fromData = "mobile=" + telephoneMobile;
            var param = {fromData:fromData};
            Api.getBindPhoneVerCode(param, function(successsData){
                countDown();
                utils.storage.set( "bindCode", successsData.result);

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){  

                        sendCode();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }

            });
        };

        // 验证手机号码
        var verifyMobile = function(mobile) {
            if (mobile == "") {
                $.Dialog.info("请输入手机号码")
                return false;
            }

            if (!$.isPhone(mobile)) {
                $.Dialog.info("您输入的手机号码格式不正确")

                return false;
            }

            return true;
        };
        
    return bindPhoneStep2View;
    });
