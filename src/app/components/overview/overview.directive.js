(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('overview', overview);

  function overview() {
    var overview = {
      templateUrl: 'app/components/overview/overview.html',
      restrict: 'AE'
    };
    return overview;
  }
})();
