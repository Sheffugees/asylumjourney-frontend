(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ProvidersController', ProvidersController);

  /** @ngInject */
  function ProvidersController(data) {
    var vm = this;
    vm.providers = [];

    function getProviders () {
      data.getProviders().then(function () {
        vm.providers = angular.copy(data.providers);
        // vm.showLoader = false;
      });
    }

    getProviders();

  }

})();

// TO DO restrict to admin only
