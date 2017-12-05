define(['zepto', 'underscore', 'backbone',
        'echo', 'app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/bindPhoneStep1.html'
    ],

    function($, _, Backbone, echo, Api, Token, utils, bindPhoneStep1Template) {

        var $page = $("#bind-phone-step1");

        var $phoneNumber ;

        var type = 1; //需要判断是否先登录

        var bindPhoneStep1View = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {

                    $page.empty().append(bindPhoneStep1Template);

                    $phoneNumber = $page.find(".pnone_number");
                        
                });
            },
            events: {
                //获取验证码
                "tap .btn_verification_code":"getVerificationCode",
            },

            getVerificationCode: function(){
                //得到验证码
                getCode();
            },


        });

        //得到验证码
        var getCode = function(){

            var mobile = $phoneNumber.val();
            //验证手机号码
            if (!verifyMobile(mobile)) 
                return;
            //用户协议
            //TODO

            var fromData = "mobile=" + mobile;
            var param = {fromData:fromData};
            Api.getBindPhoneVerCode(param, function(successsData){

                utils.storage.set( "bindCode", successsData.result);

                window.location.hash = "bindPhoneStep2/" + mobile;

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){  

                        getCode();

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
        
    return bindPhoneStep1View;
    });
