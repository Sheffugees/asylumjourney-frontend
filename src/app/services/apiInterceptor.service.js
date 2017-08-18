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
        if (rejection.status === 401) {
          $rootScope.$broadcast('logout')
        }
        return $q.reject(rejection);
      }
    };
  }
})();
