export default () => {
  return function (items, resource) {
    const filtered = [];

    if (!resource.length) {
      return items;
    }

    angular.forEach(items, item => {
      angular.forEach(item._embedded.resources, itemProvider => {
        angular.forEach(resource, id => {
          if (itemProvider.id === id) {
            if (isInArray(filtered, item.id)) {
              return;
            }
            filtered.push(item);
            return;
          }
        });
      });
    });

    return filtered;
  };
};

function isInArray(array, id) {
  return array.some(e => {
    return e.id === id;
  });
}
