define(['zepto'], function($) {

	/**
	 * 收藏
	 *
	 * type: 1菜品 2菜谱 3大厨 4商家
	 */

	return  {

		// 添加收藏
		add: function(favId, type, callback) {
			$.ajax({
                url: window.ctx + "favorite/add",
                data: {
                    favId: favId,
                    type: type
                },
                loadMask: true,
                async: false,
                type: "POST",
                dataType: "json",
                success: function(data) {
                    typeof callback == 'function' && callback(data);
                }
            });
		},

		// 取消收藏
		del: function(favId, type, callback) {
			$.ajax({
                url: window.ctx + "favorite/del",
                data: {
                    favId: favId,
                    type: type
                },
                loadMask: true,
                async: false,
                type: "POST",
                dataType: "json",
                success: function(data) {
                    typeof callback == 'function' && callback(data);
                }
            });
		}
	}
})