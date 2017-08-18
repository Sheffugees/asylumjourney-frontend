(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ToolController', ToolController);

  /** @ngInject */
  function ToolController(AuthService, data, $route, $scope, ngDialog, $routeParams, $location) {
    var vm = this;
    vm.services = [];
    vm.filtered = false;
    vm.showLoader = true;
    vm.showIssues = false;
    vm.showFilters = false;
    vm.filteredServiceUsers = [];
    vm.filteredProviders = [];
    vm.searchText = $routeParams.q;
    vm.showAllFilters = false;
    vm.numStagesDisplayed = 0;
    vm.authService = AuthService;

    vm.expandFilters = {
      stages: false,
      categories: false,
      serviceUsers: false,
      providers: false
    }

    vm.currentFilters = {
      stages: [],
      categories: [],
      serviceUsers: [],
      providers: []
    };

    activate();

    function activate() {
      getServices();
      getProviders();
      getStages();
      getCategories();
      getServiceUsers();
    }

    function filterFromRouteParams (type, item) {
      var selected = $routeParams[type].split(',');

      angular.forEach(selected, function(selectedItem) {

        if (item.id === parseInt(selectedItem, 10)) {
          item.display = true;

          updateActiveFilters(item.id, type);
          updateCurrentFilter(item.id, type);

          if (type === 'stages') {
            var displayedStages = vm.stages.filter(function (stage) {
              return stage.display;
            });
            vm.numStagesDisplayed = displayedStages.length;
          }
        }

      });
      return;
    }

    function updateDisplay (type) {
      angular.forEach(vm[type], function(item) {
        if ($routeParams[type] && $routeParams[type] !== 'all') {
          filterFromRouteParams(type, item);
          return;
        }
        item.display = true;
      });
    }

    function getServices() {
      data.getServices().then(function () {
        vm.services = angular.copy(data.services);

        angular.forEach(vm.services, function(item) {
          item.display = true;
        });

        if (vm.searchText) {
          vm.doSearch();
        }
        vm.showLoader = false;
      });
    }

    function getProviders() {
      data.getProviders().then(function() {
        vm.providers = angular.copy(data.providers);
        updateDisplay('providers');
      });
    }

    function getStages() {
      data.getStages().then(function() {
        vm.stages = angular.copy(data.stages);
        updateDisplay('stages');
      });
    }

    function getCategories() {
      data.getCategories().then(function() {
        vm.categories = angular.copy(data.categories);
        updateDisplay('categories');
      });
    }

    function getServiceUsers() {
      data.getServiceUsers().then(function() {
        vm.serviceUsers = angular.copy(data.serviceUsers);
        updateDisplay('serviceUsers');
      });
    }

    // shows which are filtered in dropdown
    function updateFilteredItem(item, filter) {
      item.display = filter;
      item.filtered = filter;
    }

    //Updates active filters in dropdown
    function updateActiveFilters (filterId, type) {
      angular.forEach(vm[type], function(item) {
        var isFiltered = vm.currentFilters[type].filter(function (filteredItem) {
          return filteredItem.id === item.id;
        })[0];
        var isCurrentlyFiltered = isFiltered ? true : false;
        if (item.id === filterId) {
          updateFilteredItem(item, !isCurrentlyFiltered);
          return;
        }

        if (isCurrentlyFiltered) {
          return;
        }

        updateFilteredItem(item, false);
      });
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

    function addToQS (qs, item, type) {
      var qsArray = [];
      if (qs) {
        qsArray = qs.length > 1 ? qs.split(',') : [qs];
      }
      var qsString = item;
      if (qsArray.indexOf('all') !== -1) {
        qsArray.splice(qsArray.indexOf('all'),1);
      }
      if (qsArray.indexOf(item.toString()) === -1) {
        qsArray.push(item);
        if (qsArray.length > 1) {
          qsString = qsArray.join(",");
        }
        var params = {};
        params[type] = qsString;
        $route.updateParams(params);
      }
    }

    function removeFromQS (qs, item, type) {
      if (!qs) {
        return;
      }
      var qsArray = qs.length ? qs.split(',') : [];
      var qsString = item;
      qsArray.splice(qsArray.indexOf(item.toString()), 1);
      qsString = qsArray.join(",");
      var params = {};
      params[type] = qsString;
      $route.updateParams(params);
    }

    function updateCurrentFilter (filterId, type){

      var currentlyFiltered = vm.currentFilters[type].filter(function (item) {
        return item.id === filterId;
      })[0];

      // adding filter
      if (!currentlyFiltered) {

        var selectedFilter = vm[type].filter(function(item) {
          return item.id === filterId;
        })[0];
        vm.currentFilters[type].push({id: filterId, name: selectedFilter.name});
        addToQS($routeParams[type], filterId, type);

        if (type === 'serviceUsers') {
          vm.filteredServiceUsers.push(filterId);
        }
        if (type === 'providers') {
          vm.filteredProviders.push(filterId);
        }

        return;
      }
      //removing filter
      vm.currentFilters[type] = vm.currentFilters[type].filter(function(obj) {
        return obj.id !== filterId;
      });

      removeFromQS($routeParams[type], filterId, type);

      if (!vm.currentFilters[type].length) {
        resetFilter(vm[type]);
      }

      if (type === 'serviceUsers') {
        var index = vm.filteredServiceUsers.indexOf(filterId);
        vm.filteredServiceUsers.splice(index, 1);
      }

      if (type === 'providers') {
        var providerIndex = vm.filteredProviders.indexOf(filterId);
        vm.filteredProviders.splice(providerIndex, 1);
      }
    }

    vm.filterServices = function (filterId, type) {
      updateActiveFilters(filterId, type);
      updateCurrentFilter(filterId, type);

      //Get number of stages displayed for use in CSS class
      if (type === 'stages') {
        var displayedStages = vm.stages.filter(function (stage) {
          return stage.display;
        });
        vm.numStagesDisplayed = displayedStages.length;
      }
    }

    vm.toggleIssues = function () {
      vm.showIssues = !vm.showIssues;
    };

    // for mobile
    vm.toggleMobileFilters = function () {
      vm.showFilters = !vm.showFilters;
    };

    vm.resetFilters = function(array, list, type) {
      resetFilter(list);
      vm.currentFilters[type] = [];
      array = [];
      vm.numStagesDisplayed = vm.stages.length;
    };

    vm.showAll = function () {
      vm.closeFilters();
      resetFilter(vm.stages);
      resetFilter(vm.categories);
      resetFilter(vm.serviceUsers);
      resetFilter(vm.providers);
      vm.resetSearch();
      vm.numStagesDisplayed = vm.stages.length;
      vm.filteredServiceUsers = [];
      vm.filteredProviders = [];
      vm.showIssues = false;
      vm.currentFilters = {
        stages: [],
        categories: [],
        serviceUsers: [],
        providers: []
      };
      $location.search({});
    };

    vm.toggleSecondaryFilters = function () {
      vm.showAllFilters = !vm.showAllFilters;
      vm.closeFilters();
    }

    vm.toggleFilter = function (type) {
      vm.expandFilters[type] = !vm.expandFilters[type];
      angular.forEach(vm.expandFilters, function (value, key) {
        if (key !== type) {
          vm.expandFilters[key] = false;
        }
      });
    }

    // toggle Provider filter
    vm.toggleProviderFilters = function() {
      ngDialog.open({
        template: 'app/components/filter-bar/providers-overlay.html',
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
      angular.forEach(vm.expandFilters, function (value, key) {
        vm.expandFilters[key] = false;
      });
    };

    vm.doSearch = function () {
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

    vm.resetFilterType = function (type) {
      resetFilter(vm[type]);
      if (type === 'stages') {
        vm.numStagesDisplayed = vm.stages.length;
      }
      if (type === 'serviceUsers') {
        vm.filteredServiceUsers = [];
      }
      if (type === 'providers') {
        vm.filteredProviders = [];
      }
      vm.currentFilters[type] = [];

      var params = {};
      params[type] = 'all';
      $route.updateParams(params);
    }

  }

})();
