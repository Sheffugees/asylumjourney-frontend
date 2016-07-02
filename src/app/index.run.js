(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.run(runBlock);

	/** @ngInject */
	function runBlock(ngDialog, $rootScope) {

		var deregistrationCallback = $rootScope.$on('$routeChangeStart', function(next, current) {
			if (next !== current){
				ngDialog.closeAll();
				$rootScope.dialogOpen = false;
			}
		});


		$rootScope.$on('$destroy', deregistrationCallback)
	}

})();
