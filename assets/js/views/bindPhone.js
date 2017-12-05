define(['zepto', 'underscore', 'backbone',
        'echo', 'app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/bindPhone.html'
    ],

    function($, _, Backbone, echo, Api, Token, utils, bindPhoneTemplate) {

        var $page = $("#bind-phone");
        var $password;
        var $repeat;

        var bindPhoneView = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {

                    $page.empty().append(bindPhoneTemplate); 

                    $password = $page.find(".pass_word");

                    $repeat = $page.find(".repeat_pass_word");
                });
            },
            events: {
                //完成绑定
                "tap .btn_sub":"complate",
            },

            complate: function(){

                complatePhoneBind();
            },

        });

        //
        var complatePhoneBind = function(){

            var password = $password.val();
            var repeat   = $repeat.val();
console.log(password);
console.log(repeat);
            if (!verifyPassword(password,repeat)) 
                return;

            var formData = "password=" + password +"&" + 
                            "repeat_password=" + repeat ;

            var param = {formData:formData};

            Api.complatePhoneBind(param, function(successData){

                $.Dialog.success("手机号绑定成功");
                window.location.hash = "personalInfo";
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){  

                        complatePhoneBind();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }
            });
        };

        //验证
        var verifyPassword = function(password, repeat){

            if (password == "") {
                $.Dialog.info("请输入您的密码");
                return false;
            }

            if (repeat == "") {
                $.Dialog.info("请再次输入您的密码");
                return false;
            }

            if (password != repeat) {
                $.Dialog.info("您前后两次输入的密码不一致");
                return false;
            }

            return true;
        };

        
    return bindPhoneView;
    });
