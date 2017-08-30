(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .config(config);

  /** @ngInject */
  function config($httpProvider, $logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $httpProvider.interceptors.push('APIInterceptor');
  }

})();
