(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController($timeout, AuthService, ngDialog) {
    var vm = this;
    vm.logIn = logIn;
    vm.authService = AuthService;
    vm.loginFailed = false;
    vm.saving = false;

    function logIn () {
      vm.saving = true;
      AuthService.logIn(vm.username, vm.password).then(function () {
        vm.loginFailed = false;
        vm.saving = false;
        $timeout(function () {
          ngDialog.close();
        },2000);
      }, function () {
        vm.loginFailed = true;
        vm.saving = false;
      });
    }
  }

})();
