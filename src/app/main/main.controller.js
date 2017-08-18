(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(AuthService) {
    var vm = this;
    vm.authService = AuthService;
  }
})();
