(function () {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.filter('category', category);

	function category() {

		return function categoryFilter(items, category) {
			var filtered = [];

			angular.forEach(items, function(item) {
				angular.forEach(item._embedded.categories, function(itemCategory) {
					if (itemCategory.id === category) {
						filtered.push(item);
					}
				});
			});

			return filtered;
		}
	}
})();
