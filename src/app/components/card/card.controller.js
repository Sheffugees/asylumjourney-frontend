(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('CardController', CardController);

    function CardController($scope, ngDialog, $routeParams, $rootScope) {
        var vm = this;
        vm.service = $scope.service;
        angular.forEach($scope.service._embedded.providers, function(provider) {
          var googleMapsUrl = 'https://www.google.co.uk/maps/place/';
          provider.addressUrl = googleMapsUrl + [provider.address, provider.postcode]
            .join(' ')
            .replace(/\s/g, '+');
        });


		vm.openDialog = openDialog;

        activate();

        function activate() {
			checkRoute();
        }

		function checkRoute() {
			// permalink to modal
			if (!$rootScope.dialogOpen && (parseInt($routeParams.serviceId) === vm.service.id)) {
				vm.openDialog();
				$rootScope.dialogOpen = true;
			}
		}

        function openDialog() {
            ngDialog.open({
                template: 'app/components/detail-overlay/detail.html',
                scope: $scope
            });
        }
    }

})();
