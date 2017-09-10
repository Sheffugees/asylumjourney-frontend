(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .factory('APIInterceptor', APIInterceptor);

  /** @ngInject */
  function APIInterceptor ($injector, $q, $rootScope, $timeout, $window, config) {

    function retryHttpRequest(config, deferred) {
      function successCallback(response){
        deferred.resolve(response);
      }
      function errorCallback(response){
        deferred.reject(response);
      }
      var $http = $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    }

    return {
      request: function(request) {
        var token =  $window.localStorage.getItem('ajToken');
        if (token && request.url.indexOf(config.apiUrl) != -1) {
          request.headers.Authorization = 'Bearer ' + token;
        }
        return request;
      },

      'responseError': function(rejection) {
        if (rejection.status === 401 && rejection.config.url.indexOf('login_check') === -1
            && rejection.config.url.indexOf('token/refresh') === -1) {
          var deferred = $q.defer();

          $injector.get('AuthService').refreshToken().then(function () {
            retryHttpRequest(rejection.config, deferred)
          }, function () {
            $rootScope.$broadcast('logout');
            $injector.get('AuthService').logOut();
            deferred.reject(rejection);
          });

          return deferred.promise;
        }

        return $q.reject(rejection);
      }
    };
  }
})();

