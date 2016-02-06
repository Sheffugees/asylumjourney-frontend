(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.directive('detail', detail);

	function detail() {
		var detail = {
			templateUrl: 'app/components/detail-overlay/detail.html',
			restrict: 'AE',
			scope: {
					service: '='
			}
		};
		return detail;
	}
})();
