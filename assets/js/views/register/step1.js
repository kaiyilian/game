define(['zepto', 'underscore', 'backbone',
        'app/utils',
        'app/api'
    ],

    function($, _, Backbone, utils, Api) {

        $phoneNumber = $(".phone-number");
        $btnVerificationCode = $(".btn_verification_code");     

        var RegisterModel = {

            init : function(){
                this.getCode();
                this.agreement();//用户协议
            },

            //获取验证码
            getCode : function() {
                $btnVerificationCode.on("tap", function(){
                    var $btn = $(this);
                    var mobile = $phoneNumber.val();

                    // 验证是否同意用户协议
                    var tar = $("input[type='checkbox']").is(':checked');
                    if(!tar){
                        $.Dialog.info("请先同意用户协议");
                        return;
                    }

                    //验证手机号码
                    if (!RegisterModel.verifyMobile(mobile)) 
                        return;
                    
                    
                    var param = {mobile:mobile};
                    Api.getCaptchaCode(param, function(){
                        $btnVerificationCode.addClass("disabled");
                    }, function(data){
                        $.Dialog.success("发送成功");
                        utils.storage.set( "registPhoneNumber", mobile);
                        utils.storage.set( "registerToken", data.result.register_token);
                        utils.storage.set( "code", data.result.code);
                        window.location.href = window.ctx + "/register/step2.html";
                    }, function(){

                    });
                })
            },

            //用户协议
            agreement: function(){

                $(".user_agreement").on("tap", function(){

                     window.location.href = window.ctx + "/#agreement";
                });
            },

            // 验证手机号码
            verifyMobile : function(mobile) {
                if (mobile == "") {
                    $.Dialog.info("请输入手机号码")
                    return false;
                }

                if (!$.isPhone(mobile)) {
                    $.Dialog.info("您输入的手机号码格式不正确")

                    return false;
                }

                return true;
            },


            text: function(){
                console.log("text");
                var str_data=$("#dlg_form input").map(function(){
                   return ($(this).attr("name")+'='+ $(this).val());
                    }).get().join("&") ;
                console.log("str_data " + str_data);
                $.ajax({
                   // var str_data=$("#dlg_form input").map(function(){
                   // return ($(this).attr("name")+'='+$(this).val());
                   //  }).get().join("&") ;
                   type: "POST",
                   url:  window.API_URL + "/members/register/mobile",
                   dateType:"JSON",
                   //data: str_data,
                   data: "mobile=18738646336",
                   success: function(msg){
                   }
                });
            },
        }


        RegisterModel.init();
    });