(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ProviderEditController', ProviderEditController);

  /** @ngInject */
  function ProviderEditController($location, $rootScope, $routeParams, $timeout, data) {
    var vm = this;
    vm.provider = {};
    vm.save = save;
    vm.saving = false;
    vm.saved = false;

    var id = parseInt($routeParams.id, 10);
    vm.isNew = id ? false : true;

    if (!vm.isNew) {
      data.getProvider(id).then(function (provider) {
        vm.provider = angular.copy(provider);
      });
    }

    function save () {
      vm.saving = true;

      if (vm.isNew) {
        data.createProvider(vm.provider).then(function () {
          vm.saving = false;
          vm.saved = true;
          $timeout(function () {
            $location.path('providers');
          }, 500);
        });
        return;
      }

      data.updateProvider(vm.provider).then(function () {
        vm.saving = false;
        vm.saved = true;
        $timeout(function () {
          $location.path('providers');
        }, 500);
      });
    }

  }

})();
