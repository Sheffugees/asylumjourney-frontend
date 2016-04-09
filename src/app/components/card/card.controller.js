(function() {
  'use strict';

  angular
  .module('asylumjourneyFrontend')
  .controller('CardController', CardController);

    function CardController($scope, ngDialog) {
        var vm = this;
        vm.service = $scope.service;

        vm.openDialog = function () {
            ngDialog.open({
                template: 'app/components/detail-overlay/detail.html',
                scope: $scope
            });
        }
    }

})();
