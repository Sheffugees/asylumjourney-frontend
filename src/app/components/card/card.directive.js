(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.directive('card', card);

	function card() {
		var card = {
			templateUrl: 'app/components/card/card.html',
			restrict: 'AE',
			controller: 'CardController',
			controllerAs: 'card',
			scope: {
					service: '='
			}
		};
		return card;
	}
})();
