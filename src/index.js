import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngSanitize from 'angular-sanitize';
import ngDialog from 'ng-dialog';
import textAngular from 'textangular';
import 'angularjs-datepicker';
import uiselect from 'ui-select';
import APIInterceptor from './app/services/apiInterceptor';
import AuthService from './app/services/auth';
import DataService from './app/services/data';
import categoryFilter from './app/filters/category';
import providerFilter from './app/filters/provider';
import stageFilter from './app/filters/stage';
import stripHTML from './app/filters/stripHTML';
import adminBar from './app/components/adminBar/adminBar';
import authButton from './app/components/auth/authButton';
import AuthController from './app/components/auth/auth';
import filterBar from './app/components/filterBar/filterBar';
import providerEdit from './app/components/providers/providerEdit';
import providers from './app/components/providers/providers';
import serviceEdit from './app/components/service/serviceEdit';
import serviceCard from './app/components/service/serviceCard';
import ServiceController from './app/components/service/service';
import SearchController from './app/components/search/search';
import start from './app/components/start/start';
import tool from './app/components/tool/tool';
import decorators from './decorators';
import interceptors from './interceptors';
import routesConfig from './routes';
import runBlock from './runBlock';
import './index.scss';

angular
  .module('asylumJourney', [uiRouter, '720kb.datepicker', ngDialog, ngSanitize, textAngular, uiselect])
  .config(routesConfig)
  .config(interceptors)
  .config(decorators)
  .run(runBlock)
  .service('APIInterceptor', APIInterceptor)
  .service('AuthService', AuthService)
  .service('DataService', DataService)
  .filter('categoryFilter', categoryFilter)
  .filter('providerFilter', providerFilter)
  .filter('stageFilter', stageFilter)
  .filter('stripHTML', stripHTML)
  .directive('adminBar', adminBar)
  .directive('authButton', authButton)
  .directive('filterBar', filterBar)
  .directive('serviceCard', serviceCard)
  .controller('AuthController', AuthController)
  .controller('ServiceController', ServiceController)
  .controller('SearchController', SearchController)
  .component('providers', providers)
  .component('providerEdit', providerEdit)
  .component('serviceEdit', serviceEdit)
  .component('start', start)
  .component('tool', tool);
