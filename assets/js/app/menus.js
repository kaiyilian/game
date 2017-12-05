/**
 * 菜单选择工具
 */
define(['zepto', 'app/utils'], function($, utils) {

	/**
	 * [
	 * 	{
	 * 		'id': 10,
	 * 		'name': '热菜',
	 * 		'books': [
	 * 			{
	 * 				'id': 4,
	 * 				'name': '红烧肉',
	 * 				'pic': 'http://www.baidu.com/img...'
	 * 			},
	 * 			...
	 * 		]
	 * 	},
	 * 	...
	 * ]
	 */

	/**
	 * 获取菜单json对象
	 */
	var getMenus = function() {
		var menus = utils.storage.get('menus');
		if (menus == null || menus == "") {
			return [];
		}
		return JSON.parse(menus);
	};

	/**
	 * 保存菜单的json对象
	 */
	var setMenus = function(menus) {
		utils.storage.set('menus', JSON.stringify(menus));
	};

	/**
	 * 查询菜谱分类
	 */
	var getCategory = function(menus, categoryId, categoryName) {

		// 遍历菜单中的分类信息，根据分类编号比对，存在则返回
		for (var i in menus) {
			if (menus[i].id == categoryId) {
				return menus[i];
			}
		}	

		// 菜单中不存在查询的分类，返回初始化的分类信息
		return {
			id: categoryId, 
			name: categoryName, 
			books: [
			]
		};	
	};

	/**
	 * 保存分类信息
	 */
	var setCategory = function(menus, category) {
		for (var i in menus) {
			if (menus[i].id == category.id) {
				menus.splice(i, 1);
			}
		}

		menus.push(category);

		return menus;
	};

	/**
	 * 保存菜谱信息
	 */
	var setBook = function(category, bookId, bookName, bookPic) {

		// 查询分类中是否包含此菜谱，包含则直接返回此分类
		for (var i in category.books) {
			if (category.books[i].id == bookId) {
				return category;
			}
		}

		// 将菜谱信息放入分类中，并返回分类
		category.books.push({
			id: bookId,
			name: bookName,
			pic: bookPic
		});

		return category;
	};




	return  {
		/**
		 * 选择菜谱
		 * 
		 * @param  {[type]} categoryId   分类编号
		 * @param  {[type]} categoryName 分类名称
		 * @param  {[type]} bookId       菜谱编号
		 * @param  {[type]} bookName     菜谱名称
		 * @param  {[type]} bookPic      菜谱图片
		 * @return {[type]}              
		 */
		choose: function(categoryId, categoryName, bookId, bookName, bookPic) {

			//  查询菜单信息
			var menus = getMenus();

			// 查询分类信息
			var category = getCategory(menus, categoryId, categoryName);

			// 将菜谱信息放入分类中
			category = setBook(category, bookId, bookName, bookPic);

			// 保存更新后的分类信息
			setMenus(setCategory(menus, category));
		},

		// 删除菜谱
		remove: function(bookId) {

			var menus = getMenus();

			for (var i in menus) {
				for (var j in menus[i].books) {
					if (menus[i].books[j].id == bookId) {
						menus[i].books.splice(j, 1);
					}
				}
			}

			setMenus(menus);
		},

		/**
		 * 获取选择菜单
		 */
		get: function() {
			return getMenus();
		},

		/**
		 * 获取菜谱编号
		 */
		getBookIds: function() {
			var ids = [];
			var menus = getMenus();
			for (var i in menus) {
				for (var j in menus[i].books) {
					ids.push(menus[i].books[j].id);
				}
			}
			return ids.join(',');
		},

		/**
		 * 清楚菜单数据
		 */
		clear: function() {
			utils.storage.set('menus', '[]');
		}
	};

});