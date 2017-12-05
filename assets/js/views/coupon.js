define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo', 'frozen', 'app/api',
        'app/utils', 'app/refreshtoken',
        'text!templates/coupon.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, frozen, Api, utils, Token, couponTemplate) {
       
        var $page = $("#coupon-page");
        var comeType;
        var couponView = Backbone.View.extend({
            el: $page,
            render: function(type) {
                comeType = type;
                utils.showPage($page, function() {
                    $page.empty().append(couponTemplate);

                    initData();
                });
            },
            events: {
                //选择红包
                "tap .package_list li":"chooseCoupon",
            },
            //选择红包
            chooseCoupon: function(e){

                e.stopImmediatePropagation();
                if(comeType == "shopping"){
                    utils.storage.set("shoppintCouponId", $(e.currentTarget).data("id"));
                }

                if(comeType =="flash"){
                    utils.storage.set("flashCouponId", $(e.currentTarget).data("id"));
                }
                //utils.storage.set("coupon_id",$(e.currentTarget).data("id"));
                
                //location.href = history.back();
                window.history.go(-1);
            },

        });

        var initData = function(){

            //查询红包记录
            Api.getPackageListOne(null, function(successData){

                var template = _.template($("#package_list_item").html());

                $(".package_list").empty().append(template(successData.result));

            }, function(errorData){
                 if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){

                        initData();

                    },function(data){

                       
                    });
                }
            });
        };

        
    return couponView;
    });
