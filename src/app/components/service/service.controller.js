(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ServiceController', ServiceController);

  /** @ngInject */
  function ServiceController($location, $rootScope, $scope, $timeout, AuthService, data, ngDialog) {
    var vm = this;
    vm.id = $scope.ngDialogData.id;
    vm.authService = AuthService;
    vm.cancelDelete = cancelDelete;
    vm.confirmDelete = confirmDelete;
    vm.deleteService = deleteService;
    vm.showDeleteConfirmation = false;
    vm.path = $location.protocol() + '://' + $location.host();
    if ($location.port()) {
      vm.path += ':' + $location.port();
    }

    data.getService(vm.id).then(function (response) {
      vm.details = response;
      formatMapLinks(vm.details._embedded.providers);
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

    function formatMapLinks (providers) {
      angular.forEach(providers, function(provider) {
        var googleMapsUrl = 'https://www.google.co.uk/maps/place/';
        provider.addressUrl = googleMapsUrl + [provider.address, provider.postcode]
        .join(' ')
        .replace(/\s/g, '+');
      });
      return providers;
    }

  }
})();
