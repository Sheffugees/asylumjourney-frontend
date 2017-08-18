/* global moment:false */
(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .constant('moment', moment)
    .constant('config', {
      apiUrl: 'https://asylum-journey-staging.herokuapp.com/'
    });

})();

// var url = 'https://asylum-journey-dev.herokuapp.com/api';
