(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('CardController', CardController);

    function CardController($scope, ngDialog, $routeParams, $rootScope) {
        var vm = this;
        vm.service = $scope.service;
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
