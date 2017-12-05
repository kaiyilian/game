define(['zepto', 'underscore', 'app/utils'],

    function($, _, utils) {

        var $btnSendCode = $("#btn-captcha");
        var $mobile      = $("#mobile");
        var $captcha     = $("#captcha");
        var $btnRegister = $("#btn-register");
        var $btnLogin    = $("#btn-login");

        $(function() {

            var LoginModel = {

                init: function() {
                    $btnSendCode.on("tap", LoginModel.sendCaptchaCode);
                    //this.goLoginPage();
                    //this.viewAgree();
                    $btnRegister.on("tap", function() {
                        LoginModel.login();
                    });
                },

                // 验证手机号码
                verifyMobile: function(mobile) {
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

                // 查看注册协议
                viewAgree: function() {
                    $(".agreement").on("tap", function() {
                        //window.location.href = window.ctx + 'register/agreement';
                    });
                },

                // 验证验证码
                verifyCaptcha: function(captcha) {
                    if (captcha == '') {
                        $.Dialog.info("请输入验证码");
                        return false;
                    }

                    if (!/^\d{4}$/.test(captcha)) {
                        $.Dialog.info("验证码必须为4位数字");
                        return false;
                    }

                    return true;
                },

                // 发送短信验证码
                sendCaptchaCode: function() {
                    var $self  = $btnSendCode;
                    var mobile = $mobile.val();

                    // 验证手机号码
                    if (!LoginModel.verifyMobile(mobile)) 
                        return;
                     var senCaptchaCodedUrl = "rudaor/api/sms/vcode";
                    $.ajax({
                        url: senCaptchaCodedUrl,
                        type: "POST",
                        data: {
                    mobile: mobile,
                },
                        dataType: 'json',
                        beforeSend: function() {
                            $self.addClass("disabled");
                        },
                        success: function(data) {
                            $.Dialog.success("发送成功");
                            LoginModel.countDown();
                        }
                    });
                },

                // 注册
                login: function() {
                    
                    var mobile  = $mobile.val();
                    var captcha = $captcha.val();
                    var $self   = $btnRegister;

                    // 验证手机号码和验证码
                    if (!LoginModel.verifyMobile(mobile)) 
                        return;
                    if (!LoginModel.verifyCaptcha(captcha)) 
                        return;
                    //http://121.41.101.63:8088/rudaor/api/member/login
                    var loginUrl = "rudaor/api/member/login";
                    $.ajax({
                        url: loginUrl,
                        type: "POST",
                        dataType: "json",
                        data: {
                            mobile: mobile,
                            captcha: captcha
                        },
                        beforeSend: function() {
                            console.log("登陆中...");
                            $self.val("登陆中...").addClass("disable");
                        },
                        success: function(data) {
                            console.log("success...");
                            if (data.code == 200) {
                                $self.val("跳转中...");
                                console.log("跳转中...");
                                utils.storage.set("agentCenterData", JSON.stringify(data.result));
                                //window.location.hash = 'agentCenter';
                                //location.href = $("#redirect").val();
                                window.location.href = window.ctx+"/#agentCenter"
                            }
                        },
                        onError: function() {
                            console.log("error...");
                            $self.val("确 定").removeClass("disable");
                        }
                    });
                },

                // 验证码按钮倒计时
                countDown: function() {
                    var $btn    = $btnSendCode;
                    var timeout = 60;

                    $btn.off('tap');

                    var handler = window.setInterval(function() {
                        --timeout;
                        if (timeout <= 0) {
                            $btn.text("获取验证码").removeClass("disabled")
                            //$btn.text("获取验证码").removeClass("disabled").on("tap", LoginModel.sendCaptchaCode);
                            return window.clearInterval(handler);
                        }
                        $btn.text(timeout + "秒");
                    }, 1000)
                },

                /**
                 * 跳转到登录页面
                 */
                goLoginPage: function() {
                    $btnLogin.on("tap", function() {
                        window.location.href = ctx + "login";
                    });
                }


            };

            LoginModel.init();

        });

    });
