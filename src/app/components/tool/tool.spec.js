import tool from './tool';
import {mockCategories, mockProviders, mockServices, mockStages} from '../../../../fixtures/data';

describe('tool component', () => {
  class MockAuthService {}
  class MockDataService {}
  MockDataService.prototype.getStages = function () {};
  MockDataService.prototype.getCategories = function () {};
  MockDataService.prototype.getServices = function () {};
  MockDataService.prototype.getProviders = function () {};
  MockDataService.prototype.dataStore = {
    categories: mockCategories,
    providers: mockProviders,
    services: mockServices,
    stages: mockStages
  };

  let component;
  let $location;
  let state;

  const mockNgDialog = {
    open() {},
    closeAll() {}
  };

  beforeEach(() => {
    angular
      .module('toolComponent', ['app/components/tool/tool.html'])
      .service('AuthService', MockAuthService)
      .service('DataService', MockDataService)
      .component('toolComponent', tool);
    angular.mock.module('toolComponent');
  });

  beforeEach(angular.mock.module($provide => {
    $provide.provider('$state', () => {
      return {
        $get: () => {
          return {
            params: {}
          };
        }
      };
    });
    $provide.value('categoryFilterFilter', {});
    $provide.value('providerFilterFilter', {});
    $provide.value('stageFilterFilter', {});
    $provide.value('ngDialog', mockNgDialog);
  }));

  function setupController(params, hideService, isAuthenticated) {
    if (hideService) {
      mockServices[2].hidden = true;
    }
    MockAuthService.prototype.isAuthenticated = isAuthenticated;
    angular.mock.inject(($compile, $componentController, _$location_, $q, $rootScope, $state) => {
      state = $state;
      state.params = params || {};
      $location = _$location_;
      spyOn(MockDataService.prototype, 'getStages').and.returnValue($q.when());
      spyOn(MockDataService.prototype, 'getCategories').and.returnValue($q.when());
      spyOn(MockDataService.prototype, 'getProviders').and.returnValue($q.when());
      spyOn(MockDataService.prototype, 'getServices').and.returnValue($q.when());
      spyOn($location, 'path').and.callThrough();
      spyOn($location, 'search').and.callThrough();
      spyOn(mockNgDialog, 'open').and.callThrough();
      component = $componentController('toolComponent');
      // component.ngDialog = mockNgDialog;
      $rootScope.$digest();
    });
  }

  describe('On init', () => {
    beforeEach(() => {
      setupController();
    });

    it('should be defined', () => {
      expect(component).toBeDefined();
    });

    it('should load the stages and set display to true on each', () => {
      expect(MockDataService.prototype.getStages).toHaveBeenCalled();
      const updatedStages = angular.fromJson(angular.toJson(mockStages));
      for (let i = 0; i < updatedStages.length; i++) {
        updatedStages[i].display = true;
      }
      expect(component.stages).toEqual(updatedStages);
    });

    it('should load the categories and set display to true on each', () => {
      expect(MockDataService.prototype.getCategories).toHaveBeenCalled();
      const updatedCategories = angular.fromJson(angular.toJson(mockCategories));
      for (let i = 0; i < updatedCategories.length; i++) {
        updatedCategories[i].display = true;
      }
      expect(component.categories).toEqual(updatedCategories);
    });

    it('should load the services, set display to true on each and order ny name', () => {
      expect(MockDataService.prototype.getServices).toHaveBeenCalled();
      const orderedServices = [mockServices[1], mockServices[2], mockServices[0]];
      const updatedServices = angular.fromJson(angular.toJson(orderedServices));
      for (let i = 0; i < updatedServices.length; i++) {
        updatedServices[i].display = true;
      }
      expect(component.services).toEqual(updatedServices);
    });

    it('should load the providers and set display to true on each', () => {
      expect(MockDataService.prototype.getProviders).toHaveBeenCalled();
      const updatedProviders = angular.fromJson(angular.toJson(mockProviders));
      for (let i = 0; i < updatedProviders.length; i++) {
        updatedProviders[i].display = true;
      }
      expect(component.providers).toEqual(updatedProviders);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      setupController();
    });
    afterEach(() => {
      component.showAll();
    });

    describe('Filtering by stage', () => {
      describe('Adding a filter', () => {
        it('should set the display and filtered flags on the stage to true', () => {
          component.filterServices(2, 'stages');
          expect(component.stages[1].display).toBe(true);
          expect(component.stages[1].filtered).toBe(true);
        });

        it('should add the stage to the current filters', () => {
          component.filterServices(2, 'stages');
          expect(component.currentFilters.stages).toEqual([{id: 2, name: 'stage 2'}]);
        });

        it('should add the stage to the query string', () => {
          component.filterServices(2, 'stages');
          expect($location.search()).toEqual({stages: 2});
        });

        it('should filter by multiple stages', () => {
          component.filterServices(2, 'stages');
          expect($location.search()).toEqual({stages: 2});
          component.filterServices(3, 'stages');
          expect(component.currentFilters.stages).toEqual([{id: 2, name: 'stage 2'}, {id: 3, name: 'stage 3'}]);
          expect($location.search()).toEqual({stages: '2,3'});
        });
      });

      describe('Removing a filter', () => {
        it('should set the display and filtered flags on the stage to false', () => {
          component.filterServices(2, 'stages');
          component.filterServices(3, 'stages');
          component.filterServices(2, 'stages');
          expect(component.stages[1].display).toBe(false);
          expect(component.stages[1].filtered).toBe(false);
        });

        it('should set the display to true on all stages and filtered to false if removing the last filter of type', () => {
          component.filterServices(2, 'stages');
          component.filterServices(2, 'stages');
          expect(component.stages[0].display).toBe(true);
          expect(component.stages[1].display).toBe(true);
          expect(component.stages[2].display).toBe(true);
          expect(component.stages[1].filtered).toBe(false);
        });

        it('should remove the stage from the current filters', () => {
          component.filterServices(2, 'stages');
          component.filterServices(2, 'stages');
          expect(component.currentFilters.stages).toEqual([]);
        });

        it('should remove the stage from the query string', () => {
          component.filterServices(2, 'stages');
          component.filterServices(2, 'stages');
          expect($location.search()).toEqual({stages: ''});
        });
      });

      it('should update the css class for number of stages displayed', () => {
        component.filterServices(2, 'stages');
        expect(component.numStagesDisplayed).toBe(1);
        component.filterServices(3, 'stages');
        expect(component.numStagesDisplayed).toBe(2);
      });
    });

    describe('Filtering by category', () => {
      describe('Adding a filter', () => {
        it('should set the display and filtered flags on the category to true', () => {
          component.filterServices(2, 'categories');
          expect(component.categories[1].display).toBe(true);
          expect(component.categories[1].filtered).toBe(true);
        });

        it('should add the category to the current filters', () => {
          component.filterServices(2, 'categories');
          expect(component.currentFilters.categories).toEqual([{id: 2, name: 'category 2'}]);
        });

        it('should add the category to the query string', () => {
          component.filterServices(2, 'categories');
          expect($location.search()).toEqual({categories: 2});
        });

        it('should filter by multiple categories', () => {
          component.filterServices(2, 'categories');
          expect($location.search()).toEqual({categories: 2});
          component.filterServices(3, 'categories');
          expect(component.currentFilters.categories).toEqual([{id: 2, name: 'category 2'}, {id: 3, name: 'category 3'}]);
          expect($location.search()).toEqual({categories: '2,3'});
        });
      });

      describe('Removing a filter', () => {
        it('should set the display and filtered flags on the category to false', () => {
          component.filterServices(2, 'categories');
          component.filterServices(3, 'categories');
          component.filterServices(2, 'categories');
          expect(component.categories[1].display).toBe(false);
          expect(component.categories[1].filtered).toBe(false);
        });

        it('should set the display to true on all categories and filtered to false if removing the last filter of type', () => {
          component.filterServices(2, 'categories');
          component.filterServices(2, 'categories');
          expect(component.categories[0].display).toBe(true);
          expect(component.categories[1].display).toBe(true);
          expect(component.categories[2].display).toBe(true);
          expect(component.categories[1].filtered).toBe(false);
        });

        it('should remove the category from the current filters', () => {
          component.filterServices(2, 'categories');
          component.filterServices(2, 'categories');
          expect(component.currentFilters.categories).toEqual([]);
        });

        it('should remove the category from the query string', () => {
          component.filterServices(2, 'categories');
          component.filterServices(2, 'categories');
          expect($location.search()).toEqual({categories: ''});
        });
      });
    });

    describe('Filtering by provider', () => {
      describe('Adding a filter', () => {
        it('should set the display and filtered flags on the provider to true', () => {
          component.filterServices(2, 'providers');
          expect(component.providers[1].display).toBe(true);
          expect(component.providers[1].filtered).toBe(true);
        });

        it('should add the provider to the current filters', () => {
          component.filterServices(2, 'providers');
          expect(component.currentFilters.providers).toEqual([{id: 2, name: 'provider 2'}]);
          expect(component.filteredProviders).toEqual([2]);
        });

        it('should add the provider to the query string', () => {
          component.filterServices(2, 'providers');
          expect($location.search()).toEqual({providers: 2});
        });

        it('should filter by multiple providers', () => {
          component.filterServices(2, 'providers');
          expect($location.search()).toEqual({providers: 2});
          component.filterServices(3, 'providers');
          expect(component.currentFilters.providers).toEqual([{id: 2, name: 'provider 2'}, {id: 3, name: 'provider 3'}]);
          expect($location.search()).toEqual({providers: '2,3'});
        });
      });

      describe('Removing a filter', () => {
        it('should set the display and filtered flags on the provider to false', () => {
          component.filterServices(2, 'providers');
          component.filterServices(3, 'providers');
          component.filterServices(2, 'providers');
          expect(component.providers[1].display).toBe(false);
          expect(component.providers[1].filtered).toBe(false);
        });

        it('should set the display to true on all providers and filtered to false if removing the last filter of type', () => {
          component.filterServices(2, 'providers');
          component.filterServices(2, 'providers');
          expect(component.providers[0].display).toBe(true);
          expect(component.providers[1].display).toBe(true);
          expect(component.providers[2].display).toBe(true);
          expect(component.providers[1].filtered).toBe(false);
        });

        it('should remove the provider from the current filters', () => {
          component.filterServices(2, 'providers');
          component.filterServices(2, 'providers');
          expect(component.currentFilters.providers).toEqual([]);
          expect(component.filteredProviders).toEqual([]);
        });

        it('should remove the provider from the query string', () => {
          component.filterServices(2, 'providers');
          component.filterServices(2, 'providers');
          expect($location.search()).toEqual({providers: ''});
        });
      });
    });

    describe('Reset all filters', () => {
      beforeEach(() => {
        component.filterServices(1, 'stages');
        component.filterServices(3, 'providers');
        component.showAll();
      });

      it('should close all filters', () => {
        expect(component.expandFilters).toEqual({stages: false, categories: false, providers: false});
      });

      it('should reset each type of filter', () => {
        expect(component.numStagesDisplayed).toEqual(mockStages.length);
        expect(component.filteredProviders).toEqual([]);
        expect(component.currentFilters.stages).toEqual([]);
        expect(component.currentFilters.categories).toEqual([]);
        expect(component.currentFilters.providers).toEqual([]);
      });

      it('should clear the query string', () => {
        expect($location.search()).toEqual({});
      });
    });

    describe('Reset a filter type', () => {
      it('should reset stage filters', () => {
        component.filterServices(2, 'stages');
        component.filterServices(3, 'stages');
        component.resetFilterType('stages');
        expect(component.currentFilters.stages).toEqual([]);
        expect(component.numStagesDisplayed).toEqual(mockStages.length);
        expect($location.search()).toEqual({stages: 'all'});
      });

      it('should reset category filters', () => {
        component.filterServices(2, 'categories');
        component.filterServices(3, 'categories');
        component.resetFilterType('categories');
        expect(component.currentFilters.categories).toEqual([]);
        expect($location.search()).toEqual({categories: 'all'});
      });

      it('should reset provider filters', () => {
        component.filterServices(2, 'providers');
        component.filterServices(3, 'providers');
        component.resetFilterType('providers');
        expect(component.currentFilters.providers).toEqual([]);
        expect($location.search()).toEqual({providers: 'all'});
      });
    });
  });

  describe('Filtered view', () => {
    beforeEach(() => {
      setupController({stages: '1', categories: '2'});
    });

    it('should update the filtered types', () => {
      expect(component.stages[0].display).toBe(true);
      expect(component.stages[0].filtered).toBe(true);

      expect(component.stages[1].display).toBe(false);
      expect(component.stages[1].filtered).toBe(false);
      expect(component.stages[2].display).toBe(false);
      expect(component.stages[2].filtered).toBe(false);

      expect(component.categories[1].display).toBe(true);
      expect(component.categories[1].filtered).toBe(true);
      expect(component.categories[0].display).toBe(false);
      expect(component.categories[0].filtered).toBe(false);
      expect(component.categories[2].display).toBe(false);
      expect(component.categories[2].filtered).toBe(false);

      expect(component.numStagesDisplayed).toBe(1);
    });

    it('should not update the un-filtered types', () => {
      expect(component.providers[0].display).toBe(true);
      expect(component.providers[1].display).toBe(true);
      expect(component.providers[2].display).toBe(true);
    });

    it('should update the currentFilters', () => {
      expect(component.currentFilters).toEqual({stages: [{id: 1, name: 'stage 1'}], categories: [{id: 2, name: 'category 2'}], providers: []});
    });
  });

  describe('Searching for services', () => {
    describe('Using the search form', () => {
      it('should find and show services that have the search term in the name', () => {
        component.searchText = 'this one';
        component.doSearch();
        expect(component.services[2].display).toBe(true);
        expect(component.services[2].filtered).toBe(true);

        expect(component.services[0].display).toBe(false);
        expect(component.services[0].filtered).toBe(false);
        expect(component.services[1].display).toBe(false);
        expect(component.services[1].filtered).toBe(false);
      });

      it('should find and show services that have the search term in the description', () => {
        component.searchText = 'find me';
        component.doSearch();

        expect(component.services[0].display).toBe(true);
        expect(component.services[0].filtered).toBe(true);

        expect(component.services[1].display).toBe(false);
        expect(component.services[1].filtered).toBe(false);
        expect(component.services[2].display).toBe(false);
        expect(component.services[2].filtered).toBe(false);
      });

      it('should find and show services that have the search term in the events', () => {
        component.searchText = 'here I am';
        component.doSearch();

        expect(component.services[1].display).toBe(true);
        expect(component.services[1].filtered).toBe(true);

        expect(component.services[0].display).toBe(false);
        expect(component.services[0].filtered).toBe(false);
        expect(component.services[2].display).toBe(false);
        expect(component.services[2].filtered).toBe(false);
      });

      it('should update the querystring with the search term', () => {
        component.searchText = 'find me';
        component.doSearch();
        expect($location.search()).toEqual({q: 'find me'});
      });
    });

    describe('From the query string', () => {
      beforeEach(() => {
        setupController({q: 'find me'});
      });

      it('should find and show services that match the search term in the querystrong', () => {
        expect(component.services[0].display).toBe(true);
        expect(component.services[0].filtered).toBe(true);
        expect(component.services[1].display).toBe(false);
        expect(component.services[1].filtered).toBe(false);
        expect(component.services[2].display).toBe(false);
        expect(component.services[2].filtered).toBe(false);
      });
    });
  });

  describe('Viewing a service directly', () => {
    beforeEach(() => {
      setupController({serviceId: 1});
    });

    it('should open the service modal and pass it the service id', () => {
      const dialogParams = {
        plain: true,
        template: jasmine.any(String),
        data: '{"id":1}',
        className: 'ngdialog-theme-default service-modal'
      };
      expect(mockNgDialog.open).toHaveBeenCalledWith(dialogParams);
    });
  });

  describe('Hidden services', () => {
    describe('as a standard user', () => {
      beforeEach(() => {
        setupController({}, true, false);
      });

      it('should set display to false on hidden services', () => {
        expect(MockDataService.prototype.getServices).toHaveBeenCalled();

        const orderedServices = [mockServices[1], mockServices[2], mockServices[0]];
        const updatedServices = angular.fromJson(angular.toJson(orderedServices));
        updatedServices[0].display = true;
        updatedServices[1].display = false;
        updatedServices[2].display = true;
        expect(component.services).toEqual(updatedServices);
      });

      it('should set display to false on hidden services when match search term', () => {
        component.searchText = 'here I am';
        component.doSearch();

        expect(component.services[1].display).toBe(false);
        expect(component.services[0].display).toBe(false);
        expect(component.services[2].display).toBe(false);
      });

      it('should set display to false on hidden services when reset search', () => {
        component.resetSearch();

        expect(component.services[1].display).toBe(false);
        expect(component.services[0].display).toBe(true);
        expect(component.services[2].display).toBe(true);
      });
    });

    describe('as a admin user', () => {
      beforeEach(() => {
        setupController({}, true, true);
      });

      it('should not set display to false on hidden services', () => {
        expect(MockDataService.prototype.getServices).toHaveBeenCalled();

        const orderedServices = [mockServices[1], mockServices[2], mockServices[0]];
        const updatedServices = angular.fromJson(angular.toJson(orderedServices));
        updatedServices[0].display = true;
        updatedServices[1].display = true;
        updatedServices[2].display = true;
        expect(component.services).toEqual(updatedServices);
      });

      it('should not set display to false on hidden services when match search term', () => {
        component.searchText = 'here I am';
        component.doSearch();

        expect(component.services[1].display).toBe(true);
        expect(component.services[0].display).toBe(false);
        expect(component.services[2].display).toBe(false);
      });

      it('should not  display to false on hidden services when reset search', () => {
        component.resetSearch();

        expect(component.services[1].display).toBe(true);
        expect(component.services[0].display).toBe(true);
        expect(component.services[2].display).toBe(true);
      });
    });
  });
});
