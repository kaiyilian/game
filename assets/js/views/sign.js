define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api','app/refreshtoken',
        'app/utils', 'app/scroll',
        'text!templates/sign.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, Token, utils, scroll, signTemplate) {
       
        var $page = $("#sign-page");
        var type = 1;//1  需要先判断是否登陆
        var accessToken ;
        var param = null;
        var platform =null;
        var toHide;
        var signView = Backbone.View.extend({
            el: $page,
            render: function() {
                //utils.showMenu();
                utils.showPage($page, function() {
                    $page.empty().append(signTemplate);
                    utils.getUrl(location.href);
                    param = {accessToken:utils.storage.get("access_token")} ;
                    accessToken = utils.storage.get("access_token");
                    //如果URL里面有platform ,title 就不显示

                    if (location.href.indexOf("platform") > -1) {
                        platform = true;
                        $page.find("header").hide();
                        $page.find(".ui-content").css("border-top", "0");
                    }

                    initData();
                        
                });
            },
            events: {
                "tap .to_sign":"sign",
            },

            sign: function(){
                toSign();               
            },

        });

        //签到
        var toSign = function(){
            param = {accessToken:utils.storage.get("access_token")} ;
            Api.signIn(param, function(successData){
                    initData();
                }, function(errorData){
                    // if(accessToken)
                    //     return;
                    //token过期 刷新token
                    if( errorData.err_code == 20002 ){

                        Token.getRefeshToken(type,function(data){  

                            toSign();

                        },function(data){

                           // window.location.href = window.LOGIN_REDIRECT_URL;
                        });
                    }
                });
        };

        //初始化数据
        var initData = function(){
            param = {accessToken:utils.storage.get("access_token")} ;
            //得到签到信息
            Api.getSignInfo(param, function(successData){
                
                successData.result.toHide = toHide;
                var template = _.template(signTemplate);
                $page.empty().append(template(successData.result));
                if (location.href.indexOf("platform") > -1) {
                        platform = true;
                        $page.find("header").hide();
                        $page.find(".ui-content").css("border-top", "0");
                    }
                //$(".sign_show_hide").show();
            }, function(errorData){

                if(platform)
                        return;
              //token过期 刷新token

                if( errorData.err_code == 20002 ){  
                    Token.getRefeshToken(type,function(data){

                        initData();

                    },function(data){

                    //window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }  
            });
        };

    return signView;
    
    });
