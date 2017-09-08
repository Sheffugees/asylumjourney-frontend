(function() {
  'use strict';

  describe('Tool controller', function () {

    var $location, mockCategories, mockData, mockNgDialog, mockProviders, mockServices, mockStages, scope, vm;

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
    mockProviders = [
      {
        id: 1,
        name: 'provider 1'
      },
      {
        id: 2,
        name: 'provider 2'
      },
      {
        id: 3,
        name: 'provider 3'
      }
    ];
    mockServices = [
      {
        id: 1,
        name: 'this one'
      },
      {
        id: 2,
        name: 'service 2',
        description: 'find me'
      },
      {
        id: 3,
        name: 'service 3',
        events: 'here I am'
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
        getServices: function () {},
        getCategories: function () {},
        getProviders: function () {},
        getStages: function () {},
        categories: mockCategories,
        providers: mockProviders,
        services: mockServices,
        stages: mockStages
      }

      mockNgDialog = {
        open: function () {},
        closeAll: function () {}
      }

      module('asylumjourneyFrontend', function($provide) {
        $provide.value('data', mockData);
        $provide.value('ngDialog', mockNgDialog);
      });

    });

    function setUpController (params) {
      inject(function($controller, $q, $rootScope, _$location_) {
        scope = $rootScope.$new();
        $location = _$location_;
        spyOn(mockData, 'getProviders').and.returnValue($q.when());
        spyOn(mockData, 'getServices').and.returnValue($q.when());
        spyOn(mockData, 'getStages').and.returnValue($q.when());
        spyOn(mockData, 'getCategories').and.returnValue($q.when())
        spyOn($location, 'path').and.callThrough();
        spyOn($location, 'search').and.callThrough();
        spyOn(mockNgDialog, 'open').and.callThrough();

        var ctrlParams = {
          $scope: scope
        };
        if (params) {
          ctrlParams.$routeParams = params;
        }

        vm = $controller('ToolController', ctrlParams);
        scope.$apply();
      });
    }

    describe('Default view', function () {

      beforeEach(function () {
        setUpController();
      });

      describe('On init', function () {

        it('should load the stages and set display to true on each', function() {
          expect(mockData.getStages).toHaveBeenCalled();
          var updatedStages = angular.fromJson(angular.toJson(mockStages));
          for(var i = 0; i < updatedStages.length; i++) {
            updatedStages[i].display = true;
          }
          expect(vm.stages).toEqual(updatedStages);
        });

        it('should load the categories and set display to true on each', function() {
          expect(mockData.getCategories).toHaveBeenCalled();
          var updatedCategories = angular.fromJson(angular.toJson(mockCategories));
          for(var i = 0; i < updatedCategories.length; i++) {
            updatedCategories[i].display = true;
          }
          expect(vm.categories).toEqual(updatedCategories);
        });

        it('should load the services and set display to true on each', function() {
          expect(mockData.getServices).toHaveBeenCalled();
          var updatedServices = angular.fromJson(angular.toJson(mockServices));
          for(var i = 0; i < updatedServices.length; i++) {
            updatedServices[i].display = true;
          }
          expect(vm.services).toEqual(updatedServices);
        });

        it('should load the providers and set display to true on each', function() {
          expect(mockData.getProviders).toHaveBeenCalled();
          var updatedProviders = angular.fromJson(angular.toJson(mockProviders));
          for(var i = 0; i < updatedProviders.length; i++) {
            updatedProviders[i].display = true;
          }
          expect(vm.providers).toEqual(updatedProviders);
        });
      });

      describe('Filtering', function () {

        afterEach(function () {
          vm.showAll();
        })

        describe('Filtering by stage', function () {

          describe('Adding a filter', function () {

            it('should set the display and filtered flags on the stage to true', function () {
              vm.filterServices(2, 'stages');
              expect(vm.stages[1].display).toBe(true);
              expect(vm.stages[1].filtered).toBe(true);
            });

            it('should add the stage to the current filters', function () {
              vm.filterServices(2, 'stages');
              expect(vm.currentFilters.stages).toEqual([{id: 2, name: 'stage 2'}])
            });

            it('should add the stage to the query string', function () {
              vm.filterServices(2, 'stages');
              expect($location.search()).toEqual({stages: 2})
            });

            it('should filter by multiple stages', function () {
              vm.filterServices(2, 'stages');
              expect($location.search()).toEqual({stages: 2})
              scope.$apply();
              vm.filterServices(3, 'stages');
              expect(vm.currentFilters.stages).toEqual([{id: 2, name: 'stage 2'}, {id: 3, name: 'stage 3'}])
              expect($location.search()).toEqual({ stages: '2,3' })
            });

          });

          describe('Removing a filter', function () {
            it('should set the display and filtered flags on the stage to false', function () {
              vm.filterServices(2, 'stages');
              scope.$apply();
              vm.filterServices(3, 'stages');
              scope.$apply();
              vm.filterServices(2, 'stages');
              expect(vm.stages[1].display).toBe(false);
              expect(vm.stages[1].filtered).toBe(false);
            });

            it('should set the display to true on all stages and filtered to false if removing the last filter of type', function () {
              vm.filterServices(2, 'stages');
              scope.$apply();
              vm.filterServices(2, 'stages');
              expect(vm.stages[0].display).toBe(true);
              expect(vm.stages[1].display).toBe(true);
              expect(vm.stages[2].display).toBe(true);
              expect(vm.stages[1].filtered).toBe(false);
            });

            it('should remove the stage from the current filters', function () {
             vm.filterServices(2, 'stages');
              scope.$apply();
              vm.filterServices(2, 'stages');
              expect(vm.currentFilters.stages).toEqual([])
            });

            it('should remove the stage from the query string', function () {
              vm.filterServices(2, 'stages');
              scope.$apply();
              vm.filterServices(2, 'stages');
              expect($location.search()).toEqual({stages: ''})
            });
          });

          it('should update the css class for number of stages displayed', function () {
            vm.filterServices(2, 'stages');
            expect(vm.numStagesDisplayed).toBe(1);
            scope.$apply();
            vm.filterServices(3, 'stages');
            expect(vm.numStagesDisplayed).toBe(2);
          });

        });

        describe('Filtering by category', function () {

          describe('Adding a filter', function () {

            it('should set the display and filtered flags on the category to true', function () {
              vm.filterServices(2, 'categories');
              expect(vm.categories[1].display).toBe(true);
              expect(vm.categories[1].filtered).toBe(true);
            });

            it('should add the category to the current filters', function () {
              vm.filterServices(2, 'categories');
               expect(vm.currentFilters.categories).toEqual([{id: 2, name: 'category 2'}])
            });

            it('should add the category to the query string', function () {
              vm.filterServices(2, 'categories');
              expect($location.search()).toEqual({categories: 2})
            });

            it('should filter by multiple categories', function () {
              vm.filterServices(2, 'categories');
              expect($location.search()).toEqual({categories: 2})
              scope.$apply();
              vm.filterServices(3, 'categories');
              expect(vm.currentFilters.categories).toEqual([{id: 2, name: 'category 2'}, {id: 3, name: 'category 3'}])
              expect($location.search()).toEqual({ categories: '2,3' })
            });

          });

          describe('Removing a filter', function () {
            it('should set the display and filtered flags on the category to false', function () {
              vm.filterServices(2, 'categories');
              scope.$apply();
              vm.filterServices(3, 'categories');
              scope.$apply();
              vm.filterServices(2, 'categories');
              expect(vm.categories[1].display).toBe(false);
              expect(vm.categories[1].filtered).toBe(false);
            });

            it('should set the display to true on all categories and filtered to false if removing the last filter of type', function () {
              vm.filterServices(2, 'categories');
              scope.$apply();
              vm.filterServices(2, 'categories');
              expect(vm.categories[0].display).toBe(true);
              expect(vm.categories[1].display).toBe(true);
              expect(vm.categories[2].display).toBe(true);
              expect(vm.categories[1].filtered).toBe(false);
            });

            it('should remove the category from the current filters', function () {
             vm.filterServices(2, 'categories');
              scope.$apply();
              vm.filterServices(2, 'categories');
              expect(vm.currentFilters.categories).toEqual([])
            });

            it('should remove the category from the query string', function () {
              vm.filterServices(2, 'categories');
              scope.$apply();
              vm.filterServices(2, 'categories');
              expect($location.search()).toEqual({categories: ''})
            });
          });

        });

        describe('Filtering by provider', function () {

          describe('Adding a filter', function () {

            it('should set the display and filtered flags on the provider to true', function () {
              vm.filterServices(2, 'providers');
              expect(vm.providers[1].display).toBe(true);
              expect(vm.providers[1].filtered).toBe(true);
            });

            it('should add the provider to the current filters', function () {
              vm.filterServices(2, 'providers');
               expect(vm.currentFilters.providers).toEqual([{id: 2, name: 'provider 2'}]);
               expect(vm.filteredProviders).toEqual([2]);
            });

            it('should add the provider to the query string', function () {
              vm.filterServices(2, 'providers');
              expect($location.search()).toEqual({providers: 2});
            });

            it('should filter by multiple providers', function () {
              vm.filterServices(2, 'providers');
              expect($location.search()).toEqual({providers: 2});
              scope.$apply();
              vm.filterServices(3, 'providers');
              expect(vm.currentFilters.providers).toEqual([{id: 2, name: 'provider 2'}, {id: 3, name: 'provider 3'}])
              expect($location.search()).toEqual({ providers: '2,3' })
            });

          });

          describe('Removing a filter', function () {
            it('should set the display and filtered flags on the provider to false', function () {
              vm.filterServices(2, 'providers');
              scope.$apply();
              vm.filterServices(3, 'providers');
              scope.$apply();
              vm.filterServices(2, 'providers');
              expect(vm.providers[1].display).toBe(false);
              expect(vm.providers[1].filtered).toBe(false);
            });

            it('should set the display to true on all providers and filtered to false if removing the last filter of type', function () {
              vm.filterServices(2, 'providers');
              scope.$apply();
              vm.filterServices(2, 'providers');
              expect(vm.providers[0].display).toBe(true);
              expect(vm.providers[1].display).toBe(true);
              expect(vm.providers[2].display).toBe(true);
              expect(vm.providers[1].filtered).toBe(false);
            });

            it('should remove the provider from the current filters', function () {
             vm.filterServices(2, 'providers');
              scope.$apply();
              vm.filterServices(2, 'providers');
              expect(vm.currentFilters.providers).toEqual([]);
              expect(vm.filteredProviders).toEqual([]);
            });

            it('should remove the provider from the query string', function () {
              vm.filterServices(2, 'providers');
              scope.$apply();
              vm.filterServices(2, 'providers');
              expect($location.search()).toEqual({providers: ''});
            });
          });

        });

        describe('Reset all filters', function () {

          beforeEach(function () {
            vm.filterServices(1, 'stages');
            vm.filterServices(3, 'providers');
            scope.$apply();
            vm.showAll();
          });

          it('should close all filters', function () {
            expect(vm.expandFilters).toEqual({stages: false, categories: false, providers: false});
          });

          it('should reset each type of filter', function () {
            expect(vm.numStagesDisplayed).toEqual(mockStages.length);
            expect(vm.filteredProviders).toEqual([]);
            expect(vm.currentFilters.stages).toEqual([]);
            expect(vm.currentFilters.categories).toEqual([]);
            expect(vm.currentFilters.providers).toEqual([]);
          });

          it('should clear the query string', function () {
            expect($location.search()).toEqual({});
          });
        });

        describe('Reset a filter type', function () {

          it('should reset stage filters', function () {
            vm.filterServices(2, 'stages');
            vm.filterServices(3, 'stages');
            scope.$apply();
            vm.resetFilterType('stages');
            expect(vm.currentFilters.stages).toEqual([]);
            expect(vm.numStagesDisplayed).toEqual(mockStages.length);
            expect($location.search()).toEqual({stages: 'all'})
          });

          it('should reset category filters', function () {
            vm.filterServices(2, 'categories');
            vm.filterServices(3, 'categories');
            scope.$apply();
            vm.resetFilterType('categories');
            expect(vm.currentFilters.categories).toEqual([]);
            expect($location.search()).toEqual({categories: 'all'})
          });

          it('should reset provider filters', function () {
            vm.filterServices(2, 'providers');
            vm.filterServices(3, 'providers');
            scope.$apply();
            vm.resetFilterType('providers');
            expect(vm.currentFilters.providers).toEqual([]);
            expect($location.search()).toEqual({providers: 'all'})
          });
        });

      });

    });

    describe('Filtered view', function () {

      beforeEach(function () {
        setUpController({stages: '1', categories: '2'});
      });

      it('should update the filtered types', function () {
        expect(vm.stages[0].display).toBe(true);
        expect(vm.stages[0].filtered).toBe(true);

        expect(vm.stages[1].display).toBe(false);
        expect(vm.stages[1].filtered).toBe(false);
        expect(vm.stages[2].display).toBe(false);
        expect(vm.stages[2].filtered).toBe(false);

        expect(vm.categories[1].display).toBe(true);
        expect(vm.categories[1].filtered).toBe(true);
        expect(vm.categories[0].display).toBe(false);
        expect(vm.categories[0].filtered).toBe(false);
        expect(vm.categories[2].display).toBe(false);
        expect(vm.categories[2].filtered).toBe(false);

        expect(vm.numStagesDisplayed).toBe(1);
      });

      it('should not update the un-filtered types', function () {
        expect(vm.providers[0].display).toBe(true);
        expect(vm.providers[1].display).toBe(true);
        expect(vm.providers[2].display).toBe(true);
      });

      it('should update the currentFilters', function () {
        expect(vm.currentFilters).toEqual({stages: [{ id: 1, name: 'stage 1' }], categories: [{ id: 2, name: 'category 2' }], providers: []})
      });

    });

    describe('Searching for services', function () {

      describe('Using the search form', function () {

        beforeEach(function () {
          setUpController();
        });

        it('should find and show services that have the search term in the name', function () {
          vm.searchText = 'this one';
          vm.doSearch();

          expect(vm.services[0].display).toBe(true);
          expect(vm.services[0].filtered).toBe(true);

          expect(vm.services[1].display).toBe(false);
          expect(vm.services[1].filtered).toBe(false);
          expect(vm.services[2].display).toBe(false);
          expect(vm.services[2].filtered).toBe(false);
        });

        it('should find and show services that have the search term in the description', function () {
          vm.searchText = 'find me';
          vm.doSearch();

          expect(vm.services[1].display).toBe(true);
          expect(vm.services[1].filtered).toBe(true);

          expect(vm.services[0].display).toBe(false);
          expect(vm.services[0].filtered).toBe(false);
          expect(vm.services[2].display).toBe(false);
          expect(vm.services[2].filtered).toBe(false);
        });

        it('should find and show services that have the search term in the events', function () {
          vm.searchText = 'here I am';
          vm.doSearch();

          expect(vm.services[2].display).toBe(true);
          expect(vm.services[2].filtered).toBe(true);

          expect(vm.services[0].display).toBe(false);
          expect(vm.services[0].filtered).toBe(false);
          expect(vm.services[1].display).toBe(false);
          expect(vm.services[1].filtered).toBe(false);
        });

        it('should update the querystring with the search term', function () {
          vm.searchText = 'find me';
          vm.doSearch();
          expect($location.search()).toEqual({q: 'find me'});
        });

      });

      describe('From the query string', function () {

        beforeEach(function () {
          setUpController({q: 'find me'});
        });

        it('should find and show services that match the search term in the querystrong', function () {
          expect(vm.services[1].display).toBe(true);
          expect(vm.services[1].filtered).toBe(true);

          expect(vm.services[0].display).toBe(false);
          expect(vm.services[0].filtered).toBe(false);
          expect(vm.services[2].display).toBe(false);
          expect(vm.services[2].filtered).toBe(false);
        });

      });

    });

    describe('Viewing a service directly', function () {

      beforeEach(function () {
        setUpController({serviceId: 1});
      });

      it('should open the service modal and pass it the service id', function () {
        var dialogParams = {
          template: 'app/components/service/service.html',
          data: '{"id":1}',
          controller: 'ServiceController',
          controllerAs: 'service',
          className: 'ngdialog-theme-default service-modal'
        };
        expect(mockNgDialog.open).toHaveBeenCalledWith(dialogParams)
      });

    });

  });
})();
