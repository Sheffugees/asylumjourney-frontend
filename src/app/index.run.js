(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
