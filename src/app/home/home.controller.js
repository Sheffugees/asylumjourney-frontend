(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(data, $location) {
    var vm = this;
    vm.showCategories = false;
    vm.showLoader = true;

    var filter = {}

    vm.doSearch = function () {
      $location.path('/tool').search({q: vm.searchText})
    }

    vm.selectStage = function (selectedStage) {
      filter.stage = selectedStage;
      vm.showCategories = true;

      angular.forEach(vm.stages, function (stage) {
        if (stage.id === selectedStage.id) {
          stage.selected = true;
          return;
        }
        stage.selected = false;
      });
    }

    vm.go = function (category) {
      filter.category = category;
      $location.path('/tool').search({stages: filter.stage.id.toString(), categories: filter.category.id.toString()});
    }

    function getStages() {
      data.stages().get().$promise.then(function(response) {
        vm.stages = response._embedded.stages;
        vm.showLoader = false;
      });
    }

    function getCategories() {
      data.categories().get().$promise.then(function(response) {
        vm.categories = response._embedded.categories;
      });
    }

    getStages();
    getCategories();

  }
})();
