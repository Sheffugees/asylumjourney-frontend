(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .directive('serviceCard', serviceCard);

  function serviceCard() {
    var serviceCard = {
      templateUrl: 'app/components/service/service-card.html',
      restrict: 'AE',
      scope: true
    };
    return serviceCard;
  }
})();
