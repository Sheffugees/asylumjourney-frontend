(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ProviderEditController', ProviderEditController);

  /** @ngInject */
  function ProviderEditController($filter, $location, $rootScope, $routeParams, $scope, $timeout, data) {
    var vm = this;
    vm.provider = {};
    vm.save = save;
    vm.saving = false;
    vm.saved = false;
    vm.errorMessage = '';

    var id = parseInt($routeParams.id, 10);
    vm.isNew = id ? false : true;

    if (!vm.isNew) {
      data.getProvider(id).then(function (provider) {
        vm.provider = angular.copy(provider);
        formatDates(vm.provider);
      });
    }

    var returnToService = $routeParams.service;

    function formatDates (provider) {
      var dateFields = ['lastReviewDate', 'nextReviewDate'];
      angular.forEach(dateFields, function (field) {
        provider[field] = $filter('date')(provider[field], 'dd MMM yyyy')
      });
      return provider;
    }

    function save () {
      vm.saving = true;

      vm.provider.lastReviewDate = new Date(vm.provider.lastReviewDate);

      if (vm.isNew) {
        data.createProvider(vm.provider).then(function () {
          vm.saving = false;
          vm.saved = true;
          $timeout(function () {
            $location.path('providers');
          }, 500);
        }, function () {
        vm.errorMessage = 'Sorry there was a problem saving the service.'
        vm.saving = false;
      });
        return;
      }

      data.updateProvider(vm.provider).then(function () {
        vm.saving = false;
        vm.saved = true;
        $timeout(function () {

          if (returnToService) {
            $location.path('/service/' + returnToService);
            return;
          }
          $location.path('providers');
        }, 500);
      }, function () {
        vm.errorMessage = 'Sorry there was a problem saving the service.'
        vm.saving = false;
      });
    }

  }

})();
