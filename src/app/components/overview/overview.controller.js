(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('OverviewController', OverviewController);

    function OverviewController(data, $scope, ngDialog, $routeParams, $location) {
        var vm = this;
        var filteredCategories = [];
        var filteredStages = [];
        var searchModal;

        vm.services = [];
        vm.filtered = false;
        vm.showCategoryFilters = false;
        vm.showStageFilters = false;
        vm.showServiceUserFilters = false;
        vm.showLoader = true;
		vm.showIssues = false;
		vm.showFilters = false;
        vm.currentFilters = {
            stage: false,
            category: false,
            serviceUser: false,
            provider: false
        };
        vm.filteredServiceUsers = [];
        vm.filteredProviders = [];
        vm.searchText = $routeParams.q;

        activate();



        function activate() {
            getServices();
            getProviders();
            getStages();
            getCategories();
            getServiceUsers();
        }

        function getServices() {
            data.services().get().$promise.then(function(response) {
				vm.services = response._embedded.services;

                if (vm.searchText) {
                    vm.doSearch();
                }
                vm.showLoader = false;
			});
        }

        function getProviders() {
            data.providers().get().$promise.then(function(response) {
				vm.providers = response._embedded.providers;

                angular.forEach(vm.providers, function(provider) {
                    provider.display = true;
                });
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

        function getServiceUsers() {
            data.serviceUsers().get().$promise.then(function(response) {
                vm.serviceUsers = response._embedded.serviceUsers;

                angular.forEach(vm.serviceUsers, function(itemServiceUser) {
                    itemServiceUser.display = true;
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

         vm.resetSearch = function () {
            vm.searchText = '';
            $location.search('q', null);
            angular.forEach(vm.services, function(item) {
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

        vm.filterServiceUser = function(filterId) {
            vm.currentFilters['serviceUser'] = true;
            filterItems(filterId, vm.filteredServiceUsers, vm.serviceUsers, 'serviceUser');
        };

        vm.filterProvider = function(filterId) {
            vm.currentFilters['provider'] = true;
            filterItems(filterId, vm.filteredProviders, vm.providers, 'provider');
        };

		vm.toggleIssues = function () {
			vm.showIssues = !vm.showIssues;
        };
		vm.toggleFilters = function () {
			vm.showFilters = !vm.showFilters;
        };

        vm.resetFilters = function(array, list, type) {
            resetFilter(list);
            vm.currentFilters[type] = false;
            array = [];
        };

        vm.resetAll = function () {
            resetFilter(vm.stages);
            resetFilter(vm.categories);
            resetFilter(vm.serviceUsers);
            resetFilter(vm.providers);
            vm.resetSearch();
            filteredCategories = [];
            filteredStages = [];
            vm.filteredServiceUsers = [];
            vm.filteredProviders = [];
			vm.showIssues = false;
            vm.currentFilters = {
                stage: false,
                category: false,
                serviceUser: false,
                provider: false
            };
        };

		// toggle category filter
        vm.expandCategoryFilters = function(a) {
            vm.showCategoryFilters = !a;
        };

		// toggle stage filter
        vm.expandStageFilters = function(a) {
            vm.showStageFilters = !a;
        };

        // toggle service user filter
        vm.expandServiceUserFilters = function(a) {
            vm.showServiceUserFilters = !a;
        };

        // toggle Provider filter
        vm.expandProviderFilters = function() {
            ngDialog.open({
                template: 'app/components/filters/providers-overlay.html',
                scope: $scope
            });
        };

        vm.openDialog = function () {
            ngDialog.open({
                template: 'app/components/info-overlay/info.html',
                scope: $scope
            });
        };

		// close all filters
		vm.closeFilters = function() {
			vm.showCategoryFilters = false;
			vm.showStageFilters = false;
            vm.showServiceUserFilters = false;
		};

        vm.showSearchForm = function () {
            searchModal = ngDialog.open({
                template: 'app/components/search/search-modal.html',
                scope: $scope
            });
        };

        vm.doSearch = function () {
            if (searchModal) {
                searchModal.close();
            }
            if(!vm.searchText) {return;}
            var searchText = vm.searchText.toLowerCase();

            angular.forEach(vm.services, function(item) {
                var name = item.name.toLowerCase();
                var description = item.description ? item.description.toLowerCase() : '';

                if (name.indexOf(searchText) !== -1 || description.indexOf(searchText) !== -1) {
                    updateFilteredItem(item, true);
                    return;
                }
                updateFilteredItem(item, false);

            });

            $location.search('q', vm.searchText);
        };

    }

})();

