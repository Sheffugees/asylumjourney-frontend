(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .factory('APIInterceptor', APIInterceptor);

  /** @ngInject */
  function APIInterceptor ($injector, $q, $rootScope, $timeout, $window, config) {
    var isReAuthenticating = false;
    var reAuthenticationFailed = false;

    return {
      request: function(request) {
        var token =  $window.localStorage.getItem('ajToken');
        if (token && request.url.indexOf(config.apiUrl) != -1) {
          request.headers.Authorization = 'Bearer ' + token;
        }
        return request;
      },

      'responseError': function(rejection) {
        if (rejection.status === 401 && rejection.data.message === 'Invalid JWT Token') {
          var $http = $injector.get('$http');

          if (!isReAuthenticating) {
            isReAuthenticating = true;

            return $injector.get('AuthService').refreshToken().then(function () {
              isReAuthenticating = false;

              return $http(rejection.config);
            }, function () {
              isReAuthenticating = false;
              $timeout.cancel(retryTimeout);
              reAuthenticationFailed = true;
              $rootScope.$broadcast('logout');
              $injector.get('AuthService').logOut();
              return $q.reject(rejection);
            });
          }

          var retryTimeout = $timeout(function () {
            if (!reAuthenticationFailed) {
              return $http(rejection.config);
            }
          }, 500);
          return retryTimeout;
        }

        return $q.reject(rejection);
      }
    };
  }
})();

