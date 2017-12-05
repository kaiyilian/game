define(['zepto', 'jquery', 'underscore', 'backbone',
		'echo', 'app/api', 'app/refreshtoken',
		'app/utils',
		'text!templates/personalInfo.html'
	],

	function ($, Jq, _, Backbone, echo, Api, Token, utils, personalInfoTemplate) {

		var $personalInfoContain;

		var $personalInfoList;

		var imageRenderToken;

		var refreshtokenNumber = 3;//刷新token值次数上限

		var type = 1;//需要先判断是否登录

		var $page = $("#personal-info-page");

		var personalInfoView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {

					$page.empty().append(personalInfoTemplate);

					$personalInfoContain = $page.find(".personal_info_contain");

					$personalInfoList = $page.find("#personal_info_list");

					initPersonalInfo();

				});
			},
			events: {

				"tap .nickname_container": "toNickName",//修改昵称

				"tap .user_pwd_container": "toPwdModify",//修改密码

				"tap .to_bind_phone": "toBindPhone",//绑定手机号

				"tap .user_sex_container": "chooseSexModalShow",//选择性别 弹框显示
				"tap .modal": "chooseSexModalHide",//选择性别 弹框隐藏
				"tap .modal .item": "chooseSex",//选择性别

				"tap .user_head_img_container": "changeHeadImg",//更换头像

				"tap #img": "tt",//更换头像

				//返回
				"tap .go_back": "goBack",

				"tap .do_upload":"uploadForm",

			},

			//选择性别 弹框显示
			chooseSexModalShow: function () {
				$page.find(".modal").show();
			},

			//选择性别 弹框隐藏
			chooseSexModalHide: function () {
				$page.find(".modal").hide();
			},

			//选择性别
			chooseSex: function (e) {

				e.stopPropagation();
				var $this = $(e.currentTarget);

				var sex = $this.html();

				//更新性别
				genderModify(sex);

				//$page.find(".user_sex_container .user_sex").html(sex);

				$page.find(".modal").hide();

			},


			tt: function () {
			},

			uploadForm: function(){
				var formData = new FormData($( "#personUploadForm" )[0]);  
			     Jq.ajax({  
			          url: window.API_URL + '/upload' ,  
			          type: 'POST',  
			          data: formData,  
			          async: false,  
			          cache: false,  
			          contentType: false,  
			          processData: false,  
			          success: function (successData) {
			          	toBtnSubmit(successData.result);
			          },  
			          error: function (errorData) {

			          }  
			     });
			},

			//更换头像
			changeHeadImg: function () {

				var $input = $("<input>").addClass("img_upload").hide();
				$input.attr("type", "file");
				$input.attr("name", "image");

				$input.change(function () {

					$(".upload_form_p").append($input);

					$(".do_upload").trigger("tap");
				});

				$input.trigger("click");

			},

			toNickName: function () {
				window.location.hash = "nickName";

			},

			toPwdModify: function () {
				window.location.hash = "pwdModify";

			},

			toBindPhone: function () {
				window.location.hash = "bindPhoneStep1";

			},

			goBack: function () {

				window.location.hash = "my";
			},

		});

		//初始化个人信息
		var initPersonalInfo = function () {

			var param = null;

			Api.getMemberInfo(param, function () {

			}, function (successsData) {

				var template = _.template($personalInfoList.html());

				$personalInfoContain.empty().append(template(successsData.result));

				asynLoadImage();
			}, function (errorData) {

				if ((--refreshtokenNumber) < 0) {

					window.location.href = window.LOGIN_REDIRECT_URL
					//window.location.href = window.ctx + "/login.html";

					rerurn;
				}

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						initPersonalInfo();

					}, function (data) {


					});
				}


			});

		};

		//更新图片
		var toBtnSubmit = function(result){

			var pic = result[0].url;

			var formData = "avatar=" + pic; 

			var param = {formData:formData};

			Api.uploadImage(param, function(successData){
				$.Dialog.success("上传成功");
				$(".upload_form_p").empty();
				initPersonalInfo();
			}, function(errorData){

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(1, function (data) {

						toBtnSubmit();

					}, function (data) {


					});
				}

			})
		};

		//更新性别
		var genderModify = function (sex) {
			var gender;

			switch (sex) {

				case '男':
					gender = 1;
					break;
				case '女':
					gender = 2;
					break;
			}

			var formData = "gender=" + gender;

			var param = {formData: formData};

			Api.genderModify(param, function (successsData) {

				initPersonalInfo();
			}, function (errorData) {

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						genderModify(sex);

					}, function (data) {


					});
				}
			});
		};

		var asynLoadImage = function () {
			echo.init({
				throttle: 250,
			});

			if (imageRenderToken == null) {
				imageRenderToken = window.setInterval(function () {
					echo.render();
				}, 350);
			}
		};


		return personalInfoView;
	});
