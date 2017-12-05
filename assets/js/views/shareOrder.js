define(['zepto', 'jquery', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api', 'app/refreshtoken',
		'app/utils', 'app/scroll',
		'text!templates/shareOrder.html'
	],

	function ($, Jq, _, Backbone, Swiper, echo, Api, Token, utils, scroll, shareOrderTemplate) {

		var $page = $("#share-order-page");
		var $good_no = "";//商品编号
		var flag;
		var orderId;
		var $input;
		var imageRenderToken = null;
		var shareOrderView = Backbone.View.extend({
			el: $page,
			render: function (auction_id) {
				//utils.showMenu();
				orderId = auction_id;
				flag = 0;
				utils.showPage($page, function () {

					$page.empty().append(shareOrderTemplate);

					//location.reload()


					if (auction_id)
						$good_no = auction_id;

					initData();//初始化 数据

				});
			},
			events: {

				//点击上传图片
				"tap .img_add": "imgAdd",
				//确认提交
				"tap .btn_submit": "btnSubmit",
				"tap .do_upload": "doUpload",
			},

			doUpload: function () {
				var formData = new FormData($("#uploadForm")[0]);
				Jq.ajax({
					url: window.API_URL + '/upload',
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

			imgAdd: function () {

				if ($(".share_order_img_list").find(".img_upload").length > 0) {
					$(".share_order_img_list").find(".img_upload").remove();
				}

				var $input = $("<input>").addClass("img_upload").hide();
				$input.attr("type", "file");
				$input.attr("name", "image");
				//$input.attr("accept", "image/*");

				$input.change(function () {
					chooseImg(this);
					flag = 1;
					$(".upload_form_p").append($input);
				});

				$input.click();

				//$input.trigger("click");

			},

			btnSubmit: function () {
				if (flag == 1) {
					$(".do_upload").trigger("tap");
				}
				else {
					$.Dialog.info("请选择图片");
				}

				//$(".do_upload").trigger("click");
			},

		});

		var toBtnSubmit = function (result) {

			var productDesc;//	商品描述
			var pic = ""; //图片

			productDesc = $(".ui-textarea").val();
			_.each(result, function (pi) {

				pic += pi.url + ",";
			});
			if (productDesc == null && productDesc == "") {
				$.Dialog.info("请填写评论");
				return;
			}
			if (pic == null && pic == "") {
				$.Dialog.info("请选择图片");
				return;
			}
			//提交晒单
			var formData = "desc=" + productDesc + "&" +
				"order_id=" + orderId + "&" +
				"pic=" + pic;

			var param = {formData: formData, order_id: orderId};

			setUpShareOrder(param);
		};

		var chooseImg = function (self) {
			console.log(self.files.length);
			if (self.files) {
				for (var i = 0; i < self.files.length; i++) {
					var file = self.files[i];
					//判断是否是图片格式
					if (/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|BMP)$/.test(file.name)) {

						if (file.size > 2 * 1024 * 1024) {

							$.Dialog.info('您所选择的档案大小超过了上传上限 2M！\n不允许您上传喔！');

						}
						else {
							//UploadImg(file.name, file);

							if (typeof FileReader == undefined && new FileReader().readAsDataURL) {
								alert("不支持filereader");
							}
							var r = new FileReader();
							r.readAsDataURL(file);
							// debugger
							// alert(JSON.stringify(r))
							console.log(JSON.stringify(r));
							r.onload = function () {
								var img = '<img src="' + this.result + '" alt="" />';

								// $(".share_order_img_list").append(img);
								var $div = $("<div>").addClass("img_item");
								$div.css("background", "url(" + this.result + ") no-repeat");
								$div.css("background-size", "100% 100%");
								$(".share_order_img_list").append($div);


							};


							// var url = null;
							// if (window.createObjectURL != undefined) {
							//         url = window.createObjectURL(file)
							// } else if (window.URL != undefined) {
							//         url = window.URL.createObjectURL(file)
							// } else if (window.webkitURL != undefined) {
							//         url = window.webkitURL.createObjectURL(file)
							// }
							// alert(url)
							// var $div = $("<div>").addClass("img_item");
							// $div.css("background", "url(" + url + ") no-repeat");
							// $div.css("background-size", "100% 100%");
							// $(".share_order_img_list").append($div);

						}
					}
					else {
						$.Dialog.info("请上传图片");

					}
				}
			}


		};

		//初始化 数据
		var initData = function () {

			// sessionStorage.getItem("good_img");//商品图片
			// sessionStorage.getItem("good_name");//商品名称
			// sessionStorage.getItem("good_data_sn");//商品 期号
			param = {order_id: orderId};
			//中奖记录详情
			Api.getPrizeDetail(param, function (successData) {

				var template = _.template(shareOrderTemplate);

				$page.empty().append(template(successData.result));

				asynLoadImage();

			}, function (errorData) {

				//token过期 刷新token
				if (errorData.err_code == 20002) {

					Token.getRefeshToken(1, function (data) {
						//1 需要先判断是否登录
						initData();

					}, function (data) {


					});
				}

			});

		};

		//创建晒单
		var setUpShareOrder = function (param) {

			Api.setUpShareOrder(param, function (successData) {

				$.Dialog.success("晒单分享成功！");
				window.history.go(-1);
			}, function (errorData) {

				//token过期 刷新token
				if (errorData.err_code == 20002) {

					Token.getRefeshToken(1, function (data) {
						//1 需要先判断是否登录
						setUpShareOrder();

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

		var doText = function (self) {

			var formData = new FormData(self.files);
			console.log("formData:" + formData);
			Api.upload(formData, function (successData) {

			}, function (errorData) {

			});
			return;
		};

		return shareOrderView;

	});
