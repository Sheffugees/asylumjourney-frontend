import {start} from './start';
import {mockCategories, mockStages} from '../../../../fixtures/data';

describe('start component', () => {
  class MockAuthService {}
  class MockDataService {}
  MockDataService.prototype.getStages = function () {};
  MockDataService.prototype.getCategories = function () {};
  MockDataService.prototype.dataStore = {
    categories: mockCategories,
    providers: [],
    services: [],
    stages: mockStages
  };

  let component;
  let element;
  let $location;

  beforeEach(() => {
    angular
      .module('startComponent', ['app/components/start/start.html'])
      .service('AuthService', MockAuthService)
      .service('DataService', MockDataService)
      .component('startComponent', start);
    angular.mock.module('startComponent');
  });

  beforeEach(angular.mock.inject(($compile, $componentController, _$location_, $q, $rootScope) => {
    $location = _$location_;
    spyOn(MockDataService.prototype, 'getStages').and.returnValue($q.when());
    spyOn(MockDataService.prototype, 'getCategories').and.returnValue($q.when());
    spyOn($location, 'path').and.callThrough();
    spyOn($location, 'search').and.callThrough();
    component = $componentController('startComponent');
    element = $compile('<start-component></start-component>')($rootScope);
    $rootScope.$digest();
  }));

  it('should render the component', () => {
    expect(element).toBeDefined();
  });

  it('should load the categories', () => {
    expect(MockDataService.prototype.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  describe('Search', () => {
    it('should go to the tool with the search term in the querystring', () => {
      component.searchText = 'findme';
      component.doSearch();
      expect($location.path).toHaveBeenCalledWith('/tool');
      expect($location.search).toHaveBeenCalledWith({q: 'findme'});
    });
  });

  describe('Filtering by stage and category', () => {
    describe('Selecting a stage', () => {
      beforeEach(() => {
        component.selectStage({id: 2, name: 'stage 2'});
      });

      it('should show the categories', () => {
        expect(component.showCategories).toBe(true);
      });

      it('should mark the stage as selected', () => {
        expect(component.stages[1].selected).toBe(true);
      });

      describe('Selecting a different stage', () => {
        beforeEach(() => {
          component.selectStage({id: 1, name: 'stage 1'});
        });

        it('should mark the stage as selected', () => {
          expect(component.stages[0].selected).toBe(true);
        });

        it('should mark the previously selected stage stage as not selected', () => {
          expect(component.stages[1].selected).toBe(false);
        });
      });
    });

    describe('Selecting a category', () => {
      beforeEach(() => {
        component.selectStage({id: 2, name: 'stage 2'});
        component.go({id: 3, name: 'category 3'});
      });

      it('should go to the tool with the stage and category in the query string', () => {
        expect($location.path).toHaveBeenCalledWith('/tool');
        expect($location.search).toHaveBeenCalledWith({stages: '2', categories: '3'});
      });
    });
  });
});
