(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('OverviewController', OverviewController);

    function OverviewController(data, $scope, ngDialog) {
        var vm = this;
        var filteredCategories = [];
        var filteredStages = [];

        vm.services = [];
        vm.filtered = false;
        vm.showCategoryFilters = false;
        vm.showStageFilters = false;

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

                angular.forEach(vm.stages, function(stage) {
                    stage.display = true;
                });

			});
		}

        function getCategories() {
            data.categories().get().$promise.then(function(response) {
				vm.categories = response._embedded.categories;

                angular.forEach(vm.categories, function(itemCategory) {
                    itemCategory.display = true;
                });

			});
		}

        function updateFilteredArray(filteredId, array, list) {
            var index = array.indexOf(filteredId);

            if (index === -1) {
                array.push(filteredId);
                return;
            }

            array.splice(index, 1);

            if (!array.length) {
                vm.resetFilters(array, list);
            }
        }

        function updateFilteredItem(item, filter) {
            item.display = filter;
            item.filtered = filter;
        }

        function filterItems(filterId, filteredArray, list) {
            vm.filtered = true;

            angular.forEach(list, function(item) {

                if (item.id === filterId) {
                    updateFilteredItem(item, filteredArray.indexOf(filterId) === -1);
                    return;
                }

                if (filteredArray.indexOf(item.id) !== -1) {
                    return;
                }

                updateFilteredItem(item, false);

            });

            updateFilteredArray(filterId, filteredArray, list);
        }

        function resetFilter (list) {
            angular.forEach(list, function(item) {
                item.display = true;
                item.filtered = false;
            });
        }

        vm.filterStage = function(stageId) {
            filterItems(stageId, filteredStages, vm.stages);
        };


        vm.filterCategory = function(filterId) {
            filterItems(filterId, filteredCategories, vm.categories);
        };

		vm.toggleIssues = function () {
			vm.showIssues = !vm.showIssues;
        }

        vm.resetFilters = function(array, list) {
            resetFilter(list);
            array = [];
        };

        vm.resetAll = function () {
            resetFilter(vm.stages);
            resetFilter(vm.categories);
            filteredCategories = [];
            filteredStages = [];
        };

        vm.expandCategoryFilters = function(a) {
            vm.showCategoryFilters = !a;
        };

        vm.expandStageFilters = function(a) {
            vm.showStageFilters = !a;
        };

        vm.openDialog = function () {
            ngDialog.open({
                template: 'app/components/info-overlay/info.html',
                scope: $scope
            });
        }

    }

})();

