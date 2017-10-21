(function() {
	'use strict';

	angular
	.module('asylumjourneyFrontend')
	.run(runBlock);

	/** @ngInject */
	function runBlock(ngDialog, $rootScope, $location, AuthService) {
		$rootScope.env = ($location.host() === 'localhost' || $location.host() === 'aj-staging.firebaseapp.com') ? 'dev' : 'prod';
		$rootScope.robots = $rootScope.env === 'dev' ? 'noindex, nofollow' : 'index, follow';

		var deregistrationCallback = $rootScope.$on('$routeChangeStart', function(event, next, current) {
			if (next !== current) {
				ngDialog.closeAll();
				$rootScope.dialogOpen = false;
			}
			AuthService.checkAuthentication().then(function (){
				if (next && next.authenticate && !AuthService.isAuthenticated) {
					$location.path('/');
					event.preventDefault();
					return;
				}
			});
		});

		if ($rootScope.env === 'prod') {
			if (typeof ga === 'undefined') {
				return;
			}

			ga('create', 'UA-80488368-1', 'auto');
			deregistrationCallback = $rootScope.$on('$routeChangeSuccess', function() {
				ga('send', 'pageview', $location.url());
			});
		}

		$rootScope.$on('$destroy', deregistrationCallback);
	}

})();
