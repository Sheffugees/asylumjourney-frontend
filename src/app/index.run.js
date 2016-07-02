(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.run(runBlock);

	/** @ngInject */
	function runBlock(ngDialog, $rootScope) {

		$rootScope.$on('$routeChangeStart', function(next, current) {
			if (next !== current){
				ngDialog.closeAll();
				$rootScope.dialogOpen = false;
			}
		});
	}

})();
