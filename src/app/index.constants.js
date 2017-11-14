/* global moment:false */
(function() {
  'use strict';

  var stagingUrl = 'https://asylum-journey-staging.herokuapp.com/';
  var productionUrl = 'https://asylum-journey-dev.herokuapp.com/';
  var apiUrl = window.location && window.location.hostname === 'asylumjourney.org.uk' ? productionUrl : stagingUrl;

  angular
    .module('asylumjourneyFrontend')
    .constant('moment', moment)
    .constant('config', {
      apiUrl: apiUrl
    });

})();
