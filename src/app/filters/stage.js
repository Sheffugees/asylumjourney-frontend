(function () {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.filter('stage', stage);

	function stage() {

		return function stageFilter(items, stage) {
			var filtered = [];

			angular.forEach(items, function(item) {
				angular.forEach(item._embedded.stages, function(itemStage) {
					if (itemStage.id === stage) {
						filtered.push(item);
					}
				});
			});
			return filtered;
		}
	}
})();
