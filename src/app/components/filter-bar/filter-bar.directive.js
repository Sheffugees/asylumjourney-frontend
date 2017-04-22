(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('filterBar', filters);

  function filters() {
    var filters = {
      templateUrl: 'app/components/filter-bar/filter-bar.html',
      restrict: 'AE'
    };
    return filters;
  }
})();
