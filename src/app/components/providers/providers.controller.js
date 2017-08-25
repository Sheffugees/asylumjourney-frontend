(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('ProvidersController', ProvidersController);

  /** @ngInject */
  function ProvidersController($scope, $timeout, data, ngDialog) {
    var vm = this;
    vm.providers = [];
    vm.showDeleteSuccess = false;
    vm.deleteProvider = deleteProvider;
    vm.cancelDelete = cancelDelete;
    vm.confirmDelete = confirmDelete;
    var idToDelete = 0;

    function cancelDelete () {
      idToDelete = 0;
      ngDialog.close();
    }

    function confirmDelete (id) {
      idToDelete = id;
      ngDialog.open({
        template: 'app/components/providers/confirm-modal.html',
        scope: $scope,
        className: 'ngdialog-theme-default confirm-modal'
      });
    }

    function deleteProvider () {
      data.deleteProvider(idToDelete).then(function () {
        vm.providers = angular.copy(data.providers);
        vm.showDeleteSuccess = true;
        $timeout(function () {
          ngDialog.close();
          vm.showDeleteSuccess = false;
        }, 1000);
      });
    }

    function getProviders () {
      data.getProviders().then(function () {
        vm.providers = angular.copy(data.providers);
      });
    }

    getProviders();

  }

})();
