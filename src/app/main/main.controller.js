(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, services) {
    var vm = this;

    vm.services = [];

    activate();

    ////////

    function activate() {
      getServices();
    }

    function getServices() {
      vm.services = services.getServices();
    }
  }
})();
