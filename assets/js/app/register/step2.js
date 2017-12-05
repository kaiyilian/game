define(['zepto', 'underscore', 'app/utils'],

    function($, _, utils) {

        var $btnRegister = $("#btn-register");
        var $btnLogin    = $("#btn-login");

        $(function() {

            var LoginModel = {

                init: function() {
                    this.goLoginPage();
                    $btnRegister.on("tap", function() {
                        LoginModel.register();
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



                // 注册
                register: function() {
                    var $self   = $btnRegister;
                    var password = $("#password").val();
                    var repeat = $("#repeat").val();

                    // 验证参数
                    if (!LoginModel.verifyPassword(password, repeat))
                        return;

                    $.ajax({
                        url: window.ctx + "/register/step2Action",
                        type: "POST",
                        dataType: "json",
                        data: {
                            password: password,
                            repeat_password: repeat,
                            token: $("#token").val()
                        },
                        beforeSend: function() {
                            $self.val("注册中...").addClass("disable");
                        },
                        success: function(data) {
                            if (data.err_code == 0) {
                                $self.val("确 定");
                                $.Dialog.info("注册成功，跳转中...");
                                window.setTimeout(function() {
                                    location.href = ctx + "#personalCenter";
                                }, 1800);
                            }
                        },
                        onError: function(data) {
                            $self.val("确 定").removeClass("disable");
                            if (data.err_code == 10000) {
                                window.setTimeout(function() {
                                    location.href = ctx + "register/step1";
                                }, 1800);
                            }
                        },
                    });
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
