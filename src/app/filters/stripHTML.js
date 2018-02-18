(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .filter('stripHTML', stripHTML);

  function stripHTML() {

    return function(text) {
      return  text ? String(text).replace(/(<([^>]+)>)/ig,"") : '';
    };
  }
})();
