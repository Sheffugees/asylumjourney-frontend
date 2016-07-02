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

        vm.showLoader = true;

        vm.stagesFiltered = false;
        vm.currentFilters = {
            stages: false,
            categories: false
        }

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
                vm.showLoader = false;
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

        function updateFilteredArray(filteredId, array, list, type) {
            var index = array.indexOf(filteredId);

            if (index === -1) {
                array.push(filteredId);
                return;
            }

            array.splice(index, 1);

            if (!array.length) {
                vm.resetFilters(array, list, type);
            }
        }

        function updateFilteredItem(item, filter) {
            item.display = filter;
            item.filtered = filter;
        }

        function filterItems(filterId, filteredArray, list, type) {
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

            updateFilteredArray(filterId, filteredArray, list, type);
        }

        function resetFilter (list) {
            angular.forEach(list, function(item) {
                item.display = true;
                item.filtered = false;
            });
        }

        vm.filterStage = function(stageId) {
            vm.currentFilters['stage'] = true;
            filterItems(stageId, filteredStages, vm.stages, 'stage');
        };


        vm.filterCategory = function(filterId) {
            vm.currentFilters['category'] = true;
            filterItems(filterId, filteredCategories, vm.categories, 'category');
        };

		vm.toggleIssues = function () {
			vm.showIssues = !vm.showIssues;
        }

        vm.resetFilters = function(array, list, type) {
            resetFilter(list);
            vm.currentFilters[type] = false;
            array = [];
        };

        vm.resetAll = function () {
            resetFilter(vm.stages);
            resetFilter(vm.categories);
            filteredCategories = [];
            filteredStages = [];
			vm.showIssues = false;
        };

		// toggle category filter
        vm.expandCategoryFilters = function(a) {
            vm.showCategoryFilters = !a;
        };

		// toggle stage filter
        vm.expandStageFilters = function(a) {
            vm.showStageFilters = !a;
        };

        vm.openDialog = function () {
            ngDialog.open({
                template: 'app/components/info-overlay/info.html',
                scope: $scope
            });
        }
		// close all filters
		vm.closeFilters = function() {
			vm.showCategoryFilters = false;
			vm.showStageFilters = false;
		}

    }

})();

