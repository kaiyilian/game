define(['zepto', 'underscore', 'app/utils', 'app/api'],

	function ($, _, utils, Api) {

		var $phoneNumber = $(".phone-number");
		var $btnNext = $(".btn_next");
		var $btnSendCode = $(".btn_countdown");
		var $verificationCode = $(".verification_code");
		var number = 1;


		$(function () {

			var RegisterModel = {

				init: function () {
					this.setMobilePhone();
					this.countDown();
					$btnNext.on("tap", function () {
						RegisterModel.next();
					});
				},

				setMobilePhone: function () {
					var phoneNumber = utils.storage.get("registPhoneNumber").substring(0, 3) + "********";
					$phoneNumber.html(phoneNumber);
				},

				//下一步
				next: function () {
					//判断验证码是否为空
					var code = $verificationCode.val();
					if (code == "") {
						$.Dialog.info("请输入验证码")
						return false;
					}

					var formData = "register_token=" + utils.storage.get("registerToken") + "&verification=" + code;
					
					var param = {formData: formData};

					Api.sendCaptchaCode(param, function () {

					}, function (data) {
						$.Dialog.success("验证码验证成功");
						window.location.href = window.ctx + '/register/registPwd.html';
					}, function (data) {
						$.Dialog.error("验证码验证失败");
					});


				},

				// 验证码按钮倒计时
				countDown: function () {
					var $btn = $btnSendCode;
					var timeout = 60;

					$btn.off('tap');

					var handler = window.setInterval(function () {
						--timeout;
						if (timeout <= 0) {
							//$btn.text("获取验证码").removeClass("disabled").on("tap", RegisterModel.sendCode);
							$btn.text("获取验证码");
							RegisterModel.sendCode();
							return window.clearInterval(handler);
						}
						$btn.text(timeout + "秒后重新获取");
					}, 1000)
				},

				sendCode: function () {
					var mobile = utils.storage.get("registPhoneNumber");
					RegisterModel.countDown();
					// 验证是否同意用户协议
					console.log("mobile" + mobile);
					utils.storage.set("mobile" + (number++));
					//window.location.href = window.ctx + "/register/step2.html";
					// Api.sendCaptchaCode(mobile, function(){
					//     $btnVerificationCode.addClass("disabled");
					// }, function(){
					//     $.Dialog.success("发送成功");
					//    RegisterModel.countDown;
					// }, function(){

					// });

				},


			};

			RegisterModel.init();

		});

	});
