define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api',
        'app/utils', 'app/scroll',
        'text!templates/resellStore.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, utils, scroll, resellStoreTemplate) {
       
        var $page = $("#resell-store-page");

        var resellStoreView = Backbone.View.extend({
            el: $page,
            render: function() {
                //utils.showMenu();
                utils.showPage($page, function() {

                        $page.empty().append(resellStoreTemplate);

 
                        
                });
            },
            events: {

                //查看转卖商品详情
                "tap ul.good_list > li":"resellGoodDetail",
            },

            resellGoodDetail: function(e){

                e.stopImmediatePropagation();

                window.location.hash = "resellGoodDetail/" + $(e.currentTarget).data("id");



            } ,

        });

        
    return resellStoreView;
    
    });
