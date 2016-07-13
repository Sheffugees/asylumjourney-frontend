(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.run(runBlock);

	/** @ngInject */
	function runBlock(ngDialog, $rootScope, $location) {

		var deregistrationCallback = $rootScope.$on('$routeChangeStart', function(next, current) {
			if (next !== current) {
				ngDialog.closeAll();
				$rootScope.dialogOpen = false;
			}
		});

		if ($location.host() !== 'localhost') {
			ga('create', 'UA-80488368-1', 'auto');

			deregistrationCallback = $rootScope.$on('$routeChangeSuccess', function() {
				ga('send', 'pageview', $location.path());
			});
		}

		$rootScope.$on('$destroy', deregistrationCallback)
	}

})();
