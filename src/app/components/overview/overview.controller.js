(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('OverviewController', OverviewController);

    function OverviewController(data) {
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
            data.stages().get().$promise.then(function(response) {
				vm.stages = response._embedded.stages;
			});
		}

        function getCategories() {
            data.categories().get().$promise.then(function(response) {
				vm.categories = response._embedded.categories;
			});
		}
    }

})();
