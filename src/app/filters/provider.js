export default () => {
  return function (items, provider) {
    const filtered = [];

    if (!provider.length) {
      return items;
    }

    angular.forEach(items, item => {
      angular.forEach(item._embedded.providers, itemProvider => {
        angular.forEach(provider, id => {
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
