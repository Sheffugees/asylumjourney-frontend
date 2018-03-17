export default () => {
  return function (items, category) {
    const filtered = [];
    angular.forEach(items, item => {
      angular.forEach(item._embedded.categories, itemCategory => {
        if (itemCategory.id === category) {
          filtered.push(item);
        }
      });
    });

    return filtered;
  };
};
