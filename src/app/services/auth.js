import { apiUrl } from '../../constants';

export default class AuthService {
  /** @ngInject */
  constructor($http, $httpParamSerializer, $location, $log, $q, $window) { // eslint-disable-line
    this.$http = $http;
    this.$httpParamSerializer = $httpParamSerializer;
    this.$location = $location;
    this.$log = $log;
    this.$q = $q;
    this.$window = $window;
    this.isAuthenticated = false;
  }

  checkAuthentication() {
    const deferred = this.$q.defer();
    const token = this.$window.localStorage.getItem('ajToken');
    if (!token) {
      this.isAuthenticated = false;
      deferred.resolve();
      return deferred.promise;
    }

    if (tokenExpired.bind(this)(token)) {
      return this.refreshToken().then(() => {
        deferred.resolve();
        return deferred.promise;
      }, () => {
        this.logOut();
        deferred.resolve();
        return deferred.promise;
      });
    }

    this.isAuthenticated = true;
    deferred.resolve();
    return deferred.promise;
  }

  logIn(username, password) {
    const formDataObj = {
      username,
      password
    };

    const req = {
      method: 'POST',
      url: apiUrl + 'api/login_check',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: this.$httpParamSerializer(formDataObj)
    };

    return this.$http(req).then(response => {
      storeToken.bind(this)('ajToken', response.data.token);
      storeToken.bind(this)('ajRefreshToken', response.data.refresh_token);
      return;
    }, error => {
      this.$log.error('Error: ', error);
      throw error;
    });
  }

  logOut() {
    delete this.$window.localStorage.ajToken;
    delete this.$window.localStorage.ajRefreshToken;
    this.isAuthenticated = false;
    this.$location.path('/');
  }

  refreshToken() {
    const deferred = this.$q.defer();
    const token = this.$window.localStorage.getItem('ajRefreshToken');
    if (!token) {
      deferred.reject();
      return deferred.promise;
    }
    const formDataObj = {};
    formDataObj['refresh_token'] = token; // eslint-disable-line
    const req = {
      method: 'POST',
      url: apiUrl + 'api/token/refresh',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: this.$httpParamSerializer(formDataObj)
    };

    return this.$http(req).then(response => {
      this.isAuthenticated = true;
      storeToken.bind(this)('ajToken', response.data.token);
      storeToken.bind(this)('ajRefreshToken', response.data.refresh_token);
      deferred.resolve();
      return deferred.promise;
    }, () => {
      deferred.reject();
      return deferred.promise;
    });
  }
}

function storeToken(name, token) {
  try {
    this.$window.localStorage.setItem(name, token);
    this.isAuthenticated = true;
  } catch (e) {
    this.$window.localStorage.clear();
    this.storeToken(token);
  }
}

function tokenExpired(token) {
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    return true;
  }
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const parsedToken = angular.fromJson(this.$window.atob(base64));
  const expiry = new Date(parsedToken.exp * 1000);
  const current = new Date();
  const hasExpired = expiry < current;
  return hasExpired;
}
