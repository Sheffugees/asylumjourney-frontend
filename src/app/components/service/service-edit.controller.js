(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ServiceEditController', ServiceEditController);

  /** @ngInject */
  function ServiceEditController($location, $rootScope, $routeParams, $scope, $timeout, data, ngDialog) {
    var vm = this;
    vm.service = {};
    vm.service._embedded = {};
    vm.save = save;
    vm.saving = false;
    vm.saved = false;
    vm.errorMessage = '';
    vm.categories = [];
    vm.issues = [];
    vm.providers = [];
    vm.serviceUsers = [];
    vm.stages = [];
    vm.categoriesInfo = categoriesInfo;
    vm.stagesInfo = stagesInfo;

    var id = parseInt($routeParams.id, 10);
    vm.isNew = id ? false : true;

    data.getCategories().then(function () {
      vm.categories = data.categories;
    });
    data.getIssues().then(function () {
      vm.issues = data.issues;
    });
    data.getProviders().then(function () {
      vm.providers = data.providers;
    });
    data.getServiceUsers().then(function () {
      vm.serviceUsers = data.serviceUsers;
    });
    data.getStages().then(function () {
      vm.stages = data.stages;
    });

    if (!vm.isNew) {
      data.getService(id).then(function (service) {
        vm.service = angular.copy(service);
      });
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
        || !vm.service._embedded.stages || !vm.service._embedded.stages.length
        || !vm.service._embedded.serviceUsers || !vm.service._embedded.serviceUsers.length) {
        vm.saving = false;
        vm.errorMessage = 'Error: Name, Categories, Service Users and Stages are all required.';
        return;
      }

      vm.service.categories = [];
      angular.forEach(vm.service._embedded.categories, function (cat) {
        vm.service.categories.push(cat.id);
      });

      vm.service.issues = [];
      angular.forEach(vm.service._embedded.issues, function (issue) {
        vm.service.issues.push(issue.id);
      });

      vm.service.providers = [];
      angular.forEach(vm.service._embedded.providers, function (provider) {
        vm.service.providers.push(provider.id);
      });

      vm.service.serviceUsers = [];
      angular.forEach(vm.service._embedded.serviceUsers, function (user) {
        vm.service.serviceUsers.push(user.id);
      });

      vm.service.stages = [];
      angular.forEach(vm.service._embedded.stages, function (stage) {
        vm.service.stages.push(stage.id);
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
