(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .service('AuthService', AuthService);

  /** @ngInject */
  function AuthService($http, $httpParamSerializer, $location, $log, $window, config) {

    function storeUser (token) {
      try {
        $window.localStorage.setItem('ajToken', token);
        auth.isAuthenticated = true;
      } catch (e) {
        $window.localStorage.clear();
        storeUser(token);
      }
    }

    function checkAuthentication () {
      var token = $window.localStorage.getItem('ajToken');
      if (!token) {
        auth.isAuthenticated =  false;
        return;
      }
      auth.isAuthenticated = true;
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
        storeUser(response.data.token);
        return;
      }, function (error) {
        $log.error('Error: ', error);
        throw error;
      });
    }

    function logOut () {
      delete $window.localStorage.ajToken;
      auth.isAuthenticated =  false;
      $location.path('/');
    }

    var auth = {
      checkAuthentication: checkAuthentication,
      isAuthenticated: false,
      logIn: logIn,
      logOut: logOut
    };

    return auth;
  }

})();
