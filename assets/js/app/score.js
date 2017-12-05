define(['zepto', 'app/utils'], function($, utils) {

    return {

        init: function($container) {
            var len = 5;
            var html = [];
            for (var i = 0; i < len; i++) {
                html.push("<i class='star'></i>");
            }
            $container.empty().append("评价星级").append(html.join(""));
        },

        selected: function($container, index) {
            var $img = $container.find("i");
            $img.removeClass("selected");
            for (var i = 0; i <= index; i++) {
                $img.eq(i).addClass("selected");
            }
        },

        /**
         * [getValue 获取星级值]
         * @param  {[type]} $container [description]
         * @return {[type]}            [description]
         */
        getValue: function($container) {
            var star = $container.find(".selected:last");
            var index = star.index() || 0;
            return index >= 0 ? index + 1 : 0;
        }

    };

});
