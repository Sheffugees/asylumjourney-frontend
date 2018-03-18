import './start.scss';
class startController {
  /** @ngInject */
  constructor($location, $log, $rootScope, AuthService, DataService) {
    this.$log = $log;
    this.$location = $location;
    this.DataService = DataService;
    this.showCategories = false;
    this.showLoader = true;
    this.authService = AuthService;
    this.stages = [];
    this.categories = [];
    this.filter = {};

    getStages.bind(this)();
    getCategories.bind(this)();

    const logOutEvent = $rootScope.$on('logout', () => {
      getStages.bind(this)();
      getCategories.bind(this)();
    });
    $rootScope.$on('$destroy', logOutEvent);
  }

  doSearch() {
    this.$location.path('/tool').search({q: this.searchText});
  }

  go(category) {
    const params = {
      stages: this.filter.stage.id.toString(),
      categories: category ? category.id.toString() : 'all'
    };
    this.$location.path('/tool').search(params);
  }

  selectStage(selectedStage) {
    this.filter.stage = selectedStage;
    this.showCategories = true;

    angular.forEach(this.stages, stage => {
      if (stage.id === selectedStage.id) {
        stage.selected = true;
        return;
      }
      stage.selected = false;
    });
  }

}

function getStages() {
  this.DataService.getStages().then(() => {
    this.stages = angular.copy(this.DataService.dataStore.stages);
    this.showLoader = false;
  });
}

function getCategories() {
  this.DataService.getCategories().then(() => {
    this.categories = this.DataService.dataStore.categories;
  });
}

const start = {
  template: require('./start.html'),
  controller: startController
};
export default start;
