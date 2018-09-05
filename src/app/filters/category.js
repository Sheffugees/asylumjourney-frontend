export default () => {
  return function (items, categoryId) {
    const filtered = [];
    angular.forEach(items, item => {
      if (item._embedded) {
        angular.forEach(item._embedded.categories, itemCategory => {
          if (itemCategory.id === categoryId) {
            filtered.push(item);
          }
        });
      }
    });

    return filtered;
  };
};
