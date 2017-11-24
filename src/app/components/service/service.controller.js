(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ServiceController', ServiceController);

  /** @ngInject */
  function ServiceController($location, $rootScope, $scope, $timeout, $window, AuthService, data, ngDialog) {
    var vm = this;
    vm.id = $scope.ngDialogData.id;
    vm.authService = AuthService;
    vm.cancelDelete = cancelDelete;
    vm.confirmDelete = confirmDelete;
    vm.deleteService = deleteService;
    vm.showDeleteConfirmation = false;
    vm.print = print;
    vm.path = $location.protocol() + '://' + $location.host();
    vm.errors = {
      show: false,
      message: ''
    }

    data.getService(vm.id).then(function (response) {
      vm.details = response;
      formatMapLinks(vm.details._embedded.providers);
      if (vm.details.resources.length) {
        formatResources(vm.details.resources);
      }
    }, function (error) {
      vm.errors.show = true;
      vm.errors.message = error.data.message ? error.data.message : 'There was a problem loading this service';
    });

    function cancelDelete () {
      vm.showDeleteConfirmation = false;
    }

    function confirmDelete () {
      vm.showDeleteConfirmation = true;
    }

    function deleteService (id) {
      data.deleteService(id).then(function () {
        vm.deleted = true;
        $rootScope.$broadcast('updateServices');
        $timeout(function () {
          ngDialog.close();
        }, 1000);
      });
    }

    function formatResources (resources) {
      angular.forEach(resources, function(resource) {
        if (!resource.expiryDate) {
          return;
        }
        var now = new Date();
        var expiry = new Date(resource.expiryDate);
        console.log('expiry', expiry)
        if (expiry < now) {
          console.log('is expired', resource.name)
          resource.expired = true;
        }
      });
    }

    function formatMapLinks (providers) {
      angular.forEach(providers, function(provider) {
        var googleMapsUrl = 'https://www.google.co.uk/maps/place/';
        provider.addressUrl = googleMapsUrl + [provider.address, provider.postcode]
        .join(' ')
        .replace(/\s/g, '+');
      });
      return providers;
    }

    function print () {
      $window.print();
    }

  }
})();
