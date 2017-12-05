define(['zepto', 'underscore', 'app/utils','app/api'],

    function($, _, utils, Api) {

        var $btnRegister = $("#btn-register");
        var $password    = $("#password");
        var $repeat      = $("#repeat");

        $(function() {

            var RegisterModel = {

                init: function() {
                    this.initOpenId();
                    this.registerComplete();
                    
                },

                initOpenId : function(){
                    if(isWeiXin()){
                        var code = $.getQueryString("code");
                        if($.isBlank(code)){
                            $.Dialog.info("微信认证失败，请刷新再试");
                            return;
                        }
                        Api.getOpenid(code, function(data){
                            if(!$.isBlank(data.result.openid)){
                                utils.storage.set("wxOpenid", data.result.openid);
                            }
                        });
                    }else{
                         utils.storage.set("wxOpenid", "text");
                    }
                },

                registerComplete: function(){
                    $btnRegister.on("tap", function() {
                        RegisterModel.register();
                    });
                },

                //保存密码
                register: function(){

                    var password = $password.val();
                    var repeat   = $repeat.val();

                    if (!this.verifyPassword(password,repeat)) 
                            return;

                    var openid          = utils.storage.get("wxOpenid");
                    var register_token  = utils.storage.get("registerToken");
                    var formData = "openid=" + openid +"&" + 
                                   "register_token=" + register_token +"&" +
                                   "password=" + password +"&" +
                                   "repeat_password=" + repeat;

                    var param = {formData:formData};
                    
                    Api.register(param, function(){

                    },function(successData){

                        utils.storage.set("loginSuccess","yes");
                        //置换凭证 refresh_token
                        utils.storage.set("refresh_token",successData.result.refresh_token);
                        //接口访问凭证 access_token
                        utils.storage.set("access_token",successData.result.access_token);

                        $.Dialog.success("密码保存成功！");
                        window.location.href = window.ctx + "/#my";

                    },function(errorData){

                    }); 
                },

                // 验证
                verifyPassword: function(password, repeat) {
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
                },



            };

            RegisterModel.init();

        });

    });
