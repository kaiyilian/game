define([], function() {
	'use strict';


	function Countdown(startDate, endDate, intervalCallbak, callback) {
	}

	return Countdown.prototype = {

		// 时
		hour: 0,

		// 分
		minute: 0,

		// 秒
		second: 0,

		// 时间差
		_diff: 0,

		// 定时
		_interval: '',

		// 倒计时结束回调
		_callback: function() {},

		// 周期回调函数
		_intervalCallback: function() {},

		/**
		 * 初始化倒计时
		 * @param  {[type]} endDate  		结束日期
		 * @param  {[type]} intervalCallbak 周期回调函数
		 * @param  {[type]} callback 		倒计时结束回调
		 * @return 倒计时对象
		 */
		init: function(endDate, intervalCallbak, callback) {
			var self = new Countdown();


			if (typeof endDate == "undefined") {
				throw new Error("Missing endDate parameter!");
			}

			if (typeof intervalCallbak == "function") {
				self._intervalCallback = intervalCallbak;
			}

			if (typeof callback == "function") {
				self._callback = callback;
			}

			// 计算时间差（unix）
			self._diff = Date.parse(endDate.replace(/-/g, "/")) - new Date().getTime();
			return self;
		},

		/**
		 * 开始倒计时
		 */
		start: function() {
			var self = this;
			if (self._diff <= 0) { 
				self._callback();
				return; 
			}

			self._interval = window.setInterval(function() {
				if (self._diff <= 0) {
					self._intervalCallback(0, 0, 0);
					clearInterval(self._interval);
					self._callback();
					return;
				}

				var rest = self._diff;
				self.hour = Math.floor(rest / (1000 * 60 * 60));
				rest -= self.hour * 1000 * 60 * 60;
				self.minute = Math.floor(rest / (1000 * 60));
				rest -= self.minute * 1000 * 60;
				self.second = Math.ceil(rest / 1000);

				// 时间差减1秒
				self._intervalCallback(self._pad(self.hour > 99 ? 99 : self.hour), self._pad(self.minute), self._pad(self.second));
				
				self._diff -= 1000;
			}, 1000);

			return self;
		},

		/**
		 * 补零
		 * @return {[type]} [description]
		 */
		_pad: function(number) {
			return number < 10 ? "0" + number : number;
		},

		/**
		 * 关闭倒计时
		 */
		stop: function() {
			var self = this;
			if (self._interval != '') {
				clearInterval(self._interval);
			}
			return self;
		}
	};

});