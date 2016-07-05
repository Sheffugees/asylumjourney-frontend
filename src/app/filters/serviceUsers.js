(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .filter('serviceUser', serviceUser);

  function isInArray (array, id) {
    return array.some(function (e) { return e.id === id;});
  }

  function serviceUser() {

    return function serviceUserFilter(items, serviceUser) {
      if (!serviceUser.length) {return items;}

      var filtered = [];

      angular.forEach(items, function(item) {

        angular.forEach(item._embedded.serviceUsers, function(itemServiceUser) {

          angular.forEach(serviceUser, function (id) {

            if (itemServiceUser.id === id) {

              if ( isInArray(filtered, item.id) ) {
                return;
              }
              filtered.push(item);
              return;
            }

          });     

        });
      });

      return filtered;
    };
  }
})();
