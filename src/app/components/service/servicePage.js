class ServicePageController {
  /** @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
    this.id = this.$stateParams.id;
    console.log('id', $stateParams) //eslint-disable-line
  }
}


const servicePage = {
  template: require('./servicePage.html'),
  controller: ServicePageController
};
export default servicePage;