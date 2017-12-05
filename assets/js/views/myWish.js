define(['zepto', 'jquery', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/scroll',
		'text!templates/myWish.html'
	],

	function ($, Jq, _, Backbone, Swiper, echo, Api, utils, scroll, myWishTemplate) {

		var $page = $("#my-wish-page");
		var flag;//设置 图片上传 检查参数

		var myWishView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {

					$page.empty().append(myWishTemplate);
					flag = 0;
					//location.reload()

				});
			},
			events: {

				"tap .img_add": "imgAdd",//新增图片
				"tap .btn_submit": "wishSubmit",//发布心愿

			},

			imgAdd: function () {

				var $img_list = $page.find(".wish_good_img_list");

				if ($img_list.find("form").length > 0) {
					$img_list.find("form").remove();
				}

				var form = $("<form>");
				form.addClass("img_upload_form");
				form.hide();

				var $input = $("<input>").addClass("img_upload").hide();
				$input.attr("type", "file");
				$input.attr("name", "image");
				$input.attr("accept", "image/*");
				$input.appendTo(form);
				form.appendTo($img_list);

				$input.change(function () {
					//console.log("input------tap");
					chooseImg(this);
					flag = 1;
				});

				$input.trigger("click");
				//$input.click();

			},

			//发布心愿
			wishSubmit: function () {
				if (!checkParamByWishSubmit()) {
					return
				}

				var pics = "";
				var $item = $page.find(".wish_good_img_list .img_item");
				for (var i = 0; i < $item.length; i++) {
					var pic = $item.eq(i).data("src");
					pics += pics == "" ? pic : ("," + pic);

				}

				var param = {
					name: $.trim($page.find(".wish_name").val()),
					pictures: pics,
					short_intro: $.trim($page.find(".wish_desc").val()),
					url: $.trim($page.find(".wish_url").val())
				};

				param = utils.jsonParseParam(param);
				//console.log(param);
				Api.wishPush(
					param,
					function (data) {

						//console.log("发布心愿：");
						//console.log(data);

						if (data.err_code == 0) {
							$(".img_upload_form").empty();
							history.back();
						}


					},
					function (data) {
						console.log("发布心愿---error：");
						console.log(data);
					}
				)

			},


		});

		//选择图片
		var chooseImg = function (self) {

			if (self.files) {
				for (var i = 0; i < self.files.length; i++) {
					var file = self.files[i];
					//判断是否是图片格式
					if (/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|BMP)$/.test(file.name)) {

						if (file.size > 2 * 1024 * 1024) {

							alert('您所选择的档案大小超过了上传上限 2M！\n不允许您上传喔！');

						}
						else {
							//     UploadImg(file.name, file);
							var url = null;
							if (window.createObjectURL != undefined) {
								url = window.createObjectURL(file)
							} else if (window.URL != undefined) {
								url = window.URL.createObjectURL(file)
							} else if (window.webkitURL != undefined) {
								url = window.webkitURL.createObjectURL(file)
							}

							//alert(url)
							var $div = $("<div>").addClass("img_item");
							$div.css("background", "url(" + url + ") no-repeat");
							$div.css("background-size", "100% 100%");
							$page.find(".wish_good_img_list").append($div);

							upImgToService();
						}
					}
					else {
						alert("请上传图片");

					}
				}
			}

		};

		//上传图片  到服务器
		var upImgToService = function () {
			var formData = new FormData($page.find(".wish_good_img_list form")[0]);
			Jq.ajax({
				url: window.API_URL + '/upload',
				type: 'POST',
				data: formData,
				async: false,
				cache: false,
				contentType: false,
				processData: false,
				success: function (successData) {
					console.log("上传图片：");
					console.log(successData);
					//toBtnSubmit(successData.result);

					if (successData.err_code == 0) {
						var url = successData.result[0].url;
						$page.find(".wish_good_img_list").find(".img_item")
							.last().attr("data-src", url);
					}

				},
				error: function (errorData) {

				}
			});
		};

		//发布心愿 检查参数
		var checkParamByWishSubmit = function () {
			var flag = false;
			var txt = "";

			//var pics = "";
			//var $item = $page.find(".wish_good_img_list .img_item");
			//for (var i = 0; i < $item.length; i++) {
			//	var pic = $item.eq(i).data("src");
			//	pics += pics == "" ? pic : ("," + pic);
			//}

			var name = $.trim($page.find(".wish_name").val());
			var short_intro = $.trim($page.find(".wish_desc").val());

			if (!name) {
				txt = "名称不能为空！";
			}
			else if (!short_intro) {
				txt = "心愿内容不能为空！";
			}
			else {
				flag = true;
			}

			if (txt) {
				$.Dialog.confirm('', txt, function () {

				}, "取消", "确定")
			}

			return flag;
		};

		return myWishView;

	});
