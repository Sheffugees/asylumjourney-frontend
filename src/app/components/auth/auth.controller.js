(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController($scope, $timeout, AuthService, ngDialog) {
    var vm = this;
    vm.logIn = logIn;
    vm.logInModal = logInModal;
    vm.authService = AuthService;
    vm.loginFailed = false;
    vm.saving = false;
    vm.options = {
      show: false
    }

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

    function logInModal () {
      ngDialog.open({
        template: 'app/components/auth/login-modal.html',
        className: 'ngdialog-theme-default auth-modal'
      });
    }

    $scope.$on('$routeChangeStart', function() {
      vm.options.show = false;
    });
  }

})();
