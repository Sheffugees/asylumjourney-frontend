(function () {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .filter('provider', provider);

  function isInArray (array, id) {
    return array.some(function (e) { return e.id === id;});
  }

  function provider() {

    return function providerFilter(items, provider) {
      if (!provider.length) {return items;}

      var filtered = [];

      angular.forEach(items, function(item) {

        angular.forEach(item._embedded.providers, function(itemProvider) {

          angular.forEach(provider, function (id) {

            if (itemProvider.id === id) {

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
