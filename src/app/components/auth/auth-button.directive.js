(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('authButton', authButton);

  function authButton() {
    var authButton = {
      templateUrl: 'app/components/auth/auth-button.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    };
    return authButton;
  }
})();
