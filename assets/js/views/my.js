define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/my.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, Token, utils, myTemplate) {
       
        var $page = $("#my-page");
        var type =1;//需要先判断是否登陆
        var $categoryList;
        var $usserInfoContaniter;
        var $userInfoItem;
        var imageRenderToken = null;
        var myView = Backbone.View.extend({
            el: $page,
            render: function(id, name) {
                utils.showPage($page, function() {
                    $page.empty().append(myTemplate);

                    $usserInfoContaniter = $page.find(".usser_info_contaniter");
                    $userInfoItem = $page.find("#user_info_item");;
                    //得到登陆状态
                    getLoginStatus();
                });
            },
            events: {
                //登陆
                "tap .login":"login",
                //设置
                "tap .ui-icon-set":"mySetting",
                //我的消息
                "tap .ui-icon-message":"myMessage",
                //个人信息
                "tap .user_head_img":"personalInfo",
                //梦想币 红包 积分 充值
                "tap .personal_info .item":"aboutMoney",
                //查询 夺宝记录，中奖纪录 ..   我的晒单，充值记录....
                "tap ul li": "queryRecords",
              
            }, 

            login: function(){
                
                utils.storage.set("loginSuccessBack",window.location.hash);
                window.location.href = window.LOGIN_REDIRECT_URL;
            },

            mySetting: function(){

                window.location.hash = "mySetting";
            },

            myMessage: function(){

                window.location.hash = "myMessage";
            },

            personalInfo: function(){

                if( utils.isLogined()){

                    window.location.hash = "personalInfo";
                }else {
                    //登陆
                    window.location.href = window.LOGIN_REDIRECT_URL ;
                }
                
            },

            aboutMoney: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                var dataHref = $this.data("href");

                if(dataHref){

                    window.location.hash = dataHref;
                }

                
            },

            queryRecords: function( e ){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);
 
                var dataHref = $this.data("href");
                
                if( dataHref ){
                   //debugger
                    if(dataHref == "share"){
                        window.location.hash = dataHref + "/my";
                    }else{
                        window.location.hash = dataHref;
                    }

                    
                }
                

            }


        });

        var getLoginStatus = function(){

            if( utils.isLogined()){
                initMembersInfo();

               
            }else{

                $(".user_info_container").find(".login").show().siblings(".user_name").hide();
            }
        };

        //获取个人信息
        var initMembersInfo = function(){

            Api.getMembersInfo(null, function(successData){
                var template = _.template($userInfoItem.html());

                $usserInfoContaniter.empty().append(template(successData.result));

                asynLoadImage();

                $(".user_info_container").find(".login").hide().siblings(".user_name").show();

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){  

                        initMembersInfo();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
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

        
    return myView;
    });
