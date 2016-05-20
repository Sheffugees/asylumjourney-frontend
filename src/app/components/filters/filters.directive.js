(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('filters', filters);

  function filters() {
    var filters = {
      templateUrl: 'app/components/filters/filters.html',
      restrict: 'AE'
    };
    return filters;
  }
})();
