(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('OverviewController', OverviewController);

    function OverviewController(data, ngDialog) {
        var vm = this;
        vm.services = [];

        // TO DO: Move these to service
        vm.categories = [
            {
                id: 1,
                name: "Education"
            },
            {
                id: 2,
                name: "Health"
            },
            {
                id: 3,
                name: "Housing"
            }
        ];

        vm.stages = [
            {
                id: 1,
                name: "Arrival"
            },
            {
                id: 2,
                name: "Awaiting Decision"
            },
            {
                id: 3,
                name: "Positive Decision"
            },
            {
                id: 4,
                name: "Awaiting Return"
            }
        ];

        activate();

        function activate() {
            getServices();
        }

        function getServices() {
            data.services().get().$promise.then(function(response) {
				vm.services = response._embedded.services;
			});
        }
    }

})();
