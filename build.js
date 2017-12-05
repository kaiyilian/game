({
    appDir: './',
    baseUrl: './assets/js',
    dir: './dist',
    modules: [
       { name : 'main' }, {
            name : 'views/main'
        }
    ],
    // name: 'app',
    // out : "../build.min.js",
    fileExclusionRegExp: /^(r|build)\.js|.*\.css$/,
    // cssIn : './assets/css/main.css',
    optimize : 'uglify',
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        zepto: 'libs/zepto.min',
        jquery: 'libs/jquery-2.1.1.min',
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
        'jquery': {
            exports: '$'
        },
        'zepto': {
            exports: '$'
        },
        'backbone': {
            deps: ['underscore', 'zepto'],
            exports: 'Backbone'
        },
        'swiper' : {
            deps: ['zepto'],
            exports: 'Swiper'
        },
        'jweixin' : {
            deps:[],
            exports : 'jweixin'
        }
    }
})
