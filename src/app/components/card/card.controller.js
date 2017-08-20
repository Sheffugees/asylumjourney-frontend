(function() {
  'use strict';

    angular
    .module('asylumjourneyFrontend')
    .controller('CardController', CardController);

    function CardController($scope, ngDialog, $routeParams, $rootScope, $timeout, AuthService, data) {
        var vm = this;
        vm.authService = AuthService;
        vm.service = $scope.service;
        vm.deleteService = deleteService;
        vm.deleted = false;
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

        function deleteService () {
            data.deleteService(vm.service.id).then(function () {
                vm.deleted = true;
                $rootScope.$broadcast('updateServices');
                $timeout(function () {
                    ngDialog.close();
                }, 1000);
            })

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
