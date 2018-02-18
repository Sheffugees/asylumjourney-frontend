(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ServiceEditController', ServiceEditController);

  /** @ngInject */
  function ServiceEditController($filter, $location, $rootScope, $routeParams, $scope, $timeout, data, ngDialog) {
    var vm = this;
    vm.service = {};
    vm.service._embedded = {};
    vm.service.resources = [];
    vm.save = save;
    vm.saving = false;
    vm.saved = false;
    vm.errorMessage = '';
    vm.categories = [];
    vm.providers = [];
    vm.stages = [];
    vm.categoriesInfo = categoriesInfo;
    vm.stagesInfo = stagesInfo;
    vm.addResource = addResource;
    vm.removeResource = removeResource;

    var id = parseInt($routeParams.id, 10);
    vm.isNew = id ? false : true;

    data.getCategories().then(function () {
      vm.categories = data.categories;
    });
    data.getProviders().then(function () {
      vm.providers = data.providers;
    });
    data.getStages().then(function () {
      vm.stages = data.stages;
    });

    if (!vm.isNew) {
      data.getService(id).then(function (service) {
        vm.service = angular.copy(service);

        if (vm.service.resources.length) {
          formatDates(vm.service);
        }
      });
    }

    // Configure tinymce editor
    $scope.tinymceOptions = {
      inline: false,
      plugins : 'link',
      skin: 'lightgray',
      theme : 'modern',
      menu: {},
      min_height: 300,
      statusbar: false,
      toolbar: 'bold italic | link'
    };

    function formatDate (date) {
      if (date) {
        return $filter('date')(date, 'dd MMM yyyy')
      }
    }

    function formatDates (service) {
      if (service.resources.length) {
        angular.forEach(service.resources, function (resource) {
          resource.expiryDate = formatDate(resource.expiryDate);
        });
      }

      var dateFields = ['endDate', 'lastReviewDate', 'nextReviewDate'];
      angular.forEach(dateFields, function (field) {
        service[field] = formatDate(service[field]);
      });
      return service;
    }

    function addResource () {
      vm.service.resources.push({name: '', url: '', expiryDate: '', comments: ''})
    }

    function removeResource (index) {
      vm.service.resources.splice(index, 1);
    }

    function categoriesInfo () {
      ngDialog.open({
        template: 'app/components/info-overlay/categories.html'
      });
    }

    function stagesInfo () {
      ngDialog.open({
        template: 'app/components/info-overlay/stages.html'
      });
    }

    function save () {
      vm.saving = true;

      if (!vm.service._embedded.categories || !vm.service._embedded.categories.length
        || !vm.service._embedded.stages || !vm.service._embedded.stages.length) {
        vm.saving = false;
        vm.errorMessage = 'Error: Name, Categories and Stages are all required.';
        return;
      }

      vm.service.categories = [];
      angular.forEach(vm.service._embedded.categories, function (cat) {
        vm.service.categories.push(cat.id);
      });

      vm.service.providers = [];
      angular.forEach(vm.service._embedded.providers, function (provider) {
        vm.service.providers.push(provider.id);
      });

      vm.service.stages = [];
      angular.forEach(vm.service._embedded.stages, function (stage) {
        vm.service.stages.push(stage.id);
      });

      angular.forEach(vm.service.resources, function (resource, i) {
        if (resource.name === '' || resource.url === '') {
          vm.service.resources.splice(i, 1)
        }
      });

      if (vm.isNew) {
        data.createService(vm.service).then(function (id) {
          vm.saving = false;
          vm.saved = true;
          vm.errorMessage = '';
          $timeout(function () {
            $location.path('/service/' + id);
          }, 500);
        }, function () {
          vm.errorMessage = 'Sorry there was a problem saving the service.'
          vm.saving = false;
        });
        return;
      }

      data.updateService(vm.service).then(function () {
        vm.saving = false;
        vm.saved = true;
        vm.errorMessage = '';
        $timeout(function () {
          $location.path('/service/' + vm.service.id);
        }, 500);
      }, function () {
        vm.errorMessage = 'Sorry there was a problem saving the service.'
        vm.saving = false;
      });
    }

  }

})();
