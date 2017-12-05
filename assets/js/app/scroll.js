// JavaScript Document
(function ($) {
	$.fn.myScroll = function(options){
		//默认配置
		var defaults = {
			speed:40,  //滚动速度,值越大速度越慢
			line:1     //滚动的行数
		};

		var opts = $.extend({}, defaults, options);

		var $timer;
		function marquee(obj, _speed){
			var top = 0;
			var margintop;
			$timer = setInterval(function(){
				top++;
				margintop = 0-top;
				obj.find("ul").animate({
					marginTop: margintop
				},0,function(){
					var s = Math.abs(parseInt($(this).css("margin-top")));
					if(s >= 20){
						top = 0;
						$(this).css("margin-top", 0);   //确保每次都是从0开始，避免抖动
						$(this).find("li").slice(0, 1).appendTo($(this));
					}
				});
			}, _speed);
		}

		this.each(function(){
			var speed = opts["speed"],line = opts["line"],_this = $(this);
			var $ul =_this.find("ul");
			if ($ul.height() <= _this.height()) {
				clearInterval($timer);
			} else {
				marquee(_this, speed);
			}

			//触摸开始
			_this.on('touchstart', function(ev){
				ev.preventDefault();
				clearInterval($timer);
			});

			//向上滑动
			_this.on('swipeup', function(ev){
				ev.preventDefault();
				clearInterval($timer);
				if($ul.height() > _this.height()){
					for(i=0;i<opts.line;i++){
						$ul.find("li").first().appendTo($ul);
					}
					$ul.css("margin-top",0);
				}
			});

			//向下滑动
			_this.on('swipedown', function(ev){
				ev.preventDefault();
				clearInterval($timer);
				if($ul.height() > _this.height()){
					for(i=0;i<opts.line;i++){
						$ul.find("li").first().before($ul.find("li").last());
					}
					$ul.css("margin-top",0);
				}
			});

			//触摸结束
			_this.on('touchend',function(ev){
				ev.preventDefault();
				if($ul.height() > _this.height()){
					marquee(_this, speed);
				}
			});
		});
	}

})(Zepto);