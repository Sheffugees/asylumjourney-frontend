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
      var params = {
        stages: filter.stage.id.toString(),
        categories: category ? category.id.toString() : 'all'
      };
      $location.path('/tool').search(params);
    }

    function getStages() {
      data.getStages().then(function () {
        vm.stages = angular.copy(data.stages);
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
