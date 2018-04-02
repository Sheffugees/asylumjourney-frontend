/**
 * Filter service by current categories
 * Return true if service is in all filtered categories
 */

const serviceHasFilter = (service, filterType, filterId) => {
  if (!service._embedded[filterType]) {
    return false;
  }
 const hasFilter = service._embedded[filterType].filter(serviceFilter => {
    return serviceFilter.id == filterId;
  });
  return hasFilter.length ? true : false;
}

const categoriesFilter = () => {
  return function (service, filters) {
    let isInAllFilterTypes = true;

    if (!Object.keys(filters).length) {
      return true;
    }
    
    angular.forEach(filters, (filter, filterType) => {
      angular.forEach(filter, f => {
        if (!serviceHasFilter(service, filterType, f.id)) {
          isInAllFilterTypes = false;
        }
      });
    });
   
    return isInAllFilterTypes;
  }
};

export default categoriesFilter;