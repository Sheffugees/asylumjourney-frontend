/**
 * API Interceptor - handles adding auth token to requests and refreshing it.
 */
import { apiUrl } from '../../constants';

class APIInterceptor {
  /** @ngInject */
  constructor ($injector, $q, $rootScope, $window) {
    this.$injector = $injector;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$window = $window;

    return {
      request: this.request.bind(this),
      responseError: this.responseError.bind(this)
    }
  }

  /**
   * Add the auth token to request headers
   * @param {object} request 
   */
  request (request) {
    const token = this.$window.localStorage.getItem('ajToken');
    // to do get url from config
    if (token && request.url.indexOf(apiUrl) != -1) {
      request.headers.Authorization = 'Bearer ' + token;
    }
    return request;
  }

  /**
   * Refresh token if get response error, except when login fails.
   * Log out if refresh fails.
   * @param {object} rejection 
   */
  responseError (rejection) {
    if (rejection.status === 401 && rejection.config.url.indexOf('login_check') === -1
        && rejection.config.url.indexOf('token/refresh') === -1) {
      const deferred = this.$q.defer();

      this.$injector.get('AuthService').refreshToken().then( () => {
        retryHttpRequest.bind(this)(rejection.config, deferred);
      }, () => {
        this.$rootScope.$broadcast('logout');
        this.$injector.get('AuthService').logOut();
        deferred.reject(rejection);
      });

      return deferred.promise;
    }

    return this.$q.reject(rejection);
  }
}

function retryHttpRequest(config, deferred) {
  function successCallback(response){
    deferred.resolve(response);
  }
  function errorCallback(response){
    deferred.reject(response);
  }
  const $http = this.$injector.get('$http');
  $http(config).then(successCallback, errorCallback);
}

export default APIInterceptor;
