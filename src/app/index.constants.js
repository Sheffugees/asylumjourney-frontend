/* global moment:false */
(function() {
  'use strict';

  var staging = 'https://asylum-journey-staging.herokuapp.com/';
  var production = 'https://asylum-journey-dev.herokuapp.com/';

  angular
    .module('asylumjourneyFrontend')
    .constant('moment', moment)
    .constant('config', {
      apiUrl: staging
    });

})();
