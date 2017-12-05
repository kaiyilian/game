/**
 * Created by CuiMengxin on 2016/9/16.
 */

$(function () {
	//footer item点击事件
	$(".ui-footer").find(".ui-col").each(function () {
		$(this).click(function () {
			var url = $(this).attr("data-href");
			if (url)
				location.href = url;
		});
	});
});

//获取倒计时时间
var time_count_down = function (self) {
	//debugger
	var time = $(self).attr("data-time");
	if (!time) {
		return
	}
	time = new Date(time).getTime();
	var now = new Date().getTime();

	var intDiff = (time - now) / 1000;
	if (intDiff > 0) {
		var second = Math.floor(intDiff % 60);
		var minute = Math.floor((intDiff / 60) % 60);
		var hour = Math.floor((intDiff / 3600));
		hour = hour < 10 ? "0" + hour : hour;
		minute = minute < 10 ? "0" + minute : minute;
		second = second < 10 ? "0" + second : second;

		var count_down = hour + ":" + minute + ":" + second;
		$(self).html(count_down);
	}
	else {
		$(self).html("时间截止");
		return
	}

	setTimeout(function () {
		time_count_down(self);
	}, 1000)

};


