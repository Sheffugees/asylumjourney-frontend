(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .service('AuthService', AuthService);

  /** @ngInject */
  function AuthService($http, $httpParamSerializer, $location, $log, $q, $window, config) {

    function storeToken (name, token) {
      try {
        $window.localStorage.setItem(name, token);
        auth.isAuthenticated = true;
      } catch (e) {
        $window.localStorage.clear();
        storeToken(token);
      }
    }

    function tokenExpired (token) {
      var base64Url = token.split('.')[1];
      if (!base64Url) {
        return true;
      }
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      var parsedToken = JSON.parse($window.atob(base64));
      var expiry = moment.unix(parsedToken.exp);
      var current = moment();
      var hasExpired = expiry.isBefore(current);
      return hasExpired;
    }

    function refreshToken () {
      var deferred = $q.defer();
      var token = $window.localStorage.getItem('ajRefreshToken');
      if (!token) {
        deferred.reject();
        return deferred.promise;
      }
      var formDataObj = { 'refresh_token': token};
      var req = {
        method: 'POST',
        url: config.apiUrl + 'api/token/refresh',
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: $httpParamSerializer(formDataObj)
      };

      return $http(req).then(function (response) {
        auth.isAuthenticated = true;
        storeToken('ajToken', response.data.token);
        storeToken('ajRefreshToken', response.data.refresh_token);
        deferred.resolve();
        return deferred.promise;
      }, function () {
        deferred.reject();
        return deferred.promise;
      });
    }


    function checkAuthentication () {
      var deferred = $q.defer();
      var token = $window.localStorage.getItem('ajToken');
      if (!token) {
        auth.isAuthenticated =  false;
        deferred.resolve();
        return deferred.promise;
      }

      if (tokenExpired(token)) {
        return refreshToken().then(function () {
          deferred.resolve();
          return deferred.promise;
        }, function () {
          logOut();
          deferred.resolve();
          return deferred.promise;
        });
      }

      auth.isAuthenticated = true;
      deferred.resolve();
      return deferred.promise;
    }

    function logIn (username, password) {
      var formDataObj = { 'username': username, 'password': password};

      var req = {
        method: 'POST',
        url: config.apiUrl + 'api/login_check',
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: $httpParamSerializer(formDataObj)
      };

      return $http(req).then(function (response) {
        storeToken('ajToken', response.data.token);
        storeToken('ajRefreshToken', response.data.refresh_token);
        return;
      }, function (error) {
        $log.error('Error: ', error);
        throw error;
      });
    }

    function logOut () {
      delete $window.localStorage.ajToken;
      delete $window.localStorage.ajRefreshToken;
      auth.isAuthenticated =  false;
      $location.path('/');
    }

    var auth = {
      checkAuthentication: checkAuthentication,
      isAuthenticated: false,
      logIn: logIn,
      logOut: logOut,
      refreshToken: refreshToken
    };

    return auth;
  }

})();
