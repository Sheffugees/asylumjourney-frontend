(function() {
  'use strict';

  angular
      .module('asylumjourneyFrontend')
      .service('services', services);

  /** @ngInject */
  function services() {
    var data = [
      {
        'name': 'Schools referral',
        'url': 'https://groups.google.com/forum/#!forum/sheffugees',
        'description': 'Description'
      }
    ];

    this.getServices = getServices;

    function getServices() {
      return data;
    }
  }

})();
