define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api',
        'app/utils', 'countdown','app/weixin','frozen',
        'text!templates/aboutMe.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, utils, countdown, weixin, fz, aboutMeTemplate) {
       
        var $page = $("#about-me-page");
        var productView = Backbone.View.extend({
            el: $page,
            render: function() {
                //utils.showMenu();
                utils.showPage($page, function() {
                        $page.empty().append(aboutMeTemplate);

                });
            },
            events: {

              
            },     
        });

        
    return productView;
    });
