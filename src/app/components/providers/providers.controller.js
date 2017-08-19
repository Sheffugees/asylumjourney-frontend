(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ProvidersController', ProvidersController);

  /** @ngInject */
  function ProvidersController(data) {
    var vm = this;
    vm.providers = [];
    vm.deleteProvider = deleteProvider;

    function deleteProvider (id) {
      data.deleteProvider(id).then(function () {
        vm.providers = angular.copy(data.providers);
      });
    }

    function getProviders () {
      data.getProviders().then(function () {
        vm.providers = angular.copy(data.providers);
      });
    }

    getProviders();

  }

})();
