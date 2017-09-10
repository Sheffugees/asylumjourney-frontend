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
        var count = 0;
        var retryTimeout;
        if (rejection.status === 401 && rejection.config.url.indexOf('login_check') === -1) {
          var $http = $injector.get('$http');

          if (!isReAuthenticating) {
            isReAuthenticating = true;

            return $injector.get('AuthService').refreshToken().then(function () {
              isReAuthenticating = false;
              return $http(rejection.config);
            }, function () {
              isReAuthenticating = false;
              reAuthenticationFailed = true;
              $timeout.cancel(retryTimeout);
              $rootScope.$broadcast('logout');
              $injector.get('AuthService').logOut();
              return $q.reject(rejection);
            });
          }

          if (count < 5) {
            count++;
            retryTimeout = $timeout(function () {
              if (!reAuthenticationFailed) {
                return $http(rejection.config);
              }
            }, 500);

            return retryTimeout;
          }
          return $q.reject(rejection);
        }

        return $q.reject(rejection);
      }
    };
  }
})();

