(function() {
  'use strict';

  describe('Home controller', function () {

    var $location, mockCategories, mockData, scope, mockStages, vm;

    mockCategories = [
      {
        id: 1,
        name: 'category 1'
      },
      {
        id: 2,
        name: 'category 2'
      },
      {
        id: 3,
        name: 'category 3'
      }
    ];
    mockStages = [
      {
        id: 1,
        name: 'stage 1'
      },
      {
        id: 2,
        name: 'stage 2'
      },
      {
        id: 3,
        name: 'stage 3'
      }
    ];

    beforeEach(function() {

      mockData = {
        getStages: function () {},
        getCategories: function () {},
        categories: mockCategories,
        stages: mockStages
      }

      module('asylumjourneyFrontend', function($provide) {
        $provide.value('data', mockData);
      });

      inject(function($controller, $q, $rootScope, _$location_) {
        scope = $rootScope.$new();
        $location = _$location_;

        spyOn(mockData, 'getStages').and.returnValue($q.when());
        spyOn(mockData, 'getCategories').and.returnValue($q.when())
        spyOn($location, 'path').and.callThrough();
        spyOn($location, 'search').and.callThrough();

        vm = $controller('HomeController', {
          $scope: scope
        });
        scope.$apply();
      });

    });

    it('should load the stages', function() {
      expect(mockData.getStages).toHaveBeenCalled();
      expect(vm.stages).toEqual(mockStages);
    });

    it('should load the categories', function() {
      expect(mockData.getCategories).toHaveBeenCalled();
      expect(vm.categories).toEqual(mockCategories);
    });

    describe('Search', function () {

      it('should go to the tool with the search term in the querystring', function () {
        vm.searchText = 'findme';
        vm.doSearch();
        expect($location.path).toHaveBeenCalledWith('/tool');
        expect($location.search).toHaveBeenCalledWith({q: 'findme' });
      });

    });

    describe('Filtering by stage and category', function () {

      describe('Selecting a stage', function () {

        beforeEach(function () {
          vm.selectStage({id:2, name: 'stage 2'});
        });

        it('should show the categories', function () {
          expect(vm.showCategories).toBe(true);
        });

        it('should mark the stage as selected', function () {
          expect(vm.stages[1].selected).toBe(true);
        });

        describe('Selecting a different stage', function () {

          beforeEach(function () {
            vm.selectStage({id:1, name: 'stage 1'});
          });

          it('should mark the stage as selected', function () {
            expect(vm.stages[0].selected).toBe(true);
          });

          it('should mark the previously selected stage stage as not selected', function () {
            expect(vm.stages[1].selected).toBe(false);
          });

        });

      });

      describe('Selecting a category', function () {

        beforeEach(function () {
          vm.selectStage({id:2, name: 'stage 2'});
          vm.go({id:3, name: 'category 3'});
        });

        it('should go to the tool with the stage and category in the query string', function () {
          expect($location.path).toHaveBeenCalledWith('/tool');
          expect($location.search).toHaveBeenCalledWith({stages: '2', categories: '3'});
        });

      });

    });


  });
})();
