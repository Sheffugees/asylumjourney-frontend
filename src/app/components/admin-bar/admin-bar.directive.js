(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('adminBar', adminBar);

  function adminBar() {
    var adminBar = {
      templateUrl: 'app/components/admin-bar/admin-bar.html',
      restrict: 'AE'
    };
    return adminBar;
  }
})();
