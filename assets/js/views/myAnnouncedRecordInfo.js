define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils',
		'text!templates/myAnnouncedRecordInfo.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, myAnnouncedRecordInfoTemplate) {

		var $page = $("#my-announced-record-info-page");
		var $order_id;

		var myAnnouncedRecordInfoView = Backbone.View.extend({
			el: $page,
			render: function (order_id) {
				utils.showPage($page, function () {
					//$page.empty().append(myAnnouncedRecordInfoTemplate);

					$order_id = order_id;
					initData();//
				});
			},
			events: {
				"tap .btn_search_no": "btnSearchNo",

			},

			btnSearchNo: function (e) {

				e.stopImmediatePropagation();
//console.log(e)
				var $this = $(e.currentTarget);

				var index = $this.closest("tr").index();

				var content = sessionStorage.getItem("personalNoList_" + index);

				var dia = $.dialog({
					title: '',
					content: content,
					button: ["关闭"]
				});

			}

		});

		//初始化 数据
		var initData = function () {

			var param = {
				order_id: $order_id
			};

			Api.getAnnouncedRecordDetail(
				param,
				function (data) {
					//console.info("夺宝详情：");
					//console.log(data);

					var template = _.template(myAnnouncedRecordInfoTemplate);
					$page.empty().append(template(data.result));

					var records = data.result.records;
					if (records && records.length > 0) {

						for (var i = 0; i < records.length; i++) {
							var $item = records[i];

							//夺宝号码
							var sns = $item.sns;
							var sns_list = "";
							if (sns) {
								//console.log(sns)
								for (var j = 0; j < sns.length; j++) {
									var item = sns[j];

									sns_list += "<span class='personal_no'>" + item + "</span>";

								}

								sessionStorage.setItem("personalNoList_" + i, sns_list);//夺宝号码 列表

							}

						}

					}

				},
				function (data) {
					console.log("夺宝记录详情---error");
					console.log(data);
				}
			)

		};


		return myAnnouncedRecordInfoView;
	});
