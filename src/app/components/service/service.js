import './service.scss';
const Autolinker = require('autolinker');

class ServiceController {
  /** @ngInject */
  constructor(AuthService, DataService, ngDialog, $location, $log, $rootScope, $scope, $timeout, $window) {
    this.AuthService = AuthService;
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.id = $scope.ngDialogData.id;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$window = $window;
    this.$log = $log;
    $log.log('id', this.id);
    this.showDeleteConfirmation = false;
    this.formatDescription = false;
    this.formatEvents = false;
    this.path = $location.protocol() + '://' + $location.host();
    this.errors = {
      show: false,
      message: ''
    };
    this.getService();
  }

  getService() {
    this.DataService.getService(this.id).then(response => {
      this.details = response;
      this.$log.log('details', this.details);
      if (this.details._embedded.providers) {
        formatMapLinks.bind(this)(this.details._embedded.providers);
      }
      if (this.details.resources.length) {
        formatResources.bind(this)(this.details);
      }

      // Check if fields are formatted HTML, if not use var to add class to format whitespace
      if (this.details.description && this.details.description.substr(0, 3) !== '<p>') {
        this.formatDescription = true;
      }
      if (this.details.events && this.details.events.substr(0, 3) !== '<p>') {
        this.formatEvents = true;
      }
      // Auto link unlinked urls
      this.details.description = Autolinker.link(this.details.description, '_blank');
      this.details.events = Autolinker.link(this.details.events, '_blank');

      if (this.details._embedded.providers) {
        formatProviders.bind(this)(this.details);
      }
    }, error => {
      this.errors.show = true;
      this.errors.message = error.data.message ? error.data.message : 'There was a problem loading this service';
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  confirmDelete() {
    this.showDeleteConfirmation = true;
  }

  deleteService() {
    this.DataService.deleteService(this.id).then(() => {
      this.deleted = true;
      this.$rootScope.$broadcast('updateServices');
      this.$timeout( () => {
        this.ngDialog.close();
      }, 1000);
    });
  }

  print() {
    this.$window.print();
  }
}

function formatProviders(details) {
  angular.forEach(details._embedded.providers, provider => {
    // Check if fields are formatted HTML, if not use var to add class to format whitespace
    if (provider.description && provider.description.substr(0, 3) !== '<p>') {
      provider.formatDescription = true;
    }
    // Auto link unlinked urls
    provider.description = Autolinker.link(provider.description, '_blank');
  });
}

function formatResources(details) {
  let numExpired = 0;
  angular.forEach(details.resources, resource => {
    if (!resource.expiryDate) {
      return;
    }
    const now = new Date();
    const expiry = new Date(resource.expiryDate);
    if (expiry < now) {
      resource.expired = true;
      numExpired += 1;
    }
  });
  if (numExpired === details.resources.length) {
    details.hideResources = true;
  }
}

function formatMapLinks(providers) {
  angular.forEach(providers, provider => {
    const googleMapsUrl = 'https://www.google.co.uk/maps/place/';
    provider.addressUrl = googleMapsUrl + [provider.address, provider.postcode]
    .join(' ')
    .replace(/\s/g, '+');
  });
  return providers;
}

export default ServiceController;
