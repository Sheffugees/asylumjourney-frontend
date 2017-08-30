(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .factory('APIInterceptor', APIInterceptor);

  /** @ngInject */
  function APIInterceptor ($q, $rootScope, $window, config) {

    return {
      request: function(request) {
        var token =  $window.localStorage.getItem('ajToken');
        if (token && request.url.indexOf(config.apiUrl) != -1) {
          request.headers.Authorization = 'Bearer ' + token;
        }
        return request;
      },

      'responseError': function(rejection) {
        var isLoginRequest = rejection.config.url.indexOf('login_check') !== -1;
        if (rejection.status === 401 && !isLoginRequest) {
          $rootScope.$broadcast('logout')
        }
        return $q.reject(rejection);
      }
    };
  }
})();
