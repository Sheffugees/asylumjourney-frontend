(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($location) {
    var vm = this;

    vm.doSearch = function () {
      $location.path('/tool').search({q: vm.searchText})
    }
  }
})();
