import angular from 'angular';
import 'angular-ui-router';
import ngSanitize from 'angular-sanitize';
import ngDialog from 'ng-dialog';
import textAngular from 'textAngular';
import 'angularjs-datepicker';
import APIInterceptor from './app/services/apiInterceptor';
import {AuthService} from './app/services/auth';
import {DataService} from './app/services/data';
import categoryFilter from './app/filters/category';
import providerFilter from './app/filters/provider';
import stageFilter from './app/filters/stage';
import stripHTML from './app/filters/stripHTML';
import adminBar from './app/components/adminBar/adminBar';
import authButton from './app/components/auth/authButton';
import AuthController from './app/components/auth/auth';
import filterBar from './app/components/filterBar/filterBar';
import {providerEdit} from './app/components/providers/providerEdit';
import {providers} from './app/components/providers/providers';
import serviceCard from './app/components/service/serviceCard';
import ServiceController from './app/components/service/service';
import {start} from './app/components/start/start';
import {tool} from './app/components/tool/tool';
import routesConfig from './routes';
import runBlock from './runBlock';
import './index.scss';

angular
  .module('asylumJourney', ['ui.router', '720kb.datepicker', ngDialog, ngSanitize, textAngular])
  .config(routesConfig)
  .config(($httpProvider) =>
    $httpProvider.interceptors.push('APIInterceptor')
  )
  .config(($provide) => 
    /**
     * Use angular-sanitize instead of textAngular's own version
     * https://github.com/textAngular/textAngular/issues/842
     */
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
      taOptions.forceTextAngularSanitize = false;
      return taOptions;
    }])
  )
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
  .component('providers', providers)
  .component('providerEdit', providerEdit)
  .component('start', start)
  .component('tool', tool);
  