(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
