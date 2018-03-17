import angular from 'angular';
import 'angular-ui-router';
import ngSanitize from 'angular-sanitize';
import ngDialog from 'ng-dialog';
import {AuthService} from './app/services/auth';
import {DataService} from './app/services/data';
import categoryFilter from './app/filters/category';
import providerFilter from './app/filters/provider';
import stageFilter from './app/filters/stage';
import stripHTML from './app/filters/stripHTML';
import filterBar from './app/components/filterBar/filterBar';
import serviceCard from './app/components/service/serviceCard';
import ServiceController from './app/components/service/service';
import {start} from './app/components/start/start';
import {tool} from './app/components/tool/tool';
import routesConfig from './routes';
import './index.scss';

angular
  .module('asylumJourney', ['ui.router', ngDialog, ngSanitize])
  .config(routesConfig)
  .service('AuthService', AuthService)
  .service('DataService', DataService)
  .filter('categoryFilter', categoryFilter)
  .filter('providerFilter', providerFilter)
  .filter('stageFilter', stageFilter)
  .filter('stripHTML', stripHTML)
  .directive('filterBar', filterBar)
  .directive('serviceCard', serviceCard)
  .controller('ServiceController', ServiceController)
  .component('start', start)
  .component('tool', tool);
