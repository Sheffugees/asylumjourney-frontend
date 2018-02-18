(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ServiceController', ServiceController);

  /** @ngInject */
  function ServiceController($filter, $location, $rootScope, $scope, $timeout, $window, AuthService, data, ngDialog) {
    var vm = this;
    vm.id = $scope.ngDialogData.id;
    vm.authService = AuthService;
    vm.cancelDelete = cancelDelete;
    vm.confirmDelete = confirmDelete;
    vm.deleteService = deleteService;
    vm.showDeleteConfirmation = false;
    vm.formatDescription = false;
    vm.formatEvents = false;
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
        formatResources(vm.details);
      }

      // Check if fields are formatted HTML, if not use var to add class to format whitespace
      if (vm.details.description && vm.details.description.substr(0,3) !== '<p>') {
        vm.formatDescription = true;
      }
      if (vm.details.events && vm.details.events.substr(0,3) !== '<p>') {
        vm.formatEvents = true;
      }
      // Auto link unlinked urls
      vm.details.description = Autolinker.link(vm.details.description, "_blank");
      vm.details.events = Autolinker.link(vm.details.events, "_blank");

      if (vm.details._embedded.providers) {
        formatProviders(vm.details);
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

    function formatProviders (details) {
      angular.forEach(details._embedded.providers, function (provider) {
        // Check if fields are formatted HTML, if not use var to add class to format whitespace
        if (provider.description && provider.description.substr(0,3) !== '<p>') {
          provider.formatDescription = true;
        }
        // Auto link unlinked urls
        provider.description = Autolinker.link(provider.description, "_blank");
      });
    }

    function formatResources (details) {
      var numExpired = 0;
      angular.forEach(details.resources, function(resource) {
        if (!resource.expiryDate) {
          return;
        }
        var now = new Date();
        var expiry = new Date(resource.expiryDate);
        if (expiry < now) {
          resource.expired = true;
          numExpired += 1;
        }
      });
      if (numExpired === details.resources.length) {
        details.hideResources = true;
      }
      // return details;
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
