/**
 * Created by Liujie on 2016/10/19.
 * 时间 初始化
 */

(function (win, doc, $) {

	function timeInit() {

	}

	//其他格式 转换为 "2016/01/02"
	timeInit.prototype.initStr = function (time) {

		if (time == 0 || !time) {
			return "";
		}
		//debugger
		time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

		return time;

	};

	//其他格式 转换为 "2016/01/02 10:12:23"
	timeInit.prototype.initString = function (time) {

		if (time == 0 || !time) {
			return "";
		}
		//debugger
		time = new Date(time);//转换为 时间戳

		//获取完整的年份(4位,1970-????)
		var year = time.getFullYear();//获取当前月份(0-11,0代表1月)
		var month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
		var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(); //获取当前日(1-31)

		var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
		var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
		var second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();

		var timeList = year + "/" + month + "/" + day +
			" " + hour + ":" + minute + ":" + second;
		return time;

	};

	/*  倒计时 (秒)
	 * 传入参数：
	 * 当前时间 currentTime
	 * 结束时间 endTIme
	 * 倒计时执行时的方法 succFunc
	 * 倒计时执行结束方法 endFunc
	 * 传出参数：
	 * 60 (秒)
	 */
	timeInit.prototype.timeDownToSS = function (currentTime, endTime, succFunc, endFunc) {

		if (!currentTime || !endTime) {
			throw "时间参数错误"
		}

		var intDiff = (endTime - currentTime) / 1000;

		function timeDown() {

			if (intDiff >= 0) {
				var second = Math.floor(intDiff % 60);

				succFunc(second);//

				var timeOut = setTimeout(function () {

					if (intDiff > 0) {
						intDiff -= 1;
						timeDown();
					}
					else {
						clearTimeout(timeOut);
						endFunc();
					}
				}, 1000);

			}
			else {
				endFunc();
			}
		}

		timeDown();

	};

	/*  倒计时 (时分秒)  单个倒计时
	 * 传入参数：
	 * 当前时间 currentTime
	 * 结束时间 endTIme
	 * 倒计时执行时的方法 succFunc
	 * 倒计时执行结束方法 endFunc
	 * 传出参数：
	 * 11:12:03 (时分秒)
	 */
	timeInit.prototype.timeDownToHHMMSS = function (currentTime, endTime, succFunc, endFunc) {

		if (!currentTime || !endTime) {
			throw "时间参数错误"
		}
		currentTime = currentTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		endTime = endTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		currentTime = new Date(currentTime).getTime();
		endTime = new Date(endTime).getTime();

		var intDiff = (endTime - currentTime) / 1000;
		//console.info(intDiff);

		function timeDown() {

			if (intDiff >= 0) {
				var second = Math.floor(intDiff % 60);
				var minute = Math.floor((intDiff / 60) % 60);
				var hour = Math.floor((intDiff / 3600));
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;

				var count_down = hour + ":" + minute + ":" + second;

				succFunc(count_down);//

				var timeOut = setTimeout(function () {

					if (intDiff > 0) {
						intDiff -= 1;
						timeDown();
					}
					else {
						clearTimeout(timeOut);
						endFunc();
					}
				}, 1000);

			}
			else {
				endFunc();
			}
		}

		timeDown();
	};

	//倒计时(多个)	(时分秒)
	timeInit.prototype.timeDownToHHMMSSEach = function (currentTime, endTime, self, endFunc) {

		if (!currentTime || !endTime) {
			throw "时间参数错误"
		}
		currentTime = currentTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		endTime = endTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		currentTime = new Date(currentTime).getTime();
		endTime = new Date(endTime).getTime();

		var intDiff = (endTime - currentTime) / 1000;

		function timeDown() {

			if (intDiff >= 0) {
				var second = Math.floor(intDiff % 60);
				var minute = Math.floor((intDiff / 60) % 60);
				var hour = Math.floor((intDiff / 3600) % 24);
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;

				var count_down = hour + ":" + minute + ":" + second;

				$(self).html(count_down);//

				var timeOut = setTimeout(function () {

					if (intDiff > 0) {
						intDiff -= 1;
						timeDown();
					}
					else {
						clearTimeout(timeOut);
						endFunc(self);
					}
				}, 1000);

			}
			else {
				endFunc(self);
			}
		}

		timeDown();
	};

	//倒计时  (分秒毫秒)
	timeInit.prototype.timeDownToMMSSMS = function (currentTime, endTime, succFunc, endFunc) {

		if (!currentTime || !endTime) {
			throw "时间参数错误"
		}
		currentTime = currentTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		endTime = endTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		currentTime = new Date(currentTime).getTime();
		endTime = new Date(endTime).getTime();

		var intDiff = endTime - currentTime;
		console.info(intDiff);

		function timeDown() {

			if (intDiff >= 0) {
				var ms = Math.floor(intDiff % 1000 / 10);
				var second = Math.floor(intDiff / 1000 % 60);
				var minute = Math.floor((intDiff / 1000 / 60) % 60);
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				ms = ms < 10 ? "0" + ms : ms;

				var count_down = minute + ":" + second + ":" + ms;

				succFunc(count_down);//

				var timeOut = setTimeout(function () {

					if (intDiff > 0) {
						intDiff -= 20;
						timeDown();
					}
					else {
						clearTimeout(timeOut);
						endFunc();
					}
				}, 20);

			}
			else {
				endFunc();
			}
		}

		timeDown();
	};

	//倒计时(多个)  (分秒毫秒)
	timeInit.prototype.timeDownToMMSSMSEach = function (currentTime, endTime, self, endFunc) {

		if (!currentTime || !endTime) {
			throw "时间参数错误"
		}
		currentTime = currentTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		endTime = endTime.replace(/-/g, "/");//safari 不支持"2016-05-01",只支持"2016/05/01"
		currentTime = new Date(currentTime).getTime();
		endTime = new Date(endTime).getTime();

		var intDiff = endTime - currentTime;
		//console.info(intDiff);

		function timeDown() {

			if (intDiff >= 0) {
				var ms = Math.floor(intDiff % 1000 / 10);
				var second = Math.floor(intDiff / 1000 % 60);
				var minute = Math.floor((intDiff / 1000 / 60) % 60);
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				ms = ms < 10 ? "0" + ms : ms;

				var count_down = minute + ":" + second + ":" + ms;

				$(self).html(count_down);//赋值

				var timeOut = setTimeout(function () {

					if (intDiff > 0) {
						intDiff -= 20;
						timeDown();
					}
					else {
						clearTimeout(timeOut);
						endFunc(self);
					}
				}, 20);

			}
			else {
				endFunc(self);
			}
		}

		timeDown();
	};

	win.timeInit_J = timeInit;

})(window, document, $);

