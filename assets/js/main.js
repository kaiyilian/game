//window.assetVersion = "1.7.2";
//window.API_URL = "http://mxep/mxep-api/";
//window.ctx = "http://mxep";
//window.imageDomain = "http://image.hexianhui.cn";

window.assetVersion = "1.7.3";
window.API_URL = "http://mxep:91/mxep";//http://api.9jmxep.com/
window.ctx = "http://mxep:91";
window.imageDomain = "http://image.hexianhui.cn";

// window.assetVersion = "1.7.2";
// window.ctx = "http://mxep.ydd100.cn/";
// window.API_URL = window.ctx + "mxep-api";
// window.imageDomain = "http://image.hexianhui.cn";

requirejs.config({
	//By default load any module IDs from js/lib
	// baseUrl: 'assets/js/lib',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	paths: {
		zepto: 'libs/zepto.min',
		// jquery: 'libs/jquery-2.1.1.min',
		backbone: 'libs/backbone.min',
		underscore: 'libs/underscore.min',
		text: 'libs/text',
		urlGroup: "libs/urlGroup",//url集合
		swiper: 'libs/swiper.min',//轮播图
		spinner: 'libs/jquery.spinner',//数量加减
		//rotate: 'libs/jquery.rotate.min',//大转盘
		kinerLottery: 'libs/kinerLottery',//大转盘
		map: 'libs/map',//map
		echo: 'libs/echo.min',
		countdown: 'libs/countdown',
		frozen: 'libs/frozen',
		jweixin: 'http://res.wx.qq.com/open/js/jweixin-1.1.0',
		dropload: 'libs/dropload',
		mobiscroll: 'libs/mobiscroll',
		fly: 'libs/fly'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		// 'jquery': {
		// 	exports: '$'
		// },
		'zepto': {
			exports: '$'
		},
		'backbone': {
			deps: ['underscore', 'zepto'],
			exports: 'Backbone'
		},
		'urlGroup': {
			deps: ['zepto'],
			exports: 'UrlGroup'
		},
		'swiper': {
			deps: ['zepto'],
			exports: 'Swiper'
		},
		'spinner': {
			deps: ['zepto'],
			exports: 'Spinner'
		},
		'map': {
			deps: ['zepto'],
			exports: 'Map'
		},
		//kinerLottery
		'kinerLottery': {
			deps: ['zepto'],
			exports: 'KinerLottery'
		},
		//'rotate': {
		//	deps: ['zepto'],
		//	exports: 'Rotate'
		//},
		'jweixin': {
			deps: [],
			exports: 'jweixin'
		},
		'frozen': {
			deps: ['zepto'],
			exports: 'Frozen'
		},
		'mobiscroll': {
			deps: ['zepto'],
			exports: 'Mobiscroll'
		}
	},
	urlArgs: "v=" + window.assetVersion
});

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	}
	else {
		return false;
	}
}
// Start the router
requirejs(['router'], function (Router) {
	Router.initialize();
});