import '../service/service.scss';
const Autolinker = require('autolinker');

class ProviderController {
  /** @ngInject */
  constructor(AuthService, DataService, ngDialog, $location, $rootScope, $scope, $timeout, $window) {
    this.AuthService = AuthService;
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.id = $scope.ngDialogData.id;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$window = $window;
    this.showDeleteConfirmation = false;
    this.formatDescription = false;
    this.formatEvents = false;
    this.path = $location.protocol() + '://' + $location.host();
    this.errors = {
      show: false,
      message: ''
    };
    this.getProvider();
  }

  getProvider() {
    this.DataService.getProvider(this.id).then(response => {
      this.details = response;
      
      // Check if fields are formatted HTML, if not use var to add class to format whitespace
      if (this.details.description && this.details.description.substr(0, 3) !== '<p>') {
        this.formatDescription = true;
      }
   
      // Auto link unlinked urls
      this.details.description = Autolinker.link(this.details.description, '_blank');
    }, error => {
      this.errors.show = true;
      this.errors.message = error.data.message ? error.data.message : 'There was a problem loading this provider';
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  confirmDelete() {
    this.showDeleteConfirmation = true;
  }

  deleteProvider() {
    this.DataService.deleteProvider(this.id).then(() => {
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

export default ProviderController;
