(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('OverviewController', OverviewController);

    function OverviewController(data, ngDialog) {
        var vm = this;
        vm.services = [];

        activate();

        function activate() {
            getServices();
            getProviders();
            getStages();
            getCategories();
        }

        function getServices() {
            data.services().get().$promise.then(function(response) {
				vm.services = response._embedded.services;
			});
        }

        function getProviders() {
            data.providers().get().$promise.then(function(response) {
				vm.providers = response._embedded.providers;
			});
        }

        function getStages() {
//            data.stages().get().$promise.then(function(response) {
//				vm.stages = response._embedded.stages;
//			});


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
		}

        function getCategories() {
//            data.categories().get().$promise.then(function(response) {
//				vm.categories = response._embedded.categories;
//			});
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
        }
    }

})();
