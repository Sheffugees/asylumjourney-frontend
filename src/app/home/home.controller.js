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
      data.getStages().then(function () {
        vm.stages = data.stages;
        vm.showLoader = false;
      });
    }

    function getCategories() {
      data.getCategories().then(function () {
        vm.categories  = data.categories;
      });
    }

    getStages();
    getCategories();

  }
})();
